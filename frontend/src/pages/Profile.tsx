import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { ProfileBanner } from '../components/Profile/ProfileBanner';
import { UserInfoForm } from '../components/Profile/UserInfoForm';
import { MyEvents } from '../components/Profile/MyEvents';
import { getUserProfile, updateUserProfile, uploadUserImage, getUserEvents } from '../services/api';
import { IUser } from '../types/user';
import { Event } from '../types/event';

// TODO: Replace with actual user ID from authentication
const CURRENT_USER_ID = '1';

export const Profile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, eventsResponse] = await Promise.all([
          getUserProfile(CURRENT_USER_ID),
          getUserEvents(CURRENT_USER_ID),
        ]);
        setUser(userResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        message.error('Failed to load profile data');
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveUserInfo = async (values: any) => {
    try {
      const response = await updateUserProfile(CURRENT_USER_ID, values);
      setUser(response.data);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleViewAllEvents = () => {
    // TODO: Implement navigation to all events view
    console.log('Viewing all events');
  };

  const handleCoverChange = async (file: File) => {
    try {
      const response = await uploadUserImage(CURRENT_USER_ID, file, 'cover');
      setUser(response.data);
      message.success('Cover image updated successfully');
    } catch (error) {
      message.error('Failed to update cover image');
      console.error('Error updating cover image:', error);
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      const response = await uploadUserImage(CURRENT_USER_ID, file, 'avatar');
      setUser(response.data);
      message.success('Avatar updated successfully');
    } catch (error) {
      message.error('Failed to update avatar');
      console.error('Error updating avatar:', error);
    }
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <ProfileBanner
          coverImage={user.coverImageUrl}
          avatarUrl={user.avatarUrl}
          onCoverChange={handleCoverChange}
          onAvatarChange={handleAvatarChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserInfoForm
              initialValues={user}
              onSave={handleSaveUserInfo}
            />
          </div>
          
          <div>
            <MyEvents
              events={events}
              onViewAllClick={handleViewAllEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 