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
    <Card className="glass-card border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-file-signature text-purple-400"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notarize Document</h3>
            <p className="text-slate-400 text-sm font-normal">Create immutable proof of document existence</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Document Upload</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragOver ? 'border-purple-500 bg-purple-500/5' : 'border-slate-600 hover:border-purple-500'
              }`}
            >
              <i className="fas fa-cloud-upload-alt text-3xl text-slate-500 mb-2"></i>
              <p className="text-slate-400">Drop files here or <span className="text-purple-400">browse</span></p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, DOC, TXT, and more</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </div>
            
            {file && (
              <div className="mt-2 p-2 bg-slate-800 rounded border border-slate-600">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-file text-green-400"></i>
                  <span className="text-sm text-white">{file.name}</span>
                  <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
                {fileHash && (
                  <p className="text-xs text-slate-500 mt-1 font-mono">SHA-256: {fileHash}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label className="text-slate-300">Use Case Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="University Credential">University Credential</SelectItem>
                <SelectItem value="Supply Chain Event">Supply Chain Event</SelectItem>
                <SelectItem value="Medical Record">Medical Record</SelectItem>
                <SelectItem value="Legal Document">Legal Document</SelectItem>
                <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            disabled={notarizeMutation.isPending || !file || !category}
          >
            {notarizeMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Notarizing...
              </>
            ) : (
              <>
                <i className="fas fa-stamp mr-2"></i>
                Notarize Document
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
