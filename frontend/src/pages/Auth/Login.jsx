import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google'; // ✅ Import Google Button
import { login, clearError } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  // ✅ Google Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Call API directly to exchange token
      const res = await authAPI.googleLogin(credentialResponse.credential);
      
      // Manually update Redux state (hacky but fast) or dispatch a generic success action
      // Ideally, create a 'googleLogin' thunk in authSlice similar to 'login'
      localStorage.setItem('token', res.token);
      window.location.reload(); // Refresh to let App.jsx fetchUser pick it up
    } catch (err) {
      console.error('Google Login Failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          Sign in to Krishi Mitra
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
            
            {/* Email & Password Inputs ... (Keep existing code) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* ✅ Google Button Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
            </div>
            <div className="mt-6 flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Login Failed')} />
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-green-600 hover:text-green-500">Don't have an account? Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;