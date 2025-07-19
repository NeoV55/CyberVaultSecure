import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateSHA256 } from "@/lib/crypto";

export default function DocumentNotarization() {
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState("");
  const [category, setCategory] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const notarizeMutation = useMutation({
    mutationFn: async (data: { hash: string; fileName: string; category: string; timestamp: number }) => {
      return apiRequest('POST', '/api/documents', data);
    },
    onSuccess: () => {
      toast({
        title: "Document Notarized",
        description: "Your document has been successfully notarized on the blockchain",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Notarization Failed",
        description: error.message || "Failed to notarize document",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFile(null);
    setFileHash("");
    setCategory("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    
    try {
      const hash = await generateSHA256(selectedFile);
      setFileHash(hash);
    } catch (error) {
      toast({
        title: "Hash Generation Failed",
        description: "Failed to generate file hash",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !fileHash || !category) {
      toast({
        title: "Incomplete Form",
        description: "Please upload a file and select a category",
        variant: "destructive",
      });
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    
    notarizeMutation.mutate({
      hash: fileHash,
      fileName: file.name,
      category,
      timestamp
    });
  };

  return (
    <Card className="modern-card rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-4">
          <div className="w-14 h-14 gradient-green rounded-2xl flex items-center justify-center floating-icon">
            <i className="fas fa-file-signature text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-800">Notarize Document</h3>
            <p className="text-green-600 text-sm font-medium">Create immutable proof of document existence</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-green-700 font-medium text-sm">Document Upload</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 mt-2 ${
                isDragOver ? 'border-green-400 bg-green-100' : 'border-green-200 hover:border-green-400 bg-white/50'
              }`}
            >
              <div className="w-16 h-16 gradient-green rounded-2xl flex items-center justify-center mx-auto mb-4 floating-icon">
                <i className="fas fa-cloud-upload-alt text-2xl text-white"></i>
              </div>
              <p className="text-green-700 font-medium">Drop files here or <span className="text-green-600 underline">browse</span></p>
              <p className="text-sm text-green-600 mt-2">Supports PDF, DOC, TXT, images and more</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </div>
            
            {file && (
              <div className="mt-4 p-4 bg-white/80 rounded-2xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-green rounded-xl flex items-center justify-center">
                    <i className="fas fa-file text-white text-sm"></i>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-800">{file.name}</span>
                    <span className="text-xs text-green-600 ml-2">({(file.size / 1024).toFixed(2)} KB)</span>
                  </div>
                </div>
                {fileHash && (
                  <p className="text-xs text-green-600 mt-2 font-mono bg-green-50 p-2 rounded-lg">SHA-256: {fileHash}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label className="text-green-700 font-medium text-sm">Use Case Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2 rounded-2xl border-green-200 bg-white/80 text-green-800">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 border-green-200 rounded-xl">
                <SelectItem value="University Credential">University Credential</SelectItem>
                <SelectItem value="Supply Chain Event">Supply Chain Event</SelectItem>
                <SelectItem value="Medical Record">Medical Record</SelectItem>
                <SelectItem value="Legal Document">Legal Document</SelectItem>
                <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button 
            type="submit" 
            className="w-full px-6 py-4 pill-button gradient-green text-white font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={notarizeMutation.isPending || !file || !category}
          >
            {notarizeMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Notarizing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="fas fa-stamp text-white text-sm"></i>
                </div>
                <span>Notarize Document</span>
              </div>
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
