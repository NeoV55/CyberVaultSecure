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
      <Card className="glass-card border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-id-badge text-indigo-400"></i>
              </div>
              <span className="text-white">Registered DIDs</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 hover:bg-slate-700">
              <i className="fas fa-filter mr-2"></i>
              Filter
            </Button>
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
              <i className="fas fa-id-badge text-4xl text-slate-600 mb-4"></i>
              <p className="text-slate-400">No DIDs registered yet</p>
              <p className="text-slate-500 text-sm">Register your first DID to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dids.slice(0, 5).map((did: any) => (
                <div key={did.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="font-mono text-sm text-white">{did.did}</p>
                    <p className="text-xs text-slate-400">
                      Wallet: {did.walletAddress.slice(0, 6)}...{did.walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={did.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}>
                      {did.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(did.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Notarizations Table */}
      <Card className="glass-card border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-signature text-purple-400"></i>
              </div>
              <span className="text-white">Recent Notarizations</span>
            </CardTitle>
            <Button variant="outline" size="sm" className="bg-slate-800 border-slate-600 hover:bg-slate-700">
              <i className="fas fa-search mr-2"></i>
              Search
            </Button>
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
