import AttributeItem from "../AttributeItem";
import RequestItem from "../RequestItem";
import { DashboardPageProps } from "@/types";


export default function DashboardPage({ userAttributes, previousRequests }: DashboardPageProps) {

    return (


        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Attributes */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">My Attributes</h2>
                    <div className="space-y-3">
                        <AttributeItem label="Role" value={userAttributes.role} />
                        <AttributeItem label="Department" value={userAttributes.department} />
                        <AttributeItem label="Clearance" value={userAttributes.clearance_level} />
                        <AttributeItem label="Trust Score" value={userAttributes.trust_score.toString()} />
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Requests</h2>
                    <div className="space-y-4">
                        {previousRequests.slice(0, 3).map((request) => (
                            <RequestItem key={request.id} request={request} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}
