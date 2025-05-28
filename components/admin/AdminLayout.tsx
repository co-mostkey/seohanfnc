import React from 'react';
import AdminSidebar from './AdminSidebar';
import { Toaster } from "@/components/ui/toaster";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = "관리자 페이지" }) => {
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            {title}
          </h1>
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AdminLayout; 