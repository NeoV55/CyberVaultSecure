import Sidebar from "@/components/sidebar";
import WalletConnection from "@/components/wallet-connection";
import DidRegistration from "@/components/did-registration";
import DocumentNotarization from "@/components/document-notarization";
import DocumentVerification from "@/components/document-verification";
import StatsCards from "@/components/stats-cards";
import DataTables from "@/components/data-tables";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-slate-400">Manage your decentralized identity and notarizations</p>
          </div>
          <div className="flex space-x-4">
            <WalletConnection />
            <button className="px-6 py-3 glass-card rounded-lg font-medium hover:bg-slate-700 transition-all duration-200 border border-slate-600">
              <i className="fas fa-download mr-2"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Action Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DidRegistration />
          <DocumentNotarization />
        </div>

        {/* Data Tables */}
        <DataTables />

        {/* Document Verification */}
        <div className="mt-8">
          <DocumentVerification />
        </div>
      </div>
    </div>
  );
}
