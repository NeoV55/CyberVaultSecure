import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-slate-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-8 bg-slate-700 rounded mb-4"></div>
                <div className="h-3 bg-slate-700 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Registered DIDs",
      value: stats?.registeredDids || 0,
      icon: "fas fa-id-badge",
      gradient: "gradient-purple",
      bgGradient: "from-purple-50 to-indigo-50",
      textColor: "text-purple-700",
      change: "+2 this week",
      delay: "0s"
    },
    {
      title: "Notarized Documents", 
      value: stats?.notarizedDocuments || 0,
      icon: "fas fa-file-signature",
      gradient: "gradient-green",
      bgGradient: "from-green-50 to-emerald-50",
      textColor: "text-green-700",
      change: "+8 this week",
      delay: "0.1s"
    },
    {
      title: "Verifications",
      value: stats?.verifications || 0,
      icon: "fas fa-check-circle",
      gradient: "gradient-blue",
      bgGradient: "from-blue-50 to-sky-50",
      textColor: "text-blue-700",
      change: "+15 this week",
      delay: "0.2s"
    },
    {
      title: "Storage Used",
      value: `${stats?.storageUsed || 0}GB`,
      icon: "fas fa-database",
      gradient: "gradient-orange",
      bgGradient: "from-orange-50 to-amber-50",
      textColor: "text-orange-700",
      change: "+0.3GB this week",
      delay: "0.3s"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className={`modern-card rounded-3xl bg-gradient-to-br ${stat.bgGradient} border-white/20 animate-slide-up`} style={{animationDelay: stat.delay}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.gradient} rounded-2xl flex items-center justify-center floating-icon`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold ${stat.textColor}">{stat.value}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{stat.title}</p>
              <div className="flex items-center text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
