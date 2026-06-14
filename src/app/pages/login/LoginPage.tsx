import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../../context/useUserContext';
import { useAdminContext } from '../../context/useAdminContext';
import { API_CONFIG } from '../../config/apiConfig';
import { register } from '../../api/AuthService';
import { LoginResponse } from '../../interfaces/auth/LoginResponse';
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
type FieldErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>;

// Regex razonable para validar formato de email del lado cliente
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserContext();
  const { setAdminLoggedIn } = useAdminContext();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    // Limpia el error del campo que se está editando (UX: no insistir mientras el usuario corrige)
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setFieldErrors({});
    setForm(prev => ({ ...prev, confirmPassword: '' }));
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!EMAIL_REGEX.test(form.email)) {
      errors.email = 'Email con formato inválido';
    }
    if (!form.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
    }
    if (mode === 'register') {
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirmá la contraseña';
      } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      let isAdmin = false;
      if (mode === 'register') {
        const derivedName = form.email.split('@')[0] || form.email;
        const { token, user } = await register({
          name: derivedName,
          email: form.email,
          password: form.password,
          avatarId: 'avatar_1',
        });
        login(user, token);
        isAdmin = user.role === 'ADMIN';
      } else {
        const response = await axios.post<LoginResponse>(API_CONFIG.auth.login, {
          email: form.email,
          password: form.password,
        });
        const { token, user } = response.data;
        login(user, token);
        isAdmin = user.role === 'ADMIN';
      }
      if (isAdmin) {
        setAdminLoggedIn(true);
        navigate('/admin');
      } else {
        navigate('/');
      }
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
        <LoginForm onSubmit={handleSubmit} noValidate>
          <LoginLabel>Email</LoginLabel>
          <LoginInput
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ingresá tu email"
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <ErrorText>{fieldErrors.email}</ErrorText>}

          <LoginLabel>Contraseña</LoginLabel>
          <LoginInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresá tu contraseña"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            aria-invalid={!!fieldErrors.password}
          />
          {fieldErrors.password && <ErrorText>{fieldErrors.password}</ErrorText>}

          {isRegister && (
            <>
              <LoginLabel>Confirmar contraseña</LoginLabel>
              <LoginInput
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                aria-invalid={!!fieldErrors.confirmPassword}
              />
              {fieldErrors.confirmPassword && <ErrorText>{fieldErrors.confirmPassword}</ErrorText>}
            </>
          )}

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
