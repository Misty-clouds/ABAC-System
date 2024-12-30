import { CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Approved' | 'Denied';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}
  >
    {status === 'Approved' ? (
      <CheckCircle className="w-4 h-4 mr-1" />
    ) : (
      <XCircle className="w-4 h-4 mr-1" />
    )}
    {status}
  </span>
);

export default StatusBadge;