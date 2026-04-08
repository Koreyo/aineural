import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [route, setRoute] = useState('/');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    const adminTime = localStorage.getItem('admin_time');
    
    // 登录有效期24小时
    if (token === 'logged_in' && adminTime) {
      const elapsed = Date.now() - parseInt(adminTime);
      if (elapsed < 24 * 60 * 60 * 1000) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_time');
      }
    }

    // 简单的路由处理
    const handleHashChange = () => {
      const h = window.location.hash;
      if (h === '#/admin') {
        setRoute('/admin');
      } else if (h === '#/settings') {
        setRoute('/settings');
      } else {
        setRoute('/');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAdmin(true);
      window.location.hash = '#/settings';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_time');
    setIsAdmin(false);
    window.location.hash = '';
  };

  // 路由渲染
  if (route === '/admin') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (route === '/settings') {
    if (!isAdmin) {
      window.location.hash = '#/admin';
      return null;
    }
    return <Settings onLogout={handleLogout} />;
  }

  return (
    <>
      <Navbar />
      <Home isAdmin={isAdmin} />
    </>
  );
}

export default App;