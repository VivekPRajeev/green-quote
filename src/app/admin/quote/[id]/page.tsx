import QuotesPage from '@/components/QuotesPage';

export default function QuotePage({ params }: { params: any }) {
  return <QuotesPage id={params.id} />;
}
