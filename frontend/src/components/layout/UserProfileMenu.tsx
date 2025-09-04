import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, spacing, shadows, borderRadius, typography, transitions, Button } from '../../styles/GlobalStyles';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
}

const ProfileDropdown = styled.div<{ $isOpen: boolean; $top?: number; $right?: number }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: ${props => props.$top || 60}px;
  right: ${props => props.$right || 20}px;
  background: ${colors.white};
  border: 1px solid ${colors.borderLight};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  min-width: 280px;
  box-shadow: ${shadows.xl};
  z-index: 1000;
  animation: slideInRight 0.2s ease-out;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding-bottom: ${spacing.lg};
  border-bottom: 1px solid ${colors.borderLight};
  margin-bottom: ${spacing.lg};
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.full};
  background: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.lg};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xs};
`;

const UserEmail = styled.div`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textSecondary};
`;

const MenuSection = styled.div`
  margin-bottom: ${spacing.lg};
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  border: none;
  background: transparent;
  text-align: left;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  
  &:hover {
    background: ${colors.hover};
  }
`;

const MenuIcon = styled.span`
  font-size: ${typography.fontSize.base};
  width: 20px;
`;

const MenuText = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textPrimary};
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ 
  isOpen, 
  onClose, 
  anchorEl 
}) => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(user);

  useEffect(() => {
    if (isOpen && user) {
      loadUserProfile();
    }
  }, [isOpen, user]);

  const loadUserProfile = async () => {
    try {
      const profile = await ApiService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (!userProfile) return null;

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <ProfileDropdown $isOpen={isOpen}>
        <ProfileHeader>
          <Avatar>
            {userProfile.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              getInitials(userProfile.email)
            )}
          </Avatar>
          <UserInfo>
            <UserName>
              {userProfile.name || userProfile.email.split('@')[0]}
            </UserName>
            <UserEmail>{userProfile.email}</UserEmail>
          </UserInfo>
        </ProfileHeader>

        <MenuSection>
          <MenuItem onClick={() => {}}>
            <MenuIcon>👤</MenuIcon>
            <MenuText>Mon profil</MenuText>
          </MenuItem>
          
          <MenuItem onClick={() => {}}>
            <MenuIcon>⚙️</MenuIcon>
            <MenuText>Paramètres</MenuText>
          </MenuItem>
          
          <MenuItem onClick={() => {}}>
            <MenuIcon>💳</MenuIcon>
            <MenuText>Abonnement</MenuText>
          </MenuItem>
          
          <MenuItem onClick={() => {}}>
            <MenuIcon>❓</MenuIcon>
            <MenuText>Aide</MenuText>
          </MenuItem>
        </MenuSection>

        <MenuSection>
          <MenuItem onClick={handleLogout}>
            <MenuIcon>🚪</MenuIcon>
            <MenuText>Se déconnecter</MenuText>
          </MenuItem>
        </MenuSection>
      </ProfileDropdown>
    </>
  );
};

export default UserProfileMenu;