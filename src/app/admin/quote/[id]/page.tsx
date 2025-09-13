import QuotesPage from '@/components/QuotesPage';

export default async function QuotePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <QuotesPage id={id} />;
}
