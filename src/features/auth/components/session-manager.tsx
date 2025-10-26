'use client';

import { useState, useEffect } from 'react';
import { authAPI } from '@/lib/api-client';

interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
}

export default function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // 这里应该调用获取会话的API，暂时用模拟数据
      // const response = await authAPI.getSessions(token);
      
      // 模拟数据
      const mockSessions: Session[] = [
        {
          id: '1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          ipAddress: '192.168.1.1',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          ipAddress: '192.168.1.2',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setSessions(mockSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logoutAllSessions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await authAPI.logoutAll(token);
      
      if (response.success) {
        // 清除本地存储并重定向到登录页面
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      } else {
        throw new Error(response.error || 'Failed to logout all sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const logoutSession = async (sessionId: string) => {
    // 这里应该调用注销特定会话的API
    // 暂时从本地状态中移除
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Active Sessions</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your active sessions across devices</p>
          </div>
          <button
            onClick={logoutAllSessions}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout All Devices
          </button>
        </div>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <li key={session.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-200 rounded-full p-2">
                    <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.userAgent ? session.userAgent.substring(0, 50) + '...' : 'Unknown device'}
                    </p>
                    <p className="text-sm text-gray-500">
                      IP: {session.ipAddress || 'Unknown'} • Created: {new Date(session.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => logoutSession(session.id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm text-gray-500">
          <p>You have {sessions.length} active sessions.</p>
        </div>
      </div>
    </div>
  );
}