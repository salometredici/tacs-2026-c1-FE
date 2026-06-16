// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';

afterEach(cleanup);

// Mocks de dependencias externas a la page: router, contextos y servicios HTTP.
// `useNavigate` se reemplaza por un spy para verificar a dónde redirige según el rol.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockLogin = vi.fn();
const mockSetAdminLoggedIn = vi.fn();
vi.mock('../../context/useUserContext', () => ({
  useUserContext: () => ({ login: mockLogin }),
}));
vi.mock('../../context/useAdminContext', () => ({
  useAdminContext: () => ({ setAdminLoggedIn: mockSetAdminLoggedIn }),
}));

vi.mock('axios');
vi.mock('../../api/AuthService', () => ({
  register: vi.fn(),
}));

import axios from 'axios';
import { register } from '../../api/AuthService';

const mockPost = axios.post as ReturnType<typeof vi.fn>;
const mockRegister = register as ReturnType<typeof vi.fn>;

const userBase = {
  id: 'u1', name: 'Pepe', email: 'pepe@test.com',
  role: 'USER' as const, rating: null, exchangesAmount: 0,
  avatarId: 'avatar_1' as const, creationDate: '2026-01-01',
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Render inicial / toggle ─────────────────────────────────────────────

describe('LoginPage — render inicial', () => {
  it('arranca en modo login (sin campo de confirmar contraseña)', () => {
    render(<LoginPage />);
    expect(screen.getByText('Ingresar')).toBeTruthy();
    expect(screen.queryByPlaceholderText('Repetí la contraseña')).toBeNull();
  });

  it('toggle a modo register muestra el campo de confirmar contraseña', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/No tenés cuenta\? Registrate/));
    expect(screen.getByText('Crear cuenta')).toBeTruthy();
    expect(screen.getByPlaceholderText('Repetí la contraseña')).toBeTruthy();
  });
});

// ─── Validación de formulario ────────────────────────────────────────────

describe('LoginPage — validación cliente', () => {
  it('email vacío muestra error y no llama al BE', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Ingresar'));
    await waitFor(() => expect(screen.getByText('El email es obligatorio')).toBeTruthy());
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('email mal formado muestra error', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'no-es-email', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.click(screen.getByText('Ingresar'));
    await waitFor(() => expect(screen.getByText('Email con formato inválido')).toBeTruthy());
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('contraseña corta muestra error', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'a@b.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: '123', name: 'password' } });
    fireEvent.click(screen.getByText('Ingresar'));
    await waitFor(() => expect(screen.getByText(/al menos 6 caracteres/)).toBeTruthy());
  });

  it('en register, contraseñas no coinciden muestra error', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/No tenés cuenta\? Registrate/));
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'a@b.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Repetí la contraseña'), { target: { value: 'distinto', name: 'confirmPassword' } });
    fireEvent.click(screen.getByText('Crear cuenta'));
    await waitFor(() => expect(screen.getByText('Las contraseñas no coinciden')).toBeTruthy());
    expect(mockRegister).not.toHaveBeenCalled();
  });
});

// ─── Login flow ──────────────────────────────────────────────────────────

describe('LoginPage — login flow', () => {
  it('USER exitoso: llama login(), navega a "/" y NO marca admin', async () => {
    mockPost.mockResolvedValue({ data: { token: 'tk', user: userBase } });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'pepe@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith(userBase, 'tk'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockSetAdminLoggedIn).not.toHaveBeenCalled();
  });

  it('ADMIN exitoso: marca admin y navega a "/admin"', async () => {
    const admin = { ...userBase, role: 'ADMIN' as const };
    mockPost.mockResolvedValue({ data: { token: 'tk', user: admin } });
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'admin@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => expect(mockSetAdminLoggedIn).toHaveBeenCalledWith(true));
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('credenciales inválidas muestra mensaje de error', async () => {
    mockPost.mockRejectedValue(new Error('401'));
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'a@b.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => expect(screen.getByText('Email o contraseña incorrectos')).toBeTruthy());
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─── Register flow ───────────────────────────────────────────────────────

describe('LoginPage — register flow', () => {
  it('crea cuenta, hace login automático y navega a "/"', async () => {
    mockRegister.mockResolvedValue({ token: 'tk-new', user: userBase });
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/No tenés cuenta\? Registrate/));
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'pepe@test.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Repetí la contraseña'), { target: { value: 'secreto', name: 'confirmPassword' } });
    fireEvent.click(screen.getByText('Crear cuenta'));

    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    expect(mockRegister.mock.calls[0][0]).toMatchObject({
      email: 'pepe@test.com',
      password: 'secreto',
      avatarId: 'avatar_1',
    });
    expect(mockLogin).toHaveBeenCalledWith(userBase, 'tk-new');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('falla del register muestra mensaje específico de register', async () => {
    mockRegister.mockRejectedValue(new Error('email taken'));
    render(<LoginPage />);
    fireEvent.click(screen.getByText(/No tenés cuenta\? Registrate/));
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu email'), { target: { value: 'a@b.com', name: 'email' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), { target: { value: 'secreto', name: 'password' } });
    fireEvent.change(screen.getByPlaceholderText('Repetí la contraseña'), { target: { value: 'secreto', name: 'confirmPassword' } });
    fireEvent.click(screen.getByText('Crear cuenta'));

    await waitFor(() => expect(screen.getByText(/No se pudo crear la cuenta/)).toBeTruthy());
  });
});
