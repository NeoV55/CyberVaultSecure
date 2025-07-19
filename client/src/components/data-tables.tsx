import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function DataTables() {
  const { data: dids = [], isLoading: didsLoading } = useQuery({
    queryKey: ['/api/dids'],
  });

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/documents'],
  });

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'University Credential': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Supply Chain Event': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Medical Record': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Legal Document': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Intellectual Property': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Other': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Registered DIDs Table */}
      <Card className="modern-card rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border-white/20">
        <CardHeader className="border-b border-purple-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-purple rounded-2xl flex items-center justify-center floating-icon">
                <i className="fas fa-id-badge text-white"></i>
              </div>
              <span className="text-purple-800 font-bold text-lg">Registered DIDs</span>
            </CardTitle>
            <button className="px-4 py-2 pill-button gradient-purple text-white text-sm font-medium shadow-md hover:shadow-lg">
              <i className="fas fa-filter mr-2"></i>
              Filter
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {didsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-slate-800/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : dids.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-id-badge text-white text-2xl"></i>
              </div>
              <p className="text-purple-700 font-medium">No DIDs registered yet</p>
              <p className="text-purple-500 text-sm">Register your first DID to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dids.slice(0, 5).map((did: any) => (
                <div key={did.id} className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-purple-100 hover:bg-white/80 transition-all">
                  <div>
                    <p className="font-mono text-sm text-purple-800 font-medium">{did.did}</p>
                    <p className="text-xs text-purple-600">
                      Wallet: {did.walletAddress.slice(0, 6)}...{did.walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`rounded-full ${did.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                      {did.status}
                    </Badge>
                    <p className="text-xs text-purple-500 mt-1">{formatTimeAgo(did.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notarizations Table */}
      <Card className="modern-card rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-white/20">
        <CardHeader className="border-b border-green-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-green rounded-2xl flex items-center justify-center floating-icon">
                <i className="fas fa-file-signature text-white"></i>
              </div>
              <span className="text-green-800 font-bold text-lg">Recent Notarizations</span>
            </CardTitle>
            <button className="px-4 py-2 pill-button gradient-green text-white text-sm font-medium shadow-md hover:shadow-lg">
              <i className="fas fa-search mr-2"></i>
              Search
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {documentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-slate-800/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-file-signature text-4xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">No documents notarized yet</p>
              <p className="text-slate-500 text-sm">Upload and notarize your first document</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc: any) => (
                <div key={doc.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-slate-500">{formatTimeAgo(doc.createdAt)}</span>
                  </div>
                  <p className="font-mono text-xs text-white mb-1">
                    SHA-256: {doc.hash.slice(0, 16)}...
                  </p>
                  <p className="text-xs text-slate-400">File: {doc.fileName}</p>
                  <p className="text-xs text-slate-400">Timestamp: {doc.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
