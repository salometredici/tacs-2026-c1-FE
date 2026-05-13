import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../context/useUserContext';
import { API_CONFIG } from '../../config/apiConfig';
import { register } from '../../api/AuthService';
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
  ToggleAuthMode,
  ErrorText,
} from './LoginPage.styles';

const LogoTACS = () => (
  <img src="/assets/football-svgrepo-com.svg" alt="Logo TACS" width={80} height={80} />
);

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        const derivedName = form.email.split('@')[0] || form.email;
        const { token, user } = await register({
          name: derivedName,
          email: form.email,
          password: form.password,
          avatarId: 'avatar_1',
        });
        login(user, token);
      } else {
        const response = await axios.post(API_CONFIG.auth.login, {
          email: form.email,
          password: form.password,
        });
        const { token, user } = response.data;
        login(user, token);
      }
      navigate('/');
    } catch {
      setError(
        mode === 'register'
          ? 'No se pudo crear la cuenta. Probá con otro email.'
          : 'Email o contraseña incorrectos'
      );
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === 'register';
  const submitLabel = isRegister
    ? (loading ? 'Creando...' : 'Crear cuenta')
    : (loading ? 'Ingresando...' : 'Ingresar');
  const toggleLabel = isRegister
    ? '¿Ya tenés cuenta? Ingresá'
    : '¿No tenés cuenta? Registrate';

  return (
    <LoginContainer>
      <LoginCard>
        <LoginLogo>
          <LogoTACS />
        </LoginLogo>
        <LoginTitle>TACS K3061</LoginTitle>
        <LoginSubtitle>
          {isRegister ? 'Creá tu cuenta para empezar' : 'Intercambio de Figuritas Mundial 2026'}
        </LoginSubtitle>
        <LoginForm onSubmit={handleSubmit}>
          <LoginLabel>Email</LoginLabel>
          <LoginInput
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ingresá tu email"
            autoComplete="email"
            required
          />
          <LoginLabel>Contraseña</LoginLabel>
          <LoginInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresá tu contraseña"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <LoginButton type="submit" disabled={loading}>
            {submitLabel}
          </LoginButton>
          <ToggleAuthMode type="button" onClick={toggleMode} disabled={loading}>
            {toggleLabel}
          </ToggleAuthMode>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
}
