import { useState } from 'react';
import CommentSection from './CommentSection';
import { buildAffiliateUrl } from '../lib/referral';

export default function ProviderCard({ provider, referralCode, referralLink, isAdmin = false }) {
  const [showComments, setShowComments] = useState(false);

  const code = referralCode || provider.referralCode || '';
  const link = referralLink || '';

  const handleBuy = () => {
    // 使用智能跳转逻辑，优先使用自定义分享链接
    const url = buildAffiliateUrl(provider.id, provider.buyUrl, code, link);
    window.open(url, '_blank');
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case '热门':
        return 'bg-gradient-to-r from-orange-400 to-red-400 text-white';
      case '旗舰':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white';
      case '新品':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case '免费':
        return 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden p-1">
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-full h-full object-contain"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=' + provider.name.charAt(0); }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{provider.description}</p>
          </div>
          {provider.isOfficial && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full shadow-sm">
              官方
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-slate-50 flex flex-wrap gap-1.5">
        {provider.features?.slice(0, 4).map((feature, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-white text-gray-600 text-xs rounded-md border border-gray-200 font-medium">
            ✓ {feature}
          </span>
        ))}
        {provider.discountInfo && (
          <span className="px-2 py-0.5 bg-gradient-to-r from-red-50 to-orange-50 text-orange-600 text-xs rounded-md border border-red-200 font-medium">
            🎁 {provider.discountInfo}
          </span>
        )}
      </div>

      {/* Models */}
      {provider.models && provider.models.length > 0 && (
        <div className="px-5 py-2 border-b border-gray-100">
          <p className="text-xs text-gray-400 mb-1">支持模型</p>
          <div className="flex flex-wrap gap-1">
            {provider.models.slice(0, 4).map((model, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-md">
                {model}
              </span>
            ))}
            {provider.models.length > 4 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">+{provider.models.length - 4}</span>
            )}
          </div>
        </div>
      )}

      {/* Packages */}
      <div className="p-5 flex-1">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium text-xs">套餐</th>
              <th className="pb-2 font-medium text-xs">价格</th>
              <th className="pb-2 font-medium text-xs">标签</th>
            </tr>
          </thead>
          <tbody>
            {provider.packages?.slice(0, 5).map((pkg, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 text-gray-700 text-xs font-medium">{pkg.name}</td>
                <td className="py-2.5 font-mono font-semibold text-gray-900 text-xs">
                  {pkg.price === 0 ? '免费' : `¥${pkg.discountPrice}`}
                </td>
                <td className="py-2.5">
                  {pkg.badge && (
                    <span className={`px-2 py-0.5 text-xs rounded-md font-medium ${getBadgeClass(pkg.badge)}`}>
                      {pkg.badge}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {provider.packages?.length > 5 && (
          <p className="text-xs text-gray-400 mt-2 text-center">还有 {provider.packages.length - 5} 个套餐 →</p>
        )}
      </div>

      {/* Actions - 水平对齐 */}
      <div className="px-5 pb-5 mt-auto">
        <div className="flex gap-3">
          <button
            onClick={handleBuy}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            立即购买
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center"
          >
            💬
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          providerId={provider.id}
          providerName={provider.name}
          onClose={() => setShowComments(false)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}