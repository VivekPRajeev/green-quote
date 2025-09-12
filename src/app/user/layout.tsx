import React from 'react';
import Nav from '@/components/Nav';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}
