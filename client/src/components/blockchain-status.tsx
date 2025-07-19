import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockchainStatusData {
  cliAvailable: boolean;
  status: 'ready' | 'unavailable' | 'error';
  message: string;
}

export function BlockchainStatus() {
  const { data: statusData, isLoading, error } = useQuery<BlockchainStatusData>({
    queryKey: ['/api/iota/status'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="modern-card rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (error || !statusData) return 'gradient-pink';
    switch (statusData.status) {
      case 'ready': return 'gradient-green';
      case 'unavailable': return 'gradient-orange';
      case 'error': return 'gradient-pink';
      default: return 'gradient-gray';
    }
  };

  const getStatusIcon = () => {
    if (error || !statusData) return 'fas fa-exclamation-triangle';
    switch (statusData.status) {
      case 'ready': return 'fas fa-check-circle';
      case 'unavailable': return 'fas fa-clock';
      case 'error': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (!statusData) return 'Unknown';
    switch (statusData.status) {
      case 'ready': return 'IOTA Ready';
      case 'unavailable': return 'CLI Unavailable';
      case 'error': return 'CLI Error';
      default: return 'Unknown Status';
    }
  };

  return (
    <Card className="modern-card rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-white/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${getStatusColor()} rounded-xl flex items-center justify-center floating-icon`}>
              <i className={`${getStatusIcon()} text-white text-sm`}></i>
            </div>
            <div>
              <p className="font-semibold text-blue-800 text-sm">{getStatusText()}</p>
              <p className="text-xs text-blue-600">
                {error ? 'Failed to check status' : statusData?.message}
              </p>
            </div>
          </div>
          
          <Badge className={`rounded-full text-xs ${
            statusData?.cliAvailable 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {statusData?.cliAvailable ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}