// Import required modules
const TripGroup = require('../models/TripGroup');
const User = require('../models/User');

/**
 * Get all groups for the authenticated user
 * GET /api/groups
 */
exports.getUserGroups = async (req, res) => {
  try {
    // Find groups where user is either creator or member
    const groups = await TripGroup.find({
      $or: [
        { created_by: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('created_by', 'username email')
    .populate('members.user', 'username email')
    .sort({ createdAt: -1 }); // Most recent first

    res.json({
      groups: groups.map(group => ({
        _id: group._id,
        name: group.name,
        start_date: group.start_date,
        end_date: group.end_date,
        created_by: group.created_by,
        members: group.members,
        member_count: group.members.length,
        created_at: group.createdAt
      }))
    });

  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new group
 * POST /api/groups
 */
exports.createGroup = async (req, res) => {
  try {
    const { name, start_date, end_date } = req.body;

    // Validation
    if (!name || !start_date || !end_date) {
      return res.status(400).json({
        message: 'Name, start_date, and end_date are required'
      });
    }

    // Create new group
    const group = new TripGroup({
      name: name.trim(),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      created_by: req.user.id,
      members: [{
        user: req.user.id,
        joined_at: new Date()
      }]
    });

    await group.save();

    // Populate user details for response
    await group.populate('created_by', 'username email');
    await group.populate('members.user', 'username email');

    res.status(201).json({
      message: 'Group created successfully',
      group: {
        _id: group._id,
        name: group.name,
        start_date: group.start_date,
        end_date: group.end_date,
        created_by: group.created_by,
        members: group.members,
        member_count: group.members.length,
        created_at: group.createdAt
      }
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add member to group
 * POST /api/groups/:groupId/members
 */
exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: 'User not found with this email'
      });
    }

    // Find the group
    const group = await TripGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: 'Group not found'
      });
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => 
      member.user.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: 'User is already a member of this group'
      });
    }

    // Add user to group
    group.members.push({
      user: user._id,
      joined_at: new Date()
    });

    await group.save();

    // Populate user details for response
    await group.populate('created_by', 'username email');
    await group.populate('members.user', 'username email');

    res.json({
      message: 'Member added successfully',
      group: {
        _id: group._id,
        name: group.name,
        start_date: group.start_date,
        end_date: group.end_date,
        created_by: group.created_by,
        members: group.members,
        member_count: group.members.length,
        created_at: group.createdAt
      }
    });

  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};