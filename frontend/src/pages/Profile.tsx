import React, { useEffect, useState, useCallback } from 'react';
import { message, Spin, Card } from 'antd';
import { MainLayout } from '../components/MainLayout';
import { ProfileBanner } from '../components/Profile/ProfileBanner';
import { UserInfoForm } from '../components/Profile/UserInfoForm';
import { MyEvents } from '../components/Profile/MyEvents';
import { getUserProfile, updateUserProfile, uploadUserImage, getUserEvents, getImageUrl } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { IUser } from '../types/user';
import { Event } from '../types/event';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const Profile: React.FC = () => {
  const { user: authUser, refresh: refreshUser } = useUser();
  const [user, setUser] = useState<IUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!authUser) return;
    
    try {
      setLoading(true);
      const [userResponse, eventsResponse] = await Promise.all([
        getUserProfile(authUser._id),
        getUserEvents(authUser._id),
      ]);
      console.log('User profile data:', userResponse.data);
      setUser(userResponse.data);
      setEvents(eventsResponse.data);
    } catch (error) {
      message.error('Failed to load profile data');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleSaveUserInfo = async (values: any) => {
    if (!authUser) return;
    
    try {
      const response = await updateUserProfile(authUser._id, values);
      setUser(response.data);
      message.success('Profile updated successfully');
      
      // Refresh the user context to update the global user state
      await refreshUser();
    } catch (error) {
      message.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleViewAllEvents = () => {
    // Navigate to my events page - this is handled by the component itself
  };

  const handleCoverChange = async (file: File) => {
    if (!authUser) return;
    
    try {
      setUploadingCover(true);
      console.log("Uploading cover image:", file.name, file.size);
      const response = await uploadUserImage(authUser._id, file, 'cover');
      console.log("Cover image upload response:", response.data);
      setUser(response.data);
      
      // Refresh the user context
      await refreshUser();
    } catch (error) {
      message.error('Failed to update cover image');
      console.error('Error updating cover image:', error);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!authUser) return;
    
    try {
      setUploadingAvatar(true);
      console.log("Uploading avatar image:", file.name, file.size);
      const response = await uploadUserImage(authUser._id, file, 'avatar');
      console.log("Avatar image upload response:", response.data);
      setUser(response.data);
      
      // Refresh the user context
      await refreshUser();
    } catch (error) {
      message.error('Failed to update avatar');
      console.error('Error updating avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Log image URLs for debugging
  useEffect(() => {
    if (user) {
      console.log("User image URLs:", {
        avatarUrl: user.avatarUrl,
        coverImageUrl: user.coverImageUrl,
        avatarFullUrl: user.avatarUrl ? getImageUrl(user.avatarUrl) : undefined,
        coverFullUrl: user.coverImageUrl ? getImageUrl(user.coverImageUrl) : undefined
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" tip="Loading profile..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-6 shadow-sm overflow-hidden">
            <ProfileBanner
              coverImage={user.coverImageUrl ? getImageUrl(user.coverImageUrl) : undefined}
              avatarUrl={user.avatarUrl ? getImageUrl(user.avatarUrl) : undefined}
              onCoverChange={handleCoverChange}
              onAvatarChange={handleAvatarChange}
            />
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                <UserInfoForm
                  initialValues={user}
                  onSave={handleSaveUserInfo}
                />
              </Card>
            </div>
            
            <div>
              <Card className="shadow-sm">
                <h2 className="text-xl font-semibold mb-4">My Events</h2>
                <MyEvents
                  events={events}
                  onViewAllClick={handleViewAllEvents}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}; 