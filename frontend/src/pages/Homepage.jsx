import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice' // adjust path if needed
import {
  Leaf,
  BarChart3,
  Cpu,
  MessageSquare,
  Satellite,
  TrendingUp,
  Image as ImageIcon,
  Bluetooth,
  Users,
  Sprout
} from "lucide-react";

const iconMap = {
  image: ImageIcon,
  bluetooth: Bluetooth,
  barchart: BarChart3,
  cpu: Cpu,
  message: MessageSquare,
  satellite: Satellite,
  sprout: Sprout,
  users: Users
};

const HomePage = () => {
  const { t } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);   // ✅ FIX

  const featureItems = t('home.features', { returnObjects: true });
  const features = Array.isArray(featureItems) ? featureItems : [];
  const statsItems = t('home.stats', { returnObjects: true });
  const stats = Array.isArray(statsItems) ? statsItems : [];
  const heroBenefitItems = t('home.heroBenefits', { returnObjects: true });
  const heroBenefits = Array.isArray(heroBenefitItems) ? heroBenefitItems : [];
  const strategyData = t('home.strategy', { returnObjects: true });
  const pillars = Array.isArray(strategyData?.pillars) ? strategyData.pillars : [];
  const methodologyData = t('home.methodology', { returnObjects: true });
  const phases = Array.isArray(methodologyData?.phases) ? methodologyData.phases : [];
  const futureData = t('home.future', { returnObjects: true }) || {};
  const footerData = t('home.footer', { returnObjects: true }) || {};

  useEffect(() => {
    if (!features.length) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Krishi Mitra
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">{t('home.nav.features')}</a>
              <a href="#strategy" className="text-gray-600 hover:text-green-600 transition-colors">{t('home.nav.strategy')}</a>
              <a href="#methodology" className="text-gray-600 hover:text-green-600 transition-colors">{t('home.nav.methodology')}</a>
              <a href="#future" className="text-gray-600 hover:text-green-600 transition-colors">{t('home.nav.future')}</a>
            </div>

            <div className="flex items-center space-x-4">
  {isAuthenticated ? (
    <>
      <Link
        to="/dashboard"
        className="text-green-600 hover:text-green-700 font-medium"
      >
        {t('common.dashboard')}
      </Link>
      <button
        onClick={() => dispatch(logout())}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
      >
        {t('common.logout')}
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-green-600 hover:text-green-700 font-medium"
      >
        {t('common.login')}
      </Link>
      <Link
        to="/register"
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
      >
        {t('common.getStarted')}
      </Link>
    </>
  )}
</div>


          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('home.badge')}
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('home.heroHeadlinePrefix')} <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{t('home.heroHeadlineHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('home.heroSub')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-4 sm:gap-0 text-sm text-gray-500">
              {heroBenefits.map((benefit, index) => {
                const BenefitIcon = iconMap[benefit.icon] || Leaf;
                return (
                  <div key={index} className="flex items-center">
                    <BenefitIcon className="h-5 w-5 text-green-500 mr-2" />
                    {benefit.text}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl shadow-lg w-full h-80 flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">{t('home.heroCardTitle')}</h3>
                  <p className="text-gray-600 mt-2">{t('home.heroCardSubtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY */}
      <section id="strategy" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{strategyData?.title}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {strategyData?.intro}
            </p>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {pillars.map((pillar, index) => {
              const gradientClasses = [
                "bg-gradient-to-b from-green-50 to-white border border-green-100",
                "bg-gradient-to-b from-yellow-50 to-white border border-yellow-100",
                "bg-gradient-to-b from-blue-50 to-white border border-blue-100"
              ];
              const gradientClass = gradientClasses[index % gradientClasses.length];
              return (
                <div key={index} className={`${gradientClass} rounded-3xl p-8 shadow-lg`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                  <ul className="space-y-3 text-left text-gray-600">
                    {pillar.bullets?.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>
                        <span className="font-semibold text-gray-800">{bullet.emphasis}:</span> {bullet.text}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.featuresTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  currentFeature === index ? "border-green-500" : "border-transparent"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6">
                  {(() => {
                    const FeatureIcon = iconMap[feature.icon] || Leaf;
                    return <FeatureIcon className="h-8 w-8" />;
                  })()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section id="methodology" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{methodologyData?.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {methodologyData?.intro}
          </p>
          <ul className="mt-10 space-y-4 text-left text-gray-700">
            {phases.map((phase, index) => (
              <li key={index} className="bg-white border border-green-100 rounded-2xl shadow-sm px-6 py-4">
                <span className="block font-semibold text-gray-900">{phase.label}</span>
                <span className="block mt-2 text-gray-600">{phase.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section id="future" className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">{futureData?.title}</h2>
          <p className="text-lg mb-6">{futureData?.description}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p className="mb-2">{footerData?.copyright}</p>
        <p>{footerData?.tagline}</p>
      </footer>
    </div>
  );
};

export default HomePage;
