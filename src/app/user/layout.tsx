import React from 'react';
import Nav from '@/components/Nav';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [{ name: 'Home', href: '/user' }];

  return (
    <div className="min-h-screen flex flex-col">
      <Nav links={links} />
      <main className="flex-1 bg-gray-100 p-4">{children}</main>
    </div>
  );
}
