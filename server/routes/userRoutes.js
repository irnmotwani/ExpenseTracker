const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const TripGroup = require('../models/TripGroup');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

/**
 * Get user profile
 * GET /api/users/profile
 */
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Update user profile
 * PUT /api/users/profile
 */
router.put('/profile', async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update basic info
    user.username = username || user.username;
    user.email = email || user.email;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get user statistics
 * GET /api/users/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total groups where user is member or creator
    const totalGroups = await TripGroup.countDocuments({
      $or: [
        { created_by: userId },
        { 'members.user': userId }
      ]
    });

    // Get total expenses paid by user
    const totalExpenses = await Expense.countDocuments({ paid_by: userId });

    // Get total amount spent by user
    const expenseAggregation = await Expense.aggregate([
      { $match: { paid_by: userId } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalAmount = expenseAggregation.length > 0 ? expenseAggregation[0].totalAmount : 0;

    // Get total settlements involving user
    const totalSettlements = await Settlement.countDocuments({
      $or: [
        { from_user_id: userId },
        { to_user_id: userId }
      ]
    });

    res.json({
      totalGroups,
      totalExpenses,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      totalSettlements
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Delete user account
 * DELETE /api/users/profile
 */
router.delete('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's expenses
    await Expense.deleteMany({ paid_by: userId });

    // Delete user's settlements
    await Settlement.deleteMany({
      $or: [
        { from_user_id: userId },
        { to_user_id: userId }
      ]
    });

    // Remove user from groups
    await TripGroup.updateMany(
      { 'members.user': userId },
      { $pull: { members: { user: userId } } }
    );

    // Delete groups created by user (if no other members)
    const userGroups = await TripGroup.find({ created_by: userId });
    for (const group of userGroups) {
      if (group.members.length <= 1) {
        await TripGroup.findByIdAndDelete(group._id);
      } else {
        // Transfer ownership to first member
        const newOwner = group.members.find(member => member.user.toString() !== userId);
        if (newOwner) {
          group.created_by = newOwner.user;
          await group.save();
        }
      }
    }

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;