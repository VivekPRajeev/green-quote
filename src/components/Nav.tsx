'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logout } from './Logout';

export default function Nav({
  links = [],
}: {
  links?: { name: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <ul className="flex space-x-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-gray-300 ${
                  pathname === link.href ? 'font-bold underline' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <Logout />
      </div>
    </nav>
  );
}
