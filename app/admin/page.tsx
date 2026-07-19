import AdminLogin from '@/components/admin-login';
import AdminPanel from '@/components/admin-panel';
import { isAdmin } from '@/lib/admin-auth';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin | Softonic IT Solutions', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;
  return <AdminPanel initialData={await getContent()} />;
}