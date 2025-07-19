import { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const walletAddress = localStorage.getItem('cybervault_wallet') || '';

  const navItems = [
    { name: "Dashboard", icon: "fas fa-tachometer-alt", gradient: "gradient-blue" },
    { name: "DID Registry", icon: "fas fa-id-badge", gradient: "gradient-purple" },
    { name: "Notarization", icon: "fas fa-file-signature", gradient: "gradient-green" },
    { name: "Verification", icon: "fas fa-search", gradient: "gradient-orange" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-72 modern-card border-r border-white/20 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-12 h-12 gradient-purple rounded-2xl flex items-center justify-center floating-icon">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">CyberVault</h1>
            <p className="text-sm text-gray-500">Explorer v1.0</p>
          </div>
        </div>

        <nav className="space-y-4">
          {navItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 pill-button ${
                activeItem === item.name
                  ? `${item.gradient} text-white shadow-lg`
                  : 'hover:bg-white/10 text-gray-600 hover:text-gray-800'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeItem === item.name ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <i className={`${item.icon} ${activeItem === item.name ? 'text-white' : 'text-gray-600'}`}></i>
              </div>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Wallet Connection Status */}
      <div className="absolute bottom-6 left-6 right-6">
        {walletAddress ? (
          <div className="modern-card rounded-2xl p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce-gentle floating-icon"></div>
              <div>
                <p className="text-sm font-semibold text-green-700">Wallet Connected</p>
                <p className="text-xs text-green-600 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="modern-card rounded-2xl p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-400 rounded-full floating-icon"></div>
              <div>
                <p className="text-sm font-semibold text-orange-700">Wallet Disconnected</p>
                <p className="text-xs text-orange-600">Connect wallet to continue</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
