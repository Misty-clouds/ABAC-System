import { PreviousRequestsPageProps } from "@/types";
import StatusBadge from "../StatusBadge";


export default function PreviousRequestsPage  ({ requests }: PreviousRequestsPageProps) {


    return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Previous Requests</h1>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.resource}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.timestamp}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      
    


}

