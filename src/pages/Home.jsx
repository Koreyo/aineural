import { useState } from 'react';
import { useProviders, useSettings } from '../hooks/useData';
import ProviderCard from '../components/ProviderCard';

export default function HomePage({ isAdmin = false }) {
  const { providers, loading } = useProviders();
  const { settings } = useSettings();
  const [search, setSearch] = useState('');

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.models?.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 py-16 px-4 overflow-hidden">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">国内最全的 AI Token 比价指南</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Token 套餐比价指南
          </h1>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            聚合国内主流 AI 服务商的 Token 套餐信息，一站式比价购买
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索服务商、大模型..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-teal-700 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* 统计 */}
          <div className="flex justify-center gap-8 mt-6 text-teal-100 text-sm">
            <span>📊 {providers.length} 家服务商</span>
            <span>🤖 {providers.reduce((acc, p) => acc + (p.models?.length || 0), 0)} 个大模型</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">正在加载服务商数据...</p>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">没有找到匹配的服务商</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 text-teal-600 hover:text-teal-700">
                清除搜索
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                referralCode={settings.referralCodes?.[provider.id]}
                referralLink={settings.referralLinks?.[provider.id]}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 TokenHub · 让 AI 更便宜
          </p>
        </div>
      </footer>
    </div>
  );
}