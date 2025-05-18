import React, { useState } from 'react';
import { Button, Upload, Avatar, message, Spin } from 'antd';
import { CameraOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';

interface ProfileBannerProps {
  coverImage?: string;
  avatarUrl?: string;
  onCoverChange?: (file: File) => Promise<void>;
  onAvatarChange?: (file: File) => Promise<void>;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  coverImage = 'https://via.placeholder.com/1200x300',
  avatarUrl,
  onCoverChange,
  onAvatarChange,
}) => {
  const [coverLoading, setCoverLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const handleCoverChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setCoverLoading(true);
      return;
    }
    
    if (info.file.status === 'done' || info.file.status === 'error') {
      setCoverLoading(false);
    }
    
    try {
      if (info.file.originFileObj && onCoverChange) {
        await onCoverChange(info.file.originFileObj);
        message.success('Cover image updated successfully');
      }
    } catch (error) {
      console.error('Error uploading cover image:', error);
      message.error('Failed to update cover image');
    } finally {
      setCoverLoading(false);
    }
  };
  
  const handleAvatarChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    
    if (info.file.status === 'done' || info.file.status === 'error') {
      setAvatarLoading(false);
    }
    
    try {
      if (info.file.originFileObj && onAvatarChange) {
        await onAvatarChange(info.file.originFileObj);
        message.success('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error('Failed to update profile picture');
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="relative mb-16">
      <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              onSuccess?.('ok');
            }, 0);
          }}
          onChange={handleCoverChange}
        >
          <Button
            icon={coverLoading ? <LoadingOutlined /> : <CameraOutlined />}
            className="absolute bottom-4 right-4 bg-white/80 hover:bg-white"
            disabled={coverLoading}
          >
            {coverLoading ? 'Uploading...' : 'Change Cover'}
          </Button>
        </Upload>
      </div>
      
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <div className="relative">
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full z-10">
              <Spin />
            </div>
          )}
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={avatarUrl}
            className="border-4 border-white shadow-lg"
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess?.('ok');
              }, 0);
            }}
            onChange={handleAvatarChange}
          >
            <Button
              icon={<CameraOutlined />}
              className="absolute bottom-0 right-0 rounded-full bg-white/80 hover:bg-white"
              size="small"
              disabled={avatarLoading}
            />
          </Upload>
        </div>
      </div>
    </div>
  );
}; 