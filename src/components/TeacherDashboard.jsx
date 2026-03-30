import { useState, useEffect, useContext } from 'react';
import { AppContext } from './AppContext';
import { Navbar } from './Navbar';
import Card from "./UIComponents/Card";
import { Button } from './UIComponents/Button';
import { Upload, FileText } from 'lucide-react';

function TeacherDashboard() {
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null });
  const [message, setMessage] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!profile.email) return;
      setLoadingProfile(true);
      try {
        const response = await fetch(`http://127.0.0.1:5002/teacher/profile/${profile.email}`);
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile({
            name: data.profile.name || '',
            email: data.profile.email || '',
            bio: data.profile.bio || '',
          });
        } else {
          setMessage('Failed to load profile');
        }
      } catch (error) {
        setMessage('Error loading profile');
      } finally {
        setLoadingProfile(false);
      }
    }

    async function fetchMaterials() {
      if (!profile.email) return;
      setLoadingMaterials(true);
      try {
        const response = await fetch(`http://127.0.0.1:5002/teacher/materials/${profile.email}`);
        const data = await response.json();
        if (data.success && data.materials) {
          setMaterials(data.materials);
        } else {
          setMessage('Failed to load materials');
        }
      } catch (error) {
        setMessage('Error loading materials');
      } finally {
        setLoadingMaterials(false);
      }
    }

    if (profile.email) {
      fetchProfile();
      fetchMaterials();
    }
  }, [profile.email]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleMaterialChange = (e) => {
    const { name, value, files } = e.target;
    setNewMaterial({ ...newMaterial, [name]: files ? files[0] : value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5002/teacher/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: profile.email,
          name: profile.name,
          bio: profile.bio,
        }),
      });
      const data = await res.json();
      setMessage(data.success ? 'Profile updated successfully' : 'Update failed');
    } catch (err) {
      setMessage('Failed to update');
    }
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!newMaterial.title || !newMaterial.file) {
      setMessage('Please add title and file');
      return;
    }

    const formData = new FormData();
    formData.append('file', newMaterial.file);
    formData.append('title', newMaterial.title);
    formData.append('description', newMaterial.description);
    formData.append('teacher_email', profile.email);

    try {
      const res = await fetch('http://127.0.0.1:5002/teacher/materials', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMaterials((prev) => [...prev, newMaterial]);
        setNewMaterial({ title: '', description: '', file: null });
        setMessage('Material uploaded');
      } else {
        setMessage('Upload failed');
      }
    } catch (err) {
      setMessage('Error uploading material');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto py-10 px-6 space-y-10">
        {message && <div className="text-green-600 font-medium">{message}</div>}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Teacher Profile</h2>
          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={profile.bio}
                onChange={handleProfileChange}
                className="w-full border p-2 rounded"
              />
              <Button type="submit">Update Profile</Button>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Study Material</h2>
          <form onSubmit={handleMaterialSubmit} className="space-y-4">
            <input
              name="title"
              placeholder="Title"
              value={newMaterial.title}
              onChange={handleMaterialChange}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newMaterial.description}
              onChange={handleMaterialChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="file"
              type="file"
              onChange={handleMaterialChange}
              className="w-full border p-2 rounded"
              required
            />
            <Button type="submit">
              <Upload className="w-4 h-4 mr-2" /> Upload
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Uploaded Materials</h2>
          {loadingMaterials ? (
            <p>Loading materials...</p>
          ) : materials.length === 0 ? (
            <p>No materials uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((item, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                    </div>
                    <FileText className="text-gray-400 w-5 h-5" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default TeacherDashboard;
