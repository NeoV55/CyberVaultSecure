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
      <Button
        onClick={disconnectWallet}
        variant="outline"
        className="bg-slate-800 border-slate-600 hover:bg-slate-700"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono text-sm">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      </Button>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
    >
      <i className="fas fa-wallet mr-2"></i>
      Connect Wallet
    </Button>
  );
}
