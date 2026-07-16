'use client';

type Props = {
  status: string;
  className?: string;
};

export default function StatusBadge({ status, className = '' }: Props) {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';
  const palette = (() => {
    switch (status) {
      case 'Picked Up':
        return 'bg-amber-100 text-amber-800';
      case 'In Transit':
        return 'bg-sky-100 text-sky-800';
      case 'Customs Review':
        return 'bg-purple-100 text-purple-800';
      case 'Out for Delivery':
        return 'bg-emerald-100 text-emerald-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  })();

  return <span className={`${base} ${palette} ${className}`}>{status}</span>;
}
