import { useState } from 'react';

function passwordStrength(password) {
  if (!password) return '';
  if (password.length < 6) return 'Weak';
  if (
    password.match(/[A-Z]/) &&
    password.match(/[0-9]/) &&
    password.length >= 8
  )
    return 'Strong';
  return 'Medium';
}

function SignUp() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match!');
      return;
    }
    const res = await fetch('http://localhost:5002/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccess('Account created! Please sign in.');
      setForm({ name: '', email: '', password: '', confirm: '' });
    } else {
      setError(data.error || 'Sign up failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form
        className="max-w-md w-full p-8 bg-white rounded shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#27272a' }}>
          Create Your Study_Buddy Account
        </h2>
        <p className="mb-6 text-gray-600">
          Join as a Student or Teacher and unlock smarter learning!
        </p>
        <div className="mb-4 flex gap-4 justify-center">
          <button
            type="button"
            className="px-4 py-2 rounded font-semibold transition"
            style={{
              backgroundColor: role === 'student' ? '#27272a' : '#f3f4f6',
              color: role === 'student' ? '#fff' : '#27272a',
            }}
            onClick={() => setRole('student')}
          >
            👨‍🎓 Student
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded font-semibold transition"
            style={{
              backgroundColor: role === 'teacher' ? '#27272a' : '#f3f4f6',
              color: role === 'teacher' ? '#fff' : '#27272a',
            }}
            onClick={() => setRole('teacher')}
          >
            👩‍🏫 Teacher
          </button>
        </div>
        <label className="block mb-2 font-medium">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="w-full p-2 mb-4 border rounded"
          value={form.name}
          onChange={handleChange}
        />
        <label className="block mb-2 font-medium">Email</label>
        <input
          name="email"
          type="email"
          placeholder="Your email"
          required
          className="w-full p-2 mb-4 border rounded"
          value={form.email}
          onChange={handleChange}
        />
        <label className="block mb-2 font-medium">Password</label>
        <div className="relative mb-2">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            required
            className="w-full p-2 border rounded"
            value={form.password}
            onChange={handleChange}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div className="mb-2 text-sm">
          Password strength:{' '}
          <span className="font-bold">{passwordStrength(form.password)}</span>
        </div>
        <label className="block mb-2 font-medium">Confirm Password</label>
        <input
          name="confirm"
          type="password"
          placeholder="Confirm password"
          required
          className="w-full p-2 mb-4 border rounded"
          value={form.confirm}
          onChange={handleChange}
        />
        <div className="flex items-center mb-4">
          <input type="checkbox" id="terms" required className="mr-2" />
          <label htmlFor="terms" className="text-sm">
            I agree to the{' '}
            <a href="#" className="text-green-600 underline">
              Terms & Privacy Policy
            </a>
          </label>
        </div>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded font-semibold transition"
          style={{ backgroundColor: '#27272a', color: '#fff' }}
        >
          Sign Up
        </button>
        <div className="mt-6 text-center">
          <span>Already have an account? </span>
          <a href="/signin" style={{ color: '#27272a', fontWeight: 'bold' }}>
            Sign In
          </a>{' '}
        </div>
        {/* <div className="mt-6 text-center">
          <button
            type="button"
            className="w-full py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition"
          >
            Sign up with Google
          </button>
        </div> */}
      </form>
    </div>
  );
}

export default SignUp;
