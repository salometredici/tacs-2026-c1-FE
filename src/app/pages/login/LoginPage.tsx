import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoginContainer,
  LoginCard,
  LoginLogo,
  LoginTitle,
  LoginSubtitle,
  LoginForm,
  LoginLabel,
  LoginInput,
  LoginButton,
} from './LoginPage.styles';

const LogoTACS = () => (
  <svg viewBox="0 0 100 100" width="80" height="80" aria-label="TACS logo">
    <circle cx="50" cy="50" r="48" fill="#1976d2" stroke="white" strokeWidth="2" />
    <polygon points="50,20 58,38 78,38 62,50 68,70 50,58 32,70 38,50 22,38 42,38" fill="white" opacity="0.9" />
    <circle cx="50" cy="50" r="8" fill="#1976d2" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', password: '' });

  const handleChange = (e: { target: HTMLInputElement }) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo>
          <LogoTACS />
        </LoginLogo>
        <LoginTitle>TACS</LoginTitle>
        <LoginSubtitle>Intercambio de Figuritas Mundial 2026</LoginSubtitle>
        <LoginForm onSubmit={handleSubmit}>
          <LoginLabel>Usuario</LoginLabel>
          <LoginInput
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            placeholder="Ingresá tu usuario"
          />
          <LoginLabel>Contraseña</LoginLabel>
          <LoginInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresá tu contraseña"
          />
          <LoginButton type="submit">Ingresar</LoginButton>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}
