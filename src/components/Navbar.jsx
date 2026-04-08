export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TokenHub</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#about" className="text-gray-600 hover:text-teal-600 text-sm font-medium transition-colors">关于</a>
        </div>
      </div>
    </nav>
  );
}