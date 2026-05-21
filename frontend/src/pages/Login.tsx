import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/auth/login',
        formData
      );

      localStorage.setItem(
        'token',
        response.data.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.data.user)
      );

      navigate('/dashboard');
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          'Login failed'
      );
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-6">

      {/* Glow Background */}
      <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="bg-gradient-to-r from-white via-purple-300 to-purple-500 bg-clip-text text-7xl font-black tracking-tight text-transparent">
            GigFlow
          </h1>

          <p className="mt-4 text-lg text-gray-400">
            AI Powered Smart Leads CRM
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <h2 className="mb-8 text-3xl font-bold text-white">
            Welcome Back
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 text-lg font-semibold text-white transition hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;