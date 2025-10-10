import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePreferences } from '../../store/slices/authSlice';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: ''
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: i18n.language || 'en'
  });

  // Update preferences state when i18n language changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      language: i18n.language || 'en'
    }));
  }, [i18n.language]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Handle preferences changes
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setPreferences({
      ...preferences,
      [name]: newValue
    });
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    // Only send fields that have values
    const dataToSend = {};
    if (profileData.name && profileData.name !== user.name) {
      dataToSend.name = profileData.name;
    }
    if (profileData.email && profileData.email !== user.email) {
      dataToSend.email = profileData.email;
    }
    if (profileData.newPassword) {
      dataToSend.currentPassword = profileData.currentPassword;
      dataToSend.newPassword = profileData.newPassword;
    }
    
    if (Object.keys(dataToSend).length > 0) {
      dispatch(updateProfile(dataToSend));
    }
  };

  // Handle preferences update
  const handlePreferencesUpdate = () => {
    // Update dark mode
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    // Update language using i18n
    i18n.changeLanguage(preferences.language);
    
    // Dispatch to backend
    dispatch(updatePreferences({
      darkMode: preferences.darkMode,
      language: preferences.language
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings.title')}</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('settings.profile.title')}</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.profile.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('settings.profile.namePlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.profile.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('settings.profile.emailPlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.profile.currentPassword')}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('settings.profile.currentPasswordPlaceholder')}
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.profile.newPassword')}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('settings.profile.newPasswordPlaceholder')}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? t('settings.profile.updating') : t('settings.profile.updateButton')}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Preferences Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('settings.preferences.title')}</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{t('settings.preferences.darkMode')}</h3>
                  <p className="text-sm text-gray-500">{t('settings.preferences.darkModeDescription')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="darkMode"
                    checked={preferences.darkMode}
                    onChange={handlePreferencesChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.preferences.language')}
              </label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handlePreferencesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">{t('settings.preferences.english')}</option>
                <option value="hi">{t('settings.preferences.hindi')}</option>
                <option value="mr">{t('settings.preferences.marathi')}</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handlePreferencesUpdate}
                disabled={loading}
                className="w-full"
              >
                {loading ? t('settings.preferences.updating') : t('settings.preferences.updateButton')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;