import React, { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import { fetchUserProfile, UserProfile } from '../services/user';

interface ProfileIconProps {
  onClick?: () => void;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ onClick }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile().then(setProfile);
  }, []);

  if (profile && profile.profilePicture) {
    return (
      <Avatar src={profile.profilePicture} sx={{ width: 32, height: 32, cursor: 'pointer' }} onClick={onClick} />
    );
  }
  if (profile && profile.email) {
    return (
      <Avatar sx={{ width: 32, height: 32, cursor: 'pointer', bgcolor: '#a259f7', color: '#fff', fontWeight: 700 }} onClick={onClick}>
        {profile.email[0].toUpperCase()}
      </Avatar>
    );
  }
  return <AccountCircleIcon sx={{ color: '#fff', fontSize: 32, cursor: 'pointer' }} onClick={onClick} />;
};

export default ProfileIcon;
