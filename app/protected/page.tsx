'use client';

import React, { useState, useEffect } from 'react';
import NavItem from '@/components/Dashboard/NavItem';
import { User, Clock, FileText, Shield } from 'lucide-react';
import DashboardPage from '@/components/Dashboard/Pages/DashboardPage';
import AttributesPage from '@/components/Dashboard/Pages/Attribute';
import PreviousRequestsPage from '@/components/Dashboard/Pages/PreviousRequest';
import NewRequestPage from '@/components/Dashboard/Pages/NewRequest';
import { UserAttributes, Request, UserInfo } from '@/types';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPageContainer() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [previousRequests, setPreviousRequests] = useState<Request[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<'dashboard' | 'attributes' | 'previous' | 'new'>('dashboard');
  const [user, setUser] = useState<any>(null);
 
  // Initialize Supabase client
  const supabase = createClient();
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          setError('Failed to authenticate user');
        } else {
          setUser(user);
        }
      } catch (err) {
        setError('Error fetching user');
      }
    };
 
    fetchUser();
  }, []);
 
  useEffect(() => {
    if (!user) return;
 
    const fetchUserInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('id', user.id)
          .single();
 
        if (error) throw new Error('Failed to fetch user info');
        
        // Cast data to UserInfo type
        setUserInfo(data as UserInfo);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };
 
    fetchUserInfo();
  }, [user]);
 
  useEffect(() => {
    const fetchPreviousRequests = async () => {
      if (!userInfo) return;
 
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id);
 
        if (error) throw new Error('Failed to fetch previous requests');
 
        // Convert the response to an array if it is not already one
        const requestsArray = Array.isArray(data) ? data : [data];
 
        // Transform the data to match the Request type
        const transformedRequests: Request[] = requestsArray.map((request: any) => ({
          id: request.id,
          resource: request.resource,
          action: request.action,
          timestamp: request.timestamp,
          status: request.status,
        }));
 
        setPreviousRequests(transformedRequests);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingRequests(false);
      }
    };
 
    fetchPreviousRequests();
  }, [userInfo]);
 
  // Show loading states
  if (loadingUser || loadingRequests) {
    return <div>Loading...</div>;
  }
 
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  if (!userInfo) {
    return <div>No user found</div>;
  }
 
  // Dynamically assign user attributes
  const userAttributes: UserAttributes = {
    role: userInfo.role,
    department: userInfo.department,
    clearance_level: userInfo.clearance_level,
    trust_score: userInfo.trust_score,
    id: userInfo.id
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">ABAC System</h2>
        </div>
        <nav className="mt-6">
          <NavItem
            icon={<Shield className="w-5 h-5" />}
            label="Dashboard"
            active={selectedPage === 'dashboard'}
            onClick={() => setSelectedPage('dashboard')}
          />
          <NavItem
            icon={<User className="w-5 h-5" />}
            label="My Attributes"
            active={selectedPage === 'attributes'}
            onClick={() => setSelectedPage('attributes')}
          />
          <NavItem
            icon={<Clock className="w-5 h-5" />}
            label="Previous Requests"
            active={selectedPage === 'previous'}
            onClick={() => setSelectedPage('previous')}
          />
          <NavItem
            icon={<FileText className="w-5 h-5" />}
            label="New Request"
            active={selectedPage === 'new'}
            onClick={() => setSelectedPage('new')}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {selectedPage === 'dashboard' && (
          <DashboardPage userAttributes={userAttributes} previousRequests={previousRequests} />
        )}
        {selectedPage === 'attributes' && (
          <AttributesPage userAttributes={userAttributes} />
        )}
        {selectedPage === 'previous' && (
          <PreviousRequestsPage requests={previousRequests} />
        )}
        {selectedPage === 'new' && (
          <NewRequestPage userAttributes={userAttributes} />
        )}
      </div>
    </div>
  );
}
