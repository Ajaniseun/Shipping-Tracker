import Link from 'next/link';
import ManagerDashboard from '@/app/components/ManagerDashboard';

export default function ManagerPage() {
  return (
    <>
      <div className="fixed left-6 top-6 z-20">
        <Link
          href="/"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          Back to site
        </Link>
      </div>
      <ManagerDashboard />
    </>
  );
}
