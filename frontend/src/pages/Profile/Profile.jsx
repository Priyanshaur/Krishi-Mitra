import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit3, 
  Camera,
  Award,
  ShoppingCart,
  Leaf,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  // Mock data for profile statistics
  const profileStats = [
    { label: t('profile.stats.listings'), value: '12', icon: ShoppingCart },
    { label: t('profile.stats.orders'), value: '8', icon: ShoppingCart },
    { label: t('profile.stats.diagnoses'), value: '5', icon: Leaf },
    { label: t('profile.stats.revenue'), value: '₹42,500', icon: BarChart3 }
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, action: 'Listed new tomato crop', time: '2 hours ago', type: 'listing' },
    { id: 2, action: 'Completed diagnosis for potato leaves', time: '1 day ago', type: 'diagnosis' },
    { id: 3, action: 'Received order for onions', time: '2 days ago', type: 'order' },
    { id: 4, action: 'Updated profile information', time: '3 days ago', type: 'profile' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would dispatch an action to update the profile
    console.log('Profile updated:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('profile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="px-6 pb-6 -mt-16">
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-green-600 font-medium capitalize">{user?.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{user?.email}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Maharashtra, India</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Member since Jan 2024</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm">Verified Farmer</span>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? t('profile.cancel') : t('profile.edit')}
              </button>
            </div>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.overview')}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {profileStats.map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Details and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.details')}</h3>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('profile.name')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('profile.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('profile.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('profile.location')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('profile.bio')}
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      {t('profile.save')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.name')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.email')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.phone')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.location')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">Pune, Maharashtra</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.bio')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Experienced farmer with 15+ years in sustainable agriculture. Specialized in tomato and onion cultivation.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('profile.recentActivity')}</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        {activity.type === 'listing' && <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'diagnosis' && <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'order' && <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'profile' && <User className="h-4 w-4 text-green-600 dark:text-green-400" />}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;