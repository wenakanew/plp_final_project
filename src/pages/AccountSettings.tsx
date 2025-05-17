import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft, User, Key, LogOut, Shield, CreditCard, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AccountSettings = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser?.photoURL || '');
  const [username, setUsername] = useState(currentUser?.displayName || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    
    try {
      setLoading(true);
      setError('');
      await sendPasswordResetEmail(currentUser.email);
      setSuccess('Password reset email sent!');
    } catch (err) {
      setError('Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfilePicUpload = async () => {
    if (!profilePic || !currentUser) return;

    try {
      setLoading(true);
      setError('');
      
      const storage = getStorage();
      const storageRef = ref(storage, `profilePics/${currentUser.uid}`);
      
      await uploadBytes(storageRef, profilePic);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile(currentUser, {
        photoURL: downloadURL
      });
      
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError('Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!currentUser || !username.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      await updateProfile(currentUser, {
        displayName: username.trim()
      });
      
      setSuccess('Username updated successfully!');
      setIsEditingUsername(false);
    } catch (err) {
      setError('Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5 text-gray-300" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-pic-input"
                  className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors duration-300"
                  title="Change profile picture"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                  id="profile-pic-input"
                  aria-label="Profile picture upload"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-8 pb-8">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
                {success}
              </div>
            )}

            {/* Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" />
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Username</p>
                      {isEditingUsername ? (
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-800/50 border-gray-700 text-white"
                            placeholder="Enter username"
                          />
                          <Button
                            onClick={handleUsernameUpdate}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-white">{currentUser?.displayName || 'Not set'}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditingUsername(true)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{currentUser?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">User ID</p>
                      <p className="text-white font-mono text-sm">{currentUser?.uid}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Security
                  </h3>
                  <Button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/20"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    Subscription
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-green-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Active
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Plan</p>
                      <p className="text-white">Premium</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-indigo-400" />
                    Session
                  </h3>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            {profilePic && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleProfilePicUpload}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  {loading ? 'Uploading...' : 'Save Profile Picture'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 