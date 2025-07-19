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
    <Card className="modern-card rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-4">
          <div className="w-14 h-14 gradient-blue rounded-2xl flex items-center justify-center floating-icon">
            <i className="fas fa-search text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-800">Document Verification</h3>
            <p className="text-blue-600 text-sm font-medium">Verify document authenticity on the blockchain</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Label className="text-blue-700 font-medium text-sm">Document Hash (SHA-256)</Label>
            <div className="flex space-x-3 mt-2">
              <Input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Enter document hash to verify..."
                className="flex-1 rounded-2xl border-blue-200 bg-white/80 text-blue-800 font-mono text-sm placeholder-blue-400 focus:border-blue-500"
              />
              <button
                onClick={handleVerify}
                disabled={verifyMutation.isPending}
                className="px-6 py-3 pill-button gradient-blue text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {verifyMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                    <span>Verify</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {verificationResult && (
            <div>
              <Label className="text-blue-700 font-medium text-sm">Verification Result</Label>
              <div className={`p-4 rounded-2xl border mt-2 ${
                verificationResult.verified 
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50'
              }`}>
                {verificationResult.verified ? (
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 gradient-green rounded-xl flex items-center justify-center">
                        <i className="fas fa-check-circle text-white"></i>
                      </div>
                      <span className="font-bold text-green-700 text-lg">✅ Verified</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-green-800">Category: {verificationResult.document.category}</p>
                      <p className="text-sm text-green-700">File: {verificationResult.document.fileName}</p>
                      <p className="text-sm text-green-700">Timestamp: {verificationResult.document.timestamp}</p>
                      <p className="text-xs text-green-600 bg-green-100 p-2 rounded-lg mt-3">
                        Notarized: {new Date(verificationResult.document.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 gradient-pink rounded-xl flex items-center justify-center">
                        <i className="fas fa-times-circle text-white"></i>
                      </div>
                      <span className="font-bold text-red-700 text-lg">❌ Not Found</span>
                    </div>
                    <p className="text-sm text-red-600 bg-red-100 p-2 rounded-lg">{verificationResult.message}</p>
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
