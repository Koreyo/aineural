import { useState } from 'react';

const ADMIN_PASSWORD = 'tokenhub2026';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('请输入密码');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setError('');

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', 'logged_in');
      localStorage.setItem('admin_time', Date.now().toString());
      onLogin(true);
    } else {
      setError('密码错误，请重试');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center px-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-teal-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">管理员登录</h1>
          <p className="text-teal-300">TokenHub 后台管理系统</p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className={`bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 shadow-2xl ${shake ? 'animate-shake' : ''}`}
        >
          <div className="mb-6">
            <label className="block text-teal-200 text-sm font-medium mb-2">管理密码</label>
            <input
              type="password"
              placeholder="请输入管理密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 focus:bg-white/20 transition-all"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                验证中...
              </span>
            ) : '登 录'}
          </button>

          <div className="mt-6 text-center">
            <a href="/" className="text-teal-300 hover:text-white text-sm transition-colors">
              ← 返回首页
            </a>
          </div>
        </form>

        <p className="text-center text-teal-400/50 text-xs mt-6">
          © 2026 TokenHub Admin
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}