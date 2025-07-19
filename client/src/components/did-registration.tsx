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
    <Card className="glass-card border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-id-badge text-indigo-400"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Register New DID</h3>
            <p className="text-slate-400 text-sm font-normal">Create and bind a decentralized identifier</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Decentralized Identifier (DID)</Label>
            <Input
              type="text"
              value={did}
              onChange={(e) => setDid(e.target.value)}
              placeholder="did:cyber:example123"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-indigo-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">Format: did:method:identifier</p>
          </div>

          <div>
            <Label className="text-slate-300">Wallet Address</Label>
            <Input
              type="text"
              value={walletAddress}
              className="bg-slate-800 border-slate-600 text-white font-mono text-sm"
              readOnly
            />
            <p className="text-xs text-slate-500 mt-1">Auto-fetched from connected wallet</p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            disabled={registerDidMutation.isPending}
          >
            {registerDidMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Registering...
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i>
                Register & Bind DID
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
