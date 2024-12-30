import AttributeDetail from "../AttributeDetail";
import { AttributesPageProps } from "@/types";


export default function AttributesPage({ userAttributes }:AttributesPageProps){

return(
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Attributes</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="space-y-6">
          <AttributeDetail
            label="Role"
            value={userAttributes.role}
            description="Your assigned role determines base access permissions"
          />
          <AttributeDetail
            label="Department"
            value={userAttributes.department}
            description="Organizational unit you belong to"
          />
          <AttributeDetail
            label="Clearance Level"
            value={userAttributes.clearance_level}
            description="Security clearance level for accessing sensitive resources"
          />
          <AttributeDetail
            label="Trust Score"
            value={userAttributes.trust_score.toString()}
            description="Security clearance level for accessing sensitive resources"
          />
        </div>
      </div>
    </div>
  );

}


















