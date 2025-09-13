import QuotesPage from '@/components/QuotesPage';

export default async function QuotePage({
  params,
}: {
  params: { id: string };
}) {
  // ⚡ Unwrap params first
  const { id } = await params;

  return <QuotesPage id={id} />;
}
