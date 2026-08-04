import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function BanBanner() {
  const { userProfile } = useAuth();

  if (!userProfile?.isBanned) return null;

  return (
    <div className="bg-red-500 text-white px-4 py-3 flex items-start gap-3 shadow-sm z-50 rounded-lg m-4 sm:mx-6 lg:mx-12 mt-4 animate-in slide-in-from-top-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 shrink-0 mt-0.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h3 className="font-bold text-lg">Access Restricted</h3>
        <p className="text-red-50 mt-1 font-medium">
          Your account has been restricted from participating in the hackathon. 
        </p>
        <div className="mt-2 bg-red-600 bg-opacity-40 p-3 rounded border border-red-400 inline-block">
          <span className="font-semibold text-red-100 mr-2">Reason:</span>
          <span className="text-white font-bold">{userProfile.banReason || 'Violation of platform rules.'}</span>
        </div>
      </div>
    </div>
  );
}
