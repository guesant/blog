import { PageLayout } from '../../components/layouts/page-layout';
import { SiteShell } from '../../components/layouts/site-shell';
import { StatusPage } from '../../components/pages/status-page';

export default function NotFound() {
  return (
    <SiteShell>
      <PageLayout>
        <StatusPage kind="notFound" />
      </PageLayout>
    </SiteShell>
  );
}
