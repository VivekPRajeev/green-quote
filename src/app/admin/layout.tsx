import React from 'react';
import AdminNav from '@/components/AdminNav';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}
