import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function DidRegistration() {
  const [did, setDid] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const walletAddress = localStorage.getItem('cybervault_wallet') || '';

  const registerDidMutation = useMutation({
    mutationFn: async (data: { did: string; walletAddress: string; status: string }) => {
      return apiRequest('POST', '/api/dids', data);
    },
    onSuccess: () => {
      toast({
        title: "DID Registered Successfully",
        description: "Your DID has been registered and bound to your wallet",
      });
      setDid("");
      queryClient.invalidateQueries({ queryKey: ['/api/dids'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register DID",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!did.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid DID",
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    registerDidMutation.mutate({
      did: did.trim(),
      walletAddress,
      status: 'active'
    });
  };

  return (
    <Card className="modern-card rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-4">
          <div className="w-14 h-14 gradient-purple rounded-2xl flex items-center justify-center floating-icon">
            <i className="fas fa-id-badge text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-800">Register New DID</h3>
            <p className="text-purple-600 text-sm font-medium">Create and bind a decentralized identifier</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-purple-700 font-medium text-sm">Decentralized Identifier (DID)</Label>
            <Input
              type="text"
              value={did}
              onChange={(e) => setDid(e.target.value)}
              placeholder="did:cyber:example123"
              className="mt-2 rounded-2xl border-purple-200 bg-white/80 text-purple-800 placeholder-purple-400 focus:border-purple-500 focus:ring-purple-500/20"
              required
            />
            <p className="text-xs text-purple-500 mt-2 ml-2">Format: did:method:identifier</p>
          </div>

          <div>
            <Label className="text-purple-700 font-medium text-sm">Wallet Address</Label>
            <Input
              type="text"
              value={walletAddress}
              className="mt-2 rounded-2xl border-purple-200 bg-white/80 text-purple-800 font-mono text-sm"
              readOnly
            />
            <p className="text-xs text-purple-500 mt-2 ml-2">Auto-fetched from connected wallet</p>
          </div>

          <button 
            type="submit" 
            className="w-full px-6 py-4 pill-button gradient-purple text-white font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={registerDidMutation.isPending}
          >
            {registerDidMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Registering...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-plus text-white text-sm"></i>
                </div>
                <span>Register & Bind DID</span>
              </div>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
