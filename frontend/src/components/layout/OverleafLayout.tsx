import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { colors, spacing, shadows, borderRadius, typography, transitions } from '../../styles/GlobalStyles';
import { useAuth } from '../../contexts/AuthContext';
import UserProfileMenu from './UserProfileMenu';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.backgroundSecondary};
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '280px' : '0'};
  background: ${colors.white};
  border-right: 1px solid ${colors.borderLight};
  transition: width ${transitions.normal};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${shadows.sm};
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: ${props => props.$isOpen ? '320px' : '0'};
    box-shadow: ${props => props.$isOpen ? shadows.xl : 'none'};
  }
`;

const SidebarHeader = styled.div`
  padding: ${spacing.xl};
  border-bottom: 1px solid ${colors.borderLight};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
`;

const LogoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.md};
  object-fit: contain;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: ${spacing.lg};
  overflow-y: auto;
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.backgroundSecondary};
  transition: margin-left ${transitions.normal};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  background: ${colors.white};
  border-bottom: 1px solid ${colors.borderLight};
  padding: 0 ${spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  box-shadow: ${shadows.sm};
  z-index: 50;
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};
  color: ${colors.textSecondary};

  &:hover {
    background: ${colors.hover};
    color: ${colors.textPrimary};
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all ${transitions.fast};

  &:hover {
    background: ${colors.hover};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.full};
  background: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${typography.fontSize.sm};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: auto;
  background: ${colors.backgroundSecondary};
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;

  @media (min-width: 769px) {
    display: none;
  }
`;

const OverleafLayout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true, 
  sidebarContent 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const getInitials = (email: string) => {
    return email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <LayoutContainer>
      <SidebarOverlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      {showSidebar && (
        <Sidebar $isOpen={sidebarOpen}>
          <SidebarHeader>
            <Logo>
              <LogoIcon src="/logo.png" alt="NoteMaster Logo" />
              NoteMaster
            </Logo>
          </SidebarHeader>
          <SidebarContent>
            {sidebarContent}
          </SidebarContent>
        </Sidebar>
      )}

      <MainContent $sidebarOpen={sidebarOpen && showSidebar}>
        <TopBar>
          <TopBarLeft>
            <MenuButton onClick={toggleSidebar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </MenuButton>
          </TopBarLeft>

          <TopBarRight>
            <UserProfile ref={profileRef} onClick={toggleProfileMenu}>
              <UserAvatar>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                  />
                ) : (
                  getInitials(user?.email || '')
                )}
              </UserAvatar>
            </UserProfile>
          </TopBarRight>
        </TopBar>

        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>

      <UserProfileMenu
        isOpen={profileMenuOpen}
        onClose={() => setProfileMenuOpen(false)}
        anchorEl={profileRef.current}
      />
    </LayoutContainer>
  );
};

export default OverleafLayout;