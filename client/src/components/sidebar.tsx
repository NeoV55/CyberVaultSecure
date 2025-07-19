import { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const walletAddress = localStorage.getItem('cybervault_wallet') || '';

  const navItems = [
    { name: "Dashboard", icon: "fas fa-tachometer-alt", active: true },
    { name: "DID Registry", icon: "fas fa-id-badge", active: false },
    { name: "Notarization", icon: "fas fa-file-signature", active: false },
    { name: "Verification", icon: "fas fa-search", active: false },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-card border-r border-slate-700 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CyberVault</h1>
            <p className="text-xs text-slate-400">Explorer v1.0</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeItem === item.name
                  ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Wallet Connection Status */}
      <div className="absolute bottom-6 left-6 right-6">
        {walletAddress ? (
          <div className="glass-card rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-green-300">Wallet Connected</p>
                <p className="text-xs text-slate-400 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-orange-300">Wallet Disconnected</p>
                <p className="text-xs text-slate-400">Connect wallet to continue</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
