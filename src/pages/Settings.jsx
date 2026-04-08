import { useState, useEffect } from 'react';
import { useProviders, useSettings } from '../hooks/useData';

export default function SettingsPage({ onLogout }) {
  const { providers, loading: providersLoading } = useProviders();
  const { settings, loading: settingsLoading, updateReferralCode, updateReferralLink } = useSettings();
  const [saving, setSaving] = useState({});
  const [codes, setCodes] = useState({});
  const [links, setLinks] = useState({});
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState('code'); // 'code' 或 'link'

  // 初始化 codes 和 links
  if (providers.length > 0 && Object.keys(codes).length === 0) {
    const initialCodes = {};
    const initialLinks = {};
    providers.forEach(p => {
      initialCodes[p.id] = settings.referralCodes?.[p.id] || '';
      initialLinks[p.id] = settings.referralLinks?.[p.id] || '';
    });
    setCodes(initialCodes);
    setLinks(initialLinks);
  }

  const handleSaveCode = async (providerId) => {
    setSaving({ ...saving, [providerId]: true });
    const success = await updateReferralCode(providerId, codes[providerId]);
    setSaving({ ...saving, [providerId]: false });
    if (success) {
      setSavedMsg(providerId);
      setTimeout(() => setSavedMsg(''), 2000);
    }
  };

  const handleSaveLink = async (providerId) => {
    setSaving({ ...saving, [providerId]: true });
    const success = await updateReferralLink(providerId, links[providerId]);
    setSaving({ ...saving, [providerId]: false });
    if (success) {
      setSavedMsg(providerId + '_link');
      setTimeout(() => setSavedMsg(''), 2000);
    }
  };

  const handleSaveAll = async () => {
    for (const provider of providers) {
      if (codes[provider.id]) {
        await updateReferralCode(provider.id, codes[provider.id]);
      }
      if (links[provider.id]) {
        await updateReferralLink(provider.id, links[provider.id]);
      }
    }
    alert('全部保存成功！');
  };

  if (providersLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/" className="text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1">
              ← 返回首页
            </a>
          </div>
          <button 
            onClick={onLogout} 
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            退出登录
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Title */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-5">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🔗</span> 邀请链接管理
            </h1>
            <p className="text-teal-100 text-sm mt-1">配置各服务商的邀请码或分享链接，用户购买时将自动跳转</p>
          </div>

          {/* Tab */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'code' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 邀请码
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'link' 
                  ? 'text-teal-600 border-b-2 border-teal-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔗 分享链接
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">共 {providers.length} 个服务商</p>
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
              >
                全部保存
              </button>
            </div>

            <div className="space-y-3">
              {providers.map((provider) => (
                <div key={provider.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl hover:shadow-md transition-shadow">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="w-10 h-10 rounded-lg object-contain bg-white shadow-sm"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=' + provider.name.charAt(0); }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{provider.name}</span>
                      {provider.isOfficial && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded">官方</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{provider.buyUrl}</p>
                  </div>
                  
                  {activeTab === 'code' ? (
                    <>
                      <input
                        type="text"
                        placeholder="输入邀请码"
                        value={codes[provider.id] || ''}
                        onChange={(e) => setCodes({ ...codes, [provider.id]: e.target.value })}
                        className="w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
                      />
                      <button
                        onClick={() => handleSaveCode(provider.id)}
                        disabled={saving[provider.id]}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          savedMsg === provider.id 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'
                        } disabled:opacity-50`}
                      >
                        {saving[provider.id] ? '保存中...' : savedMsg === provider.id ? '✓ 已保存' : '保存'}
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="输入完整分享链接（https://...）"
                        value={links[provider.id] || ''}
                        onChange={(e) => setLinks({ ...links, [provider.id]: e.target.value })}
                        className="w-80 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm"
                      />
                      <button
                        onClick={() => handleSaveLink(provider.id)}
                        disabled={saving[provider.id + '_link']}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          savedMsg === provider.id + '_link'
                            ? 'bg-green-500 text-white' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                        } disabled:opacity-50`}
                      >
                        {saving[provider.id + '_link'] ? '保存中...' : savedMsg === provider.id + '_link' ? '✓ 已保存' : '保存'}
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span> 使用说明
          </h3>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>• <strong>邀请码</strong>：输入简短的邀请码（如 B6MSXO9C8N），系统会自动拼接参数</li>
            <li>• <strong>分享链接</strong>：输入完整的推广链接（如 https://volcengine.com/L/xxx），优先于邀请码</li>
            <li>• 用户点击购买时，优先使用分享链接，其次使用邀请码</li>
            <li>• 分享链接会直接跳转，不带任何参数</li>
          </ul>
        </div>
      </div>
    </div>
  );
}