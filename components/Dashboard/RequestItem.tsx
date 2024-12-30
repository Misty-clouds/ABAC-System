import { StatusBadge } from './StatusBadge';

interface Request {
  id: string;
  resource: string;
  action: string;
  timestamp: string;
  status: 'Approved' | 'Denied';
}

interface RequestItemProps {
  request: Request;
}

const RequestItem: React.FC<RequestItemProps> = ({ request }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-900">{request.resource}</p>
      <p className="text-sm text-gray-500">{request.timestamp}</p>
    </div>
    <StatusBadge status={request.status} />
  </div>
);

export default RequestItem;
