import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
      <Link href="/login" className="text-blue-600 hover:underline">
        Go to Login Page
      </Link>
    </div>
  );
}
