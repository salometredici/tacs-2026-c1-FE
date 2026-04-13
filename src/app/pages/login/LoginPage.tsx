import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';
import { mockUser } from '../../../mocks/usersMock';
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
  <img src="/assets/football-svgrepo-com.svg" alt="Logo TACS" width={80} height={80} />
);

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [form, setForm] = useState({ usuario: '', password: '' });

  const handleChange = (e: { target: HTMLInputElement }) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Por ahora, usamos mockUser porque no hay desarrollo de auth
    login(mockUser);
    navigate('/');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo>
          <LogoTACS />
        </LoginLogo>
        <LoginTitle>TACS K3061</LoginTitle>
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
