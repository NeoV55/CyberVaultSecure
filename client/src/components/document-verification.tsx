import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function DocumentVerification() {
  const [hash, setHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (hash: string) => {
      const response = await apiRequest('GET', `/api/documents/verify/${hash}`);
      return await response.json();
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      if (data.verified) {
        toast({
          title: "Document Verified",
          description: "Document found and verified on the blockchain",
        });
      } else {
        toast({
          title: "Document Not Found",
          description: "Document not found in blockchain records",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Failed to verify document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVerify = () => {
    if (!hash.trim()) {
      toast({
        title: "Invalid Hash",
        description: "Please enter a valid document hash",
        variant: "destructive",
      });
      return;
    }

    verifyMutation.mutate(hash.trim());
  };

  return (
    <Card className="glass-card border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-search text-green-400"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Document Verification</h3>
            <p className="text-slate-400 text-sm font-normal">Verify document authenticity on the blockchain</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Label className="text-slate-300">Document Hash (SHA-256)</Label>
            <div className="flex space-x-3 mt-2">
              <Input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Enter document hash to verify..."
                className="flex-1 bg-slate-800 border-slate-600 text-white font-mono text-sm placeholder-slate-500 focus:border-green-500"
              />
              <Button
                onClick={handleVerify}
                disabled={verifyMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {verifyMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          {verificationResult && (
            <div>
              <Label className="text-slate-300">Verification Result</Label>
              <div className={`p-4 rounded-lg border mt-2 ${
                verificationResult.verified 
                  ? 'border-green-500/30 bg-green-500/10' 
                  : 'border-red-500/30 bg-red-500/10'
              }`}>
                {verificationResult.verified ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="fas fa-check-circle text-green-400"></i>
                      <span className="font-semibold text-green-300">✅ Verified</span>
                    </div>
                    <p className="text-sm text-white mb-1">Category: {verificationResult.document.category}</p>
                    <p className="text-sm text-slate-400">File: {verificationResult.document.fileName}</p>
                    <p className="text-sm text-slate-400">Timestamp: {verificationResult.document.timestamp}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Notarized: {new Date(verificationResult.document.createdAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-times-circle text-red-400"></i>
                      <span className="font-semibold text-red-300">❌ Not Found</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{verificationResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
