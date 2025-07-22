import React from 'react';
import ModernLogin from '../components/ModernLogin';

function Login({ setToken, setUser }) {
  return <ModernLogin setToken={setToken} setUser={setUser} />;
}

export default Login;