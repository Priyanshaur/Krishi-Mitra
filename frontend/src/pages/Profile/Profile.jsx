import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { updateProfile } from '../../store/slices/authSlice';
import { fetchUserMarketItems } from '../../store/slices/marketSlice';
import { fetchDiagnosisHistory } from '../../store/slices/diagnosisSlice';
import { fetchFarmerOrders } from '../../store/slices/farmerOrderSlice';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const { userItems } = useSelector(state => state.market);
  const { history: diagnosisHistory } = useSelector(state => state.diagnosis);
  const { orders } = useSelector(state => state.farmerOrders);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with real user data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchUserMarketItems());
    dispatch(fetchDiagnosisHistory());
    if (user?.role === 'farmer') {
      dispatch(fetchFarmerOrders());
    }
  }, [dispatch, user?.role]);

  // Calculate Stats
  const profileStats = [
    { label: t('profile.stats.listings'), value: userItems?.length || 0, icon: ShoppingCart },
    { label: t('profile.stats.orders'), value: orders?.length || 0, icon: ShoppingCart }, // Using ShoppingCart for orders too for now
    { label: t('profile.stats.diagnoses'), value: diagnosisHistory?.length || 0, icon: Leaf },
    { label: t('profile.stats.revenue'), value: `₹${orders?.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toLocaleString()}`, icon: BarChart3 }
  ];

  // Generate Recent Activity
  const getRecentActivity = () => {
    const activity = [];

    // Add Listings
    userItems?.forEach(item => {
      activity.push({
        id: `listing-${item._id}`,
        action: `Listed new ${item.name}`,
        time: new Date(item.createdAt),
        type: 'listing'
      });
    });

    // Add Diagnoses
    diagnosisHistory?.forEach(item => {
      activity.push({
        id: `diagnosis-${item.id || item._id}`,
        action: `Completed diagnosis for ${item.crop_type || 'plant'}`,
        time: new Date(item.created_at || item.createdAt),
        type: 'diagnosis'
      });
    });

    // Add Orders
    orders?.forEach(order => {
      activity.push({
        id: `order-${order._id}`,
        action: `Received order for ${order.items?.[0]?.name || 'items'}`,
        time: new Date(order.createdAt),
        type: 'order'
      });
    });

    // Add Profile Update (Mock for now as we don't track this yet)
    if (user?.updatedAt) {
      activity.push({
        id: 'profile-update',
        action: 'Updated profile information',
        time: new Date(user.updatedAt),
        type: 'profile'
      });
    }

    // Sort by time (newest first) and take top 5
    return activity.sort((a, b) => b.time - a.time).slice(0, 5).map(item => ({
      ...item,
      time: timeAgo(item.time)
    }));
  };

  const recentActivity = getRecentActivity();

  // Helper for time ago
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(profileData));
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
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {user?.profile ? (
                      <img src={user.profile} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
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
                  <span className="text-sm">{user?.location || "Location not set"}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm">Verified Member</span>
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
                      disabled // Email usually shouldn't be editable
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
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
                      <p className="font-medium text-gray-900 dark:text-white">{user?.phone || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('profile.location')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user?.location || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('profile.bio')}</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.bio || 'No bio added yet.'}
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
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
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
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;