import QuotesPage from '@/components/QuotesPage';

export default async function QuotePage({ params }: { params: any }) {
  const { id } = params;

  return <QuotesPage id={id} />;
}
