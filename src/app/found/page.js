import ItemsList from '@/components/ItemsList';
import ItemForm from '@/components/ItemForm';
import AuthRequiredPage from '@/components/AuthRequiredPage';
import LostFoundToggle from '@/components/LostFoundToggle';
import { FileText, Plus } from 'lucide-react'
import { getServerSession } from '@/lib/session';
import { headers } from 'next/headers';

export const metadata = { title: 'Found Items' };

export default async function FoundPage() {
  let userId = null;
  
  try {
    const session = await getServerSession(await headers());
    userId = session?.user?.id || null;
  } catch (err) {
    console.error('Failed to get session:', err);
  }

  // Show auth required page if not logged in
  if (!userId) {
    return <AuthRequiredPage page="Found Items" />;
  }

  return (
    <main style={{ background: '#f5f4f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <header style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: '#0a6f47', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>Lost & Found</div>
          <h1 style={{ fontSize: '36px', fontWeight: '500', color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: '12px' }}>Found Items</h1>
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Items waiting for their owners</p>
          <a
            href="#report-form"
            style={{
              background: '#0a6f47',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              padding: '11px 22px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
          >
            <Plus size={14} color="white" />
            Add Found Item
          </a>
        </header>

        <div id="report-form">
          <LostFoundToggle type="found" userId={userId} formTitle="Report Found Item" formIcon={<FileText size={18} />} />
        </div>
      </div>
    </main>
  );
}
