'use client';
import { useState } from "react";
import { CheckCircle, XCircle } from 'lucide-react';
import { NewRequestPageProps } from "@/types";
import { createClient } from "@/utils/supabase/client";

export default function NewRequestPage({ userAttributes }: NewRequestPageProps) {
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [response, setResponse] = useState<'Approved' | 'Denied' | null>(null);
  const supabase = createClient();

  const resources = [
    'Resource 1',
    'Resource 2',
    'Resource 3',
    'Resource 4',
    'Resource 5'
  ];

  const actions = ['Read', 'Write', 'Delete', 'Print', 'Execute'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Determine allowed resources and actions
    const allowedResources = resources.slice(0, parseInt(userAttributes.clearance_level));
    const highestResource = allowedResources[allowedResources.length - 1];
    const allowedActions = (() => {
      if (userAttributes.trust_score < 40) return ['Read'];
      if (userAttributes.trust_score < 60) return ['Read', 'Write'];
      if (userAttributes.trust_score < 80) return ['Read', 'Write', 'Delete'];
      if (userAttributes.trust_score < 100) return ['Read', 'Write', 'Delete', 'Print'];
      return ['Read', 'Write', 'Delete', 'Print', 'Execute'];
    })();
  
    // Restrict actions only for the highest resource
    const isHighestResource = resource === highestResource;
    const effectiveAllowedActions = isHighestResource ? allowedActions : actions;
  
    // Determine if the request is allowed
    const isResourceAllowed = allowedResources.includes(resource);
    const isActionAllowed = effectiveAllowedActions.includes(action);
    const response = isResourceAllowed && isActionAllowed ? 'Approved' : 'Denied';
  
    // Send the request to the API route
    try {
      const res = await fetch('/api/initiate_requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userAttributes.id,
          resource,
          action,
          status: response,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log('Request processed:', data);
      } else {
        console.error('Error processing request:', data.error);
      }
  
      setResponse(response);
    } catch (err) {
      console.error('Error submitting request:', err);
      setResponse('Denied');
    }
  };
   
 
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">New Access Request</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resource
            </label>
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose a resource...</option>
              {resources.map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choose an action...</option>
              {actions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit Request
          </button>
        </form>

        {response && (
          <div className="mt-6">
            <div
              className={`p-4 rounded-md ${
                response === 'Approved' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center">
                {response === 'Approved' ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span
                  className={`font-medium ${
                    response === 'Approved' ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  Request {response}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
