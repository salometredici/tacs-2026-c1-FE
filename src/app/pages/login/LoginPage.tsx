import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../context/useUserContext';
import { API_CONFIG } from '../../config/apiConfig';
import { mockUsers } from '../../../mocks/usersMock';
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
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Para reemplazar el mock del user por la invocación real cuando esté elendpoint
    // try {
    //   const response = await axios.post(API_CONFIG.auth.login, {
    //     email: form.email,
    //     password: form.password,
    //   });
    //   const { token, user } = response.data;
    //   login(user, token);
    //   navigate('/');
    // } catch {
    //   setError('Email o contraseña incorrectos.');
    // } finally {
    //   setLoading(false);
    // }

    // linea a borrar!
    login(mockUsers[0], 'mock-token');
    navigate('/');
    setLoading(false);
  };

  void axios;
  void API_CONFIG;

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo>
          <LogoTACS />
        </LoginLogo>
        <LoginTitle>TACS K3061</LoginTitle>
        <LoginSubtitle>Intercambio de Figuritas Mundial 2026</LoginSubtitle>
        <LoginForm onSubmit={handleSubmit}>
          <LoginLabel>Email</LoginLabel>
          <LoginInput
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ingresá tu email"
            autoComplete="email"
          />
          <LoginLabel>Contraseña</LoginLabel>
          <LoginInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
          />
          {error && <p style={{ color: '#d32f2f', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </LoginButton>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}
