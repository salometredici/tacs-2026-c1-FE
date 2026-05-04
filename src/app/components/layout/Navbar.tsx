import { useState, useRef, useEffect } from 'react';
import { useNotificationsContext } from '../../context/useNotificationsContext';
import { useUserContext } from '../../context/useUserContext';
import {
  NavbarContainer,
  BrandSection,
  BrandTitle,
  ActionsSection,
  NavButton,
  BellWrapper,
  Badge,
  NotificationsDropdown,
  NotificationItem,
  EmptyNotification,
} from './Navbar.styles';

interface NavbarProps {
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

const IconPerson = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default function Navbar({ onHomeClick, onProfileClick, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser } = useUserContext();
  const { notifications, unreadCount, markAllAsRead } = useNotificationsContext();
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    if (!dropdownOpen) markAllAsRead();
    setDropdownOpen(prev => !prev);
  };

  return (
    <NavbarContainer>
      <BrandSection>
        <BrandTitle onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          TACS K3061
        </BrandTitle>
      </BrandSection>

<ActionsSection>
        {currentUser && (
          <BellWrapper ref={bellRef}>
            <NavButton title="Notificaciones" onClick={handleBellClick}>
              <IconBell />
              {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
            </NavButton>
            {dropdownOpen && (
              <NotificationsDropdown>
                {notifications.length === 0 ? (
                  <EmptyNotification>Sin notificaciones nuevas.</EmptyNotification>
                ) : (
                  notifications.map(n => (
                    <NotificationItem key={n.id} $read={n.read}>
                      {n.message}
                    </NotificationItem>
                  ))
                )}
              </NotificationsDropdown>
            )}
          </BellWrapper>
        )}

        <NavButton title="Mi Perfil" onClick={onProfileClick}>
          <IconPerson />
        </NavButton>
        <NavButton title="Cerrar Sesión" onClick={onLogout}>
          Salir
        </NavButton>
      </ActionsSection>
    </NavbarContainer>
  );
}
