// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotificationDetail from './NotificationDetail';
import type { Notification } from '../../interfaces/Notification';

afterEach(cleanup);

const wrap = (notification: Notification, onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <NotificationDetail notification={notification} onClose={onClose} />
    </MemoryRouter>,
  );

const makeNotif = (overrides: Partial<Notification> = {}): Notification => ({
  id: 'n1',
  message: 'Tienes una nueva propuesta',
  read: false,
  type: 'TRADE_PROPOSAL_RECEIVED',
  referenceId: '',
  ...overrides,
});

describe('NotificationDetail — content', () => {
  it('renders the notification message', () => {
    wrap(makeNotif());
    expect(screen.getByText('Tienes una nueva propuesta')).toBeTruthy();
  });

  it('renders the human-readable type label for known types', () => {
    wrap(makeNotif({ type: 'TRADE_PROPOSAL_RECEIVED' }));
    expect(screen.getByText('Propuesta de intercambio recibida')).toBeTruthy();
  });

  it('falls back to the raw type string for unknown types', () => {
    wrap(makeNotif({ type: 'UNKNOWN_TYPE' }));
    expect(screen.getByText('UNKNOWN_TYPE')).toBeTruthy();
  });
});

describe('NotificationDetail — navigate button', () => {
  it('shows navigation button for TRADE_PROPOSAL type', () => {
    wrap(makeNotif({ type: 'TRADE_PROPOSAL_RECEIVED' }));
    expect(screen.getByText('Ir a propuestas')).toBeTruthy();
  });

  it('shows "Ir a subasta" for AUCTION type with referenceId', () => {
    wrap(makeNotif({ type: 'AUCTION_OFFER_RECEIVED', referenceId: 'auction-1' }));
    expect(screen.getByText('Ir a subasta')).toBeTruthy();
  });

  it('hides navigate button when AUCTION type has no referenceId', () => {
    wrap(makeNotif({ type: 'AUCTION_CANCELLED', referenceId: '' }));
    expect(screen.queryByText('Ir a subasta')).toBeNull();
  });

  it('shows "Ir a publicación" for WANTED_CARD_AVAILABLE_IN_PUBLICATION with referenceId', () => {
    wrap(makeNotif({ type: 'WANTED_CARD_AVAILABLE_IN_PUBLICATION', referenceId: 'pub-1' }));
    expect(screen.getByText('Ir a publicación')).toBeTruthy();
  });
});

describe('NotificationDetail — close behaviour', () => {
  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <NotificationDetail notification={makeNotif()} onClose={onClose} />
      </MemoryRouter>,
    );
    fireEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    wrap(makeNotif(), onClose);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
