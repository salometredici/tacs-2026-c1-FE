import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: contents;
`;

export const SearchTitle = styled.h1`
  color: ${theme.colors.onBackground};
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
`;

// M3 Elevated Card – filter section
export const FilterSection = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: ${theme.elevation[1]};
`;

export const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  color: ${theme.colors.onSurface};
`;

// M3 Outlined Text Field
export const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.outline};
  border-radius: ${theme.shape.extraSmall};
  font-size: ${theme.typography.bodyLarge.fontSize};
  background: ${theme.colors.surface};
  color: ${theme.colors.onSurface};
  outline: none;
  transition: border 0.2s;

  &:hover { border-color: ${theme.colors.onSurface}; }
  &:focus { border: 2px solid ${theme.colors.primary}; }
  &::placeholder { color: ${theme.colors.onSurfaceVariant}; }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

// M3 Filled / Tonal Buttons
export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  background-color: ${props =>
    props.variant === 'secondary' ? theme.colors.surfaceContainerHighest : theme.colors.primary};
  color: ${props =>
    props.variant === 'secondary' ? theme.colors.onSurface : theme.colors.onPrimary};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props =>
      props.variant === 'secondary' ? theme.colors.onSurface : theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:active::after { opacity: ${theme.state.pressed}; }
`;

export const ResultsContainer = styled.div`
  margin-top: ${theme.spacing.xl};
`;

export const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
`;

export const ResultCount = styled.p`
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
  margin: 0;
`;

export const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${theme.spacing.lg};
`;

// M3 Elevated Card
export const FiguritaCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${theme.elevation[2]}; }
`;

export const FiguritaNumber = styled.h3`
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 500;
`;

export const FiguritaInfo = styled.p`
  margin: ${theme.spacing.xs} 0;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyMedium.fontSize};

  strong { color: ${theme.colors.onSurface}; font-weight: 500; }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
  padding: ${theme.spacing.xl};
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.onSurfaceVariant};
  font-size: ${theme.typography.bodyLarge.fontSize};
  padding: ${theme.spacing.xl};
`;

// M3 Filled Tonal Button
export const ProposeButton = styled.button`
  margin-top: ${theme.spacing.sm};
  width: 100%;
  padding: 8px ${theme.spacing.md};
  background: ${theme.colors.secondaryContainer};
  color: ${theme.colors.onSecondaryContainer};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelMedium.fontSize};
  font-weight: ${theme.typography.labelMedium.fontWeight};
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: box-shadow 0.15s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: ${theme.colors.onSecondaryContainer};
    opacity: 0; transition: opacity 0.15s; border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
`;
