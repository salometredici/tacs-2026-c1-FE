import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/useAdminContext';
import {
  AdminLoginContainer,
  AdminLoginCard,
  AdminLoginIcon,
  AdminLoginTitle,
  AdminLoginSubtitle,
  AdminLoginForm,
  AdminLoginLabel,
  AdminLoginInput,
  AdminLoginButton,
  AdminLoginError,
} from './AdminLoginPage.styles';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminLogin } = useAdminContext();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await adminLogin(form.username, form.password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
    setLoading(false);
  };

  return (
    <AdminLoginContainer>
      <AdminLoginCard>
        <AdminLoginIcon>🔐</AdminLoginIcon>
        <AdminLoginTitle>Panel Admin</AdminLoginTitle>
        <AdminLoginSubtitle>TACS K3061 — Acceso restringido</AdminLoginSubtitle>
        <AdminLoginForm onSubmit={handleSubmit}>
          <AdminLoginLabel>Usuario</AdminLoginLabel>
          <AdminLoginInput
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Usuario administrador"
            autoComplete="username"
          />
          <AdminLoginLabel>Contraseña</AdminLoginLabel>
          <AdminLoginInput
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            autoComplete="current-password"
          />
          {error && <AdminLoginError>{error}</AdminLoginError>}
          <AdminLoginButton type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </AdminLoginButton>
        </AdminLoginForm>
      </AdminLoginCard>
    </AdminLoginContainer>
  );
}
