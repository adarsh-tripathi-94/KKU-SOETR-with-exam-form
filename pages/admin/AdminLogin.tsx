import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role, AdminRole } from '../../types';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'soe.bkt1980@gmail.com' && password === 'brijesh@1980') {
      login(Role.ADMIN, email, AdminRole.SUPER_ADMIN);
      navigate('/admin-dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-kku-blue py-6 px-4 text-center opacity-100">
          <h2 className="text-2xl font-serif font-bold text-kku-gold opacity-100">SOETR Admin Portal</h2>
          <p className="text-white font-bold text-sm mt-1 opacity-100">Authorized Access Only</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="bg-red-100 text-red-800 p-3 rounded text-sm text-center font-bold opacity-100 border border-red-800">{error}</div>}
            <div>
              <label className="block text-sm font-bold text-black opacity-100">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border-2 border-black bg-white text-black font-bold opacity-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-kku-blue placeholder-gray-600"
                placeholder="Admin email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black opacity-100">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border-2 border-black bg-white text-black font-bold opacity-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-kku-blue placeholder-gray-600"
                placeholder="Admin password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border-2 border-black rounded-md shadow-sm text-sm font-bold text-white bg-kku-gold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kku-gold opacity-100"
            >
              Sign In to Admin Panel
            </button>
            <div className="text-center mt-4 text-sm font-bold text-black opacity-100">
               <button type="button" onClick={() => navigate('/')} className="hover:underline text-kku-blue font-bold opacity-100">Return to Student Portal</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
