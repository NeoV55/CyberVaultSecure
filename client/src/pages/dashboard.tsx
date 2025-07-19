import Sidebar from "@/components/sidebar";
import WalletConnection from "@/components/wallet-connection";
import DidRegistration from "@/components/did-registration";
import DocumentNotarization from "@/components/document-notarization";
import DocumentVerification from "@/components/document-verification";
import StatsCards from "@/components/stats-cards";
import DataTables from "@/components/data-tables";
import { BlockchainStatus } from "@/components/blockchain-status";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      
      {/* Floating decorative elements */}
      <div className="fixed top-20 right-20 w-16 h-16 gradient-purple rounded-full animate-float opacity-60 z-0"></div>
      <div className="fixed top-40 right-96 w-8 h-8 gradient-green rounded-full animate-bounce-gentle opacity-40 z-0"></div>
      <div className="fixed bottom-32 right-40 w-12 h-12 gradient-orange rounded-full animate-float opacity-50 z-0" style={{animationDelay: '1s'}}></div>
      
      <div className="ml-80 p-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="animate-slide-up">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 gradient-blue rounded-2xl flex items-center justify-center floating-icon">
                <i className="fas fa-rocket text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CyberVault
                </h2>
                <p className="text-gray-600 text-lg">Decentralized identity with cloud infrastructure ease</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <BlockchainStatus />
            <WalletConnection />
            <button className="px-6 py-3 pill-button gradient-orange text-white font-medium shadow-lg hover:shadow-xl">
              <i className="fas fa-download mr-2"></i>
              Export Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Action Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <DidRegistration />
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <DocumentNotarization />
          </div>
        </div>

        {/* Data Tables */}
        <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
          <DataTables />
        </div>

        {/* Document Verification */}
        <div className="mt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <DocumentVerification />
        </div>
      </div>
    </div>
  );
}
