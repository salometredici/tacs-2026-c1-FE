// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import HorizontalCarousel from './HorizontalCarousel';

afterEach(cleanup);

describe('HorizontalCarousel', () => {
  it('renders children', () => {
    render(
      <HorizontalCarousel>
        <div>Item 1</div>
        <div>Item 2</div>
      </HorizontalCarousel>,
    );
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });

  it('renders previous and next arrow buttons', () => {
    render(<HorizontalCarousel><div>x</div></HorizontalCarousel>);
    expect(screen.getByLabelText('Anterior')).toBeTruthy();
    expect(screen.getByLabelText('Siguiente')).toBeTruthy();
  });

  it('respects custom ariaLabel props', () => {
    render(
      <HorizontalCarousel ariaLabelPrev="Prev custom" ariaLabelNext="Next custom">
        <div>x</div>
      </HorizontalCarousel>,
    );
    expect(screen.getByLabelText('Prev custom')).toBeTruthy();
    expect(screen.getByLabelText('Next custom')).toBeTruthy();
  });
});
