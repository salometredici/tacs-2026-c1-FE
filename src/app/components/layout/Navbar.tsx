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
  <span className="material-symbols-outlined" aria-hidden="true">person</span>
);

const IconBell = () => (
  <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
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
