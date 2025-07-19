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
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
      change: "+2 this week",
    },
    {
      title: "Notarized Documents",
      value: stats?.notarizedDocuments || 0,
      icon: "fas fa-file-signature",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      change: "+8 this week",
    },
    {
      title: "Verifications",
      value: stats?.verifications || 0,
      icon: "fas fa-check-circle",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      change: "+15 this week",
    },
    {
      title: "Storage Used",
      value: `${stats?.storageUsed || 0}GB`,
      icon: "fas fa-database",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      change: "+0.3GB this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className="glass-card border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                <i className={`${stat.icon} ${stat.iconColor} text-xl`}></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <i className="fas fa-arrow-up mr-1"></i>
              <span>{stat.change}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
