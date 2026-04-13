import {
  NavbarContainer,
  BrandSection,
  BrandTitle,
  ActionsSection,
  NavButton,
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
  return (
    <NavbarContainer>
      <BrandSection>
        <BrandTitle onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          TACS K3061
        </BrandTitle>
      </BrandSection>

      <ActionsSection>
        <NavButton title="Notificaciones">
          <IconBell />
        </NavButton>
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
