// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

afterEach(cleanup);

const baseProps = {
  open: true,
  title: 'Confirmar acción',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe('ConfirmDialog', () => {
  it('renders nothing when open=false', () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders title when open=true', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByText('Confirmar acción')).toBeTruthy();
  });

  it('renders message prop', () => {
    render(<ConfirmDialog {...baseProps} message="¿Estás seguro?" />);
    expect(screen.getByText('¿Estás seguro?')).toBeTruthy();
  });

  it('renders children instead of message when both provided', () => {
    render(
      <ConfirmDialog {...baseProps} message="ignorado">
        <span>Contenido hijo</span>
      </ConfirmDialog>,
    );
    expect(screen.getByText('Contenido hijo')).toBeTruthy();
    expect(screen.queryByText('ignorado')).toBeNull();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('uses custom confirmLabel and cancelLabel', () => {
    render(<ConfirmDialog {...baseProps} confirmLabel="Sí, borrar" cancelLabel="No, volver" />);
    expect(screen.getByText('Sí, borrar')).toBeTruthy();
    expect(screen.getByText('No, volver')).toBeTruthy();
  });

  it('shows loadingLabel and disables buttons when loading=true', () => {
    render(<ConfirmDialog {...baseProps} loading loadingLabel="Guardando..." />);
    expect(screen.getByText('Guardando...')).toBeTruthy();
    const buttons = screen.getAllByRole('button');
    buttons.forEach(b => expect((b as HTMLButtonElement).disabled).toBe(true));
  });

  it('calls onCancel when overlay is clicked (not the dialog) and not loading', () => {
    const onCancel = vi.fn();
    const { container } = render(<ConfirmDialog {...baseProps} onCancel={onCancel} />);
    // The overlay is the first child of the container
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not call onCancel when overlay clicked while loading', () => {
    const onCancel = vi.fn();
    const { container } = render(<ConfirmDialog {...baseProps} onCancel={onCancel} loading />);
    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
