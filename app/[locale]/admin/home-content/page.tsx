import VisualEditorPage from './components/new-ui/VisualEditorPage';
import { HomeContentProvider } from '@/app/[locale]/contexts/HomeContentContext';

interface HomeContentPageProps {
  params: {
    locale: string;
  };
}

export default function HomeContentPage({ params: { locale } }: HomeContentPageProps) {
  return (
    <HomeContentProvider locale={locale}>
      <VisualEditorPage />
    </HomeContentProvider>
  );
}