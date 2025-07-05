import { useAuth } from '../context/AuthContext';

export const useUserRole = () => {
  const { userData } = useAuth();

  const isArtist = userData?.role === 'artist';
  const isEventPlanner = userData?.role === 'event_planner';
  const isEndUser = userData?.role === 'end_user';
  const isAdmin = userData?.role === 'admin'; // If you add admin role

  const canCreateEvents = isEventPlanner || isAdmin;
  const canBookArtists = isEventPlanner || isAdmin;
  const canManageProfile = isArtist || isEventPlanner || isEndUser;
  const canViewAllEvents = true; // All users can view events
  const canGenerateContent = isEndUser; // Only end users can generate content via QR

  return {
    role: userData?.role,
    isArtist,
    isEventPlanner,
    isEndUser,
    isAdmin,
    canCreateEvents,
    canBookArtists,
    canManageProfile,
    canViewAllEvents,
    canGenerateContent,
    profileComplete: userData?.profileComplete || false,
    profileProgress: userData?.profileProgress || 0,
  };
};
 