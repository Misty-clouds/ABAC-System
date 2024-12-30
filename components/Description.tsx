import React from 'react';
import { Shield, Lock, UserCheck, Activity, Database, Settings } from 'lucide-react';

// Main LandingPage component
const Description: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Key Features */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-500" />}
              title="Fine-Grained Access Control"
              description="Dynamic access decisions based on user attributes, resource sensitivity, and environmental context"
            />
            <FeatureCard
              icon={<UserCheck className="w-8 h-8 text-blue-500" />}
              title="Trust Evaluation"
              description="Advanced trust assessment based on historical behavior and real-time context"
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-blue-500" />}
              title="Real-time Monitoring"
              description="Comprehensive logging and auditing of access requests and decisions"
            />
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComponentCard
              icon={<Lock className="w-6 h-6 text-blue-500" />}
              title="Authentication"
              description="Secure identity verification and access management"
            />
            <ComponentCard
              icon={<Settings className="w-6 h-6 text-blue-500" />}
              title="Policy Management"
              description="Flexible policy definition and enforcement"
            />
            <ComponentCard
              icon={<Database className="w-6 h-6 text-blue-500" />}
              title="Trust Management"
              description="Dynamic trust evaluation and behavioral analysis"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Use Cases</h2>
          <div className="space-y-8">
            <UseCaseCard
              title="Administrative Access"
              description="Secure access management for administrators with proper trust levels"
              scenario="Scenario A: Admin with high trust value accessing sensitive resources"
            />
            <UseCaseCard
              title="Trust-Based Restrictions"
              description="Access control based on trust evaluation regardless of role"
              scenario="Scenario B: Admin with low trust value denied access to sensitive resources"
            />
            <UseCaseCard
              title="Policy Enforcement"
              description="Strict policy adherence regardless of trust level"
              scenario="Scenario C: High-trust user denied access due to policy restrictions"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// FeatureCard component props type definition
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

// ComponentCard component props type definition
interface ComponentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="ml-3 text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

// UseCaseCard component props type definition
interface UseCaseCardProps {
  title: string;
  description: string;
  scenario: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ title, description, scenario }) => (
  <div className="p-6 bg-gray-50 rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <p className="text-sm text-gray-500 italic">{scenario}</p>
  </div>
);

export default Description;
