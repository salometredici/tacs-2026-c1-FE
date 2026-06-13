import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotificationsContext } from '../../context/useNotificationsContext';
import { useUserContext } from '../../context/useUserContext';
import { Notification } from '../../interfaces/Notification';
import NotificationDetail from '../notifications/NotificationDetail';
import {
  NavbarContainer,
  BrandSection,
  BrandIcon,
  BrandTitle,
  NavLinksSection,
  NavTextLink,
  ActionsSection,
  NavButton,
  BellWrapper,
  Badge,
  NotificationsDropdown,
  NotificationItem,
  EmptyNotification,
  ViewAllLink,
} from './Navbar.styles';

interface NavbarProps {
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

const NAV_LINKS = [
  { label: 'Inicio',       path: '/' },
  { label: 'Catálogo',     path: '/catalog' },
  { label: 'Buscar',       path: '/search' },
  { label: 'Subastas',     path: '/auctions' },
  { label: 'Intercambios', path: '/exchanges' },
];

const IconPerson = () => (
  <span className="material-symbols-outlined" aria-hidden="true">person</span>
);

const IconBell = () => (
  <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
);

export default function Navbar({ onProfileClick, onLogout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const { currentUser } = useUserContext();
  const { notifications, unreadCount, hasMoreUnread, refetch, markAsRead } = useNotificationsContext();
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!dropdownOpen) refetch();
    setDropdownOpen(prev => !prev);
  };

  const handleViewAll = () => {
    setDropdownOpen(false);
    navigate('/notifications');
  };

  return (
    <>
    <NavbarContainer>
      <BrandSection>
        <BrandIcon onClick={() => navigate('/')} aria-label="Inicio">
          <span className="material-symbols-outlined" aria-hidden="true">sports_soccer</span>
        </BrandIcon>
        <BrandTitle onClick={() => navigate('/')}>
          TACS K3061
        </BrandTitle>
      </BrandSection>

      <NavLinksSection>
        {NAV_LINKS.map(({ label, path }) => (
          <NavTextLink
            key={path}
            onClick={() => navigate(path)}
            aria-current={location.pathname === path ? 'page' : undefined}
          >
            {label}
          </NavTextLink>
        ))}
      </NavLinksSection>

      <ActionsSection>
        {currentUser && (
          <BellWrapper ref={bellRef}>
            <NavButton title="Notificaciones" onClick={handleBellClick}>
              <IconBell />
              {unreadCount > 0 && <Badge>{hasMoreUnread ? '5+' : unreadCount}</Badge>}
            </NavButton>
            {dropdownOpen && (
              <NotificationsDropdown>
                {notifications.length === 0 ? (
                  <EmptyNotification>Sin notificaciones nuevas.</EmptyNotification>
                ) : (
                  notifications.map(n => (
                    <NotificationItem key={n.id} $read={n.read} onClick={() => {
                      setDropdownOpen(false);
                      setSelectedNotification(n);
                      if (!n.read) markAsRead(n.id);
                    }}>
                      {n.message ?? 'Notificación'}
                    </NotificationItem>
                  ))
                )}
                <ViewAllLink onClick={handleViewAll}>
                  <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
                  Ver todas las notificaciones
                </ViewAllLink>
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

    {selectedNotification && (
      <NotificationDetail
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    )}
    </>
  );
}
