'use client';

type Props = {
  title: string;
  value: React.ReactNode;
  className?: string;
};

export default function DashboardCard({ title, value, className = '' }: Props) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-sm ${className}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
