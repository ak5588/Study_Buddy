import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ for navigation

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5002/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setError('');
        setMessage('Signed in successfully. Welcome, ' + data.name + '!');

        // ✅ Store user info for session
        localStorage.setItem('user', JSON.stringify(data));

        // ✅ Redirect based on role
        setTimeout(() => {
          if (data.role === 'teacher') {
            navigate('/teacher-dashboard');
          } else {
            navigate('/home');
          }
        }, 1000); // short delay to show success message
      } else {
        setError(data.error || 'Sign in failed');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form
        className="max-w-md w-full p-8 bg-white rounded shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-2 text-zinc-800">
          Welcome Back to Study Buddy!
        </h2>
        <p className="mb-6 text-gray-600">
          Sign in to continue your learning journey.
        </p>

        {/* Role Selection */}
        <div className="mb-4 flex gap-4 justify-center">
          {['student', 'teacher'].map((r) => (
            <button
              key={r}
              type="button"
              className={`px-4 py-2 rounded font-semibold transition ${
                role === r ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-zinc-800'
              }`}
              onClick={() => setRole(r)}
            >
              {r === 'student' ? '👨‍🎓 Student' : '👩‍🏫 Teacher'}
            </button>
          ))}
        </div>

        {/* Email */}
        <label className="block mb-2 font-medium">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={handleChange}
        />

        {/* Password */}
        <label className="block mb-2 font-medium">Password</label>
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            required
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {/* Error and Success */}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {message && <div className="mb-4 text-green-600">{message}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded font-semibold bg-zinc-800 text-white hover:bg-zinc-700 transition"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span>Don’t have an account? </span>
          <a href="/signup" className="font-bold text-zinc-800">
            Sign Up
          </a>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
