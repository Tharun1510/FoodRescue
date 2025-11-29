import React, { useState } from 'react';
import { auth } from '../firebase';
// 1. Import Google Auth functions
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. Handle Email/Password Login
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/map');
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  // 3. Handle Google Login (New!)
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/map'); // Success! Go to map
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          {isLogin ? 'Restaurant Login' : 'Join FoodRescue'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full border p-3 rounded-lg focus:outline-none focus:border-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full border p-3 rounded-lg focus:outline-none focus:border-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="mx-2 text-gray-400 text-sm">OR</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* 4. Google Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span className="font-bold text-gray-700">Continue with Google</span>
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-green-600 font-bold underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
};

export default LoginPage;