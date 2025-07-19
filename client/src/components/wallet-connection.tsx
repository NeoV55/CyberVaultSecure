import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected from localStorage
    const savedWallet = localStorage.getItem('cybervault_wallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      toast({
        title: "Connecting to wallet...",
        description: "Please confirm connection in your wallet",
      });

      // Simulate async wallet connection
      setTimeout(() => {
        const mockAddress = "0x742d35Cc6634C0532925a3b8D6aE8E7a9";
        setWalletAddress(mockAddress);
        setIsConnected(true);
        localStorage.setItem('cybervault_wallet', mockAddress);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    localStorage.removeItem('cybervault_wallet');
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    });
  };

  if (isConnected) {
    return (
      <button
        onClick={disconnectWallet}
        className="px-6 py-3 pill-button modern-card hover:bg-white/20 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce-gentle floating-icon"></div>
          <span className="font-mono text-sm text-green-700 font-medium">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="px-6 py-3 pill-button gradient-purple text-white font-medium shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center floating-icon">
          <i className="fas fa-wallet text-white text-sm"></i>
        </div>
        <span>Connect Wallet</span>
      </div>
    </button>
  );
}
