import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from "./../store/slices/authSlice"; // adjust path if needed
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
  Sprout,
  ChevronRight,
  CheckCircle,
  Globe,
  Shield,
  Zap
} from "lucide-react";

const iconMap = {
  image: ImageIcon,
  bluetooth: Bluetooth,
  barchart: BarChart3,
  cpu: Cpu,
  message: MessageSquare,
  satellite: Satellite,
  sprout: Sprout,
  users: Users,
  globe: Globe,
  shield: Shield,
  zap: Zap
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
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Krishi Mitra
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">{t('home.nav.features')}</a>
              <a href="#strategy" className="text-gray-600 hover:text-green-600 font-medium transition-colors">{t('home.nav.strategy')}</a>
              <a href="#methodology" className="text-gray-600 hover:text-green-600 font-medium transition-colors">{t('home.nav.methodology')}</a>
              <a href="#future" className="text-gray-600 hover:text-green-600 font-medium transition-colors">{t('home.nav.future')}</a>
            </div>

            <div className="flex items-center space-x-4">
  {isAuthenticated ? (
    <>
      <Link
        to="/dashboard"
        className="text-green-600 hover:text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
      >
        Dashboard
      </Link>
      <button
        onClick={() => dispatch(logoutUser())}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
      >
        {t('common.logout')}
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-green-600 hover:text-green-700 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-all"
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('home.badge')}
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {t('home.heroHeadlinePrefix')} <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{t('home.heroHeadlineHighlight')}</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {t('home.heroSub')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    {t('common.getStarted')}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-medium hover:bg-green-50 transition-all flex items-center justify-center"
                  >
                    {t('common.login')}
                  </Link>
                </>
              )}
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('home.heroBenefitsTitle')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {heroBenefits.map((benefit, index) => {
                  const BenefitIcon = iconMap[benefit.icon] || Leaf;
                  return (
                    <div key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 absolute inset-0 opacity-20"></div>
              <img 
                src="/images/placeholder.jpg" 
                alt="Krishi Mitra Dashboard" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900">{t('home.heroCardTitle')}</h3>
                      <p className="text-sm text-gray-600">{t('home.heroCardSubtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl flex items-center justify-center animate-pulse-slow">
              <Sprout className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl shadow-xl flex items-center justify-center animate-pulse-slow">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-green-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
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
                } group`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {(() => {
                    const FeatureIcon = iconMap[feature.icon] || Leaf;
                    return <FeatureIcon className="h-8 w-8" />;
                  })()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="mt-4">
                  <div className="inline-flex items-center text-green-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
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
          <div className="grid gap-8 lg:grid-cols-3">
            {pillars.map((pillar, index) => {
              const gradientClasses = [
                "bg-gradient-to-b from-green-50 to-white border border-green-100",
                "bg-gradient-to-b from-yellow-50 to-white border border-yellow-100",
                "bg-gradient-to-b from-blue-50 to-white border border-blue-100"
              ];
              const iconComponents = [Shield, Zap, Globe];
              const IconComponent = iconComponents[index % iconComponents.length];
              const gradientClass = gradientClasses[index % gradientClasses.length];
              return (
                <div key={index} className={`${gradientClass} rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{pillar.title}</h3>
                  <ul className="space-y-4 text-left text-gray-600">
                    {pillar.bullets?.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-gray-800">{bullet.emphasis}:</span> {bullet.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section id="methodology" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{methodologyData?.title}</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {methodologyData?.intro}
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            
            <ul className="space-y-12 pl-24 relative">
              {phases.map((phase, index) => (
                <li key={index} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-24 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-6 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.label}</h3>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section id="future" className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">{futureData?.title}</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">{futureData?.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Integration</h3>
              <p className="opacity-90">Advanced crop prediction and disease detection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <Globe className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Expansion</h3>
              <p className="opacity-90">Connecting farmers worldwide with market opportunities</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sustainable Farming</h3>
              <p className="opacity-90">Promoting eco-friendly agricultural practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Farming Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers already using Krishi Mitra to increase their yields and income.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Get Started Today
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-medium hover:bg-green-50 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Krishi Mitra</span>
              </div>
              <p className="max-w-md">
                Empowering farmers with technology to increase productivity, sustainability, and profitability.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#strategy" className="hover:text-white transition-colors">Strategy</a></li>
                <li><a href="#methodology" className="hover:text-white transition-colors">Methodology</a></li>
                <li><a href="#future" className="hover:text-white transition-colors">Future</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="mb-2">{footerData?.copyright}</p>
            <p>{footerData?.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;