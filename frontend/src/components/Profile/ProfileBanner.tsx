import React from 'react';
import { Button, Upload, Avatar } from 'antd';
import { CameraOutlined, UserOutlined } from '@ant-design/icons';

interface ProfileBannerProps {
  coverImage?: string;
  avatarUrl?: string;
  onCoverChange?: (file: File) => void;
  onAvatarChange?: (file: File) => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  coverImage = 'https://via.placeholder.com/1200x300',
  avatarUrl,
  onCoverChange,
  onAvatarChange,
}) => {
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
          onChange={({ file }) => onCoverChange?.(file as File)}
        >
          <Button
            icon={<CameraOutlined />}
            className="absolute bottom-4 right-4 bg-white/80 hover:bg-white"
          >
            Зураг солих
          </Button>
        </Upload>
      </div>
      
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
        <div className="relative">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            src={avatarUrl}
            className="border-4 border-white shadow-lg"
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            onChange={({ file }) => onAvatarChange?.(file as File)}
          >
            <Button
              icon={<CameraOutlined />}
              className="absolute bottom-0 right-0 rounded-full bg-white/80 hover:bg-white"
              size="small"
            />
          </Upload>
        </div>
      </div>
    </div>
  );
}; 