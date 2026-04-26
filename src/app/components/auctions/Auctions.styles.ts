import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const AuctionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};

  @media (max-width: 600px) { padding: ${theme.spacing.md}; }
`;

export const AuctionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  gap: ${theme.spacing.md};
`;

export const AuctionsTitle = styled.h1`
  color: ${theme.colors.onBackground};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 400;
  margin: 0;
`;

// M3 Filled Button
export const CreateButton = styled.button`
  padding: 10px ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:active::after { opacity: ${theme.state.pressed}; }
`;

export const AuctionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
`;

// M3 Elevated Card
export const AuctionCard = styled.div`
  background: ${theme.colors.surfaceContainerLow};
  border-radius: ${theme.shape.medium};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.elevation[1]};
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.primary};
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${theme.elevation[2]};
    &::after { opacity: ${theme.state.hover}; }
  }
`;

export const FiguritaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.outlineVariant};
  padding-bottom: ${theme.spacing.md};
`;

export const FiguritaNumber = styled.h3`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.headlineSmall.fontSize};
  font-weight: 500;
  min-width: 56px;
`;

export const FiguritaDetails = styled.div`
  flex: 1;

  p {
    margin: 0.2rem 0;
    font-size: ${theme.typography.bodyMedium.fontSize};
    color: ${theme.colors.onSurfaceVariant};

    strong {
      color: ${theme.colors.onSurface};
      font-weight: 500;
    }
  }
`;

export const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  span {
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.onSurfaceVariant};
  }

  .seller-name {
    font-weight: 500;
    color: ${theme.colors.onSurface};
  }

  .reputation {
    color: ${theme.colors.tertiary};
    font-weight: 500;
  }
`;

export const AuctionStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${theme.typography.bodySmall.fontSize};
`;

export const StarsRating = styled.span`
  display: inline-block;
  font-size: ${theme.typography.bodySmall.fontSize};
  color: ${theme.colors.tertiary};
`;

export const TimeRemaining = styled.div`
  color: ${props => props.color || theme.colors.onSurfaceVariant};
  font-weight: 500;
  font-size: ${theme.typography.labelLarge.fontSize};
`;

// M3 Filled Card (tonal) – last bid info
export const BestBidInfo = styled.div`
  background: ${theme.colors.secondaryContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.bodySmall.fontSize};

  .bid-label {
    color: ${theme.colors.onSecondaryContainer};
    opacity: 0.7;
    margin-bottom: 0.15rem;
  }

  .bid-details {
    color: ${theme.colors.onSecondaryContainer};
    font-weight: 500;
  }
`;

// M3 Filled Card (tonal) – requirements
export const RequirmentsInfo = styled.div`
  background: ${theme.colors.primaryContainer};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.shape.small};
  font-size: ${theme.typography.bodySmall.fontSize};

  .requirement {
    margin: 0.2rem 0;

    .label {
      color: ${theme.colors.onPrimaryContainer};
      opacity: 0.7;
      margin-right: 0.4rem;
    }

    .value {
      font-weight: 500;
      color: ${theme.colors.onPrimaryContainer};
    }
  }
`;

// M3 Filled Button
export const BidButton = styled.button`
  padding: 10px ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  border-radius: ${theme.shape.full};
  font-size: ${theme.typography.labelLarge.fontSize};
  font-weight: ${theme.typography.labelLarge.fontWeight};
  letter-spacing: 0.00625em;
  cursor: pointer;
  transition: box-shadow 0.2s;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${theme.colors.onPrimary};
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: inherit;
  }

  &:hover { box-shadow: ${theme.elevation[1]}; &::after { opacity: ${theme.state.hover}; } }
  &:active::after { opacity: ${theme.state.pressed}; }

  &:disabled {
    background: rgba(26, 28, 30, 0.12);
    color: rgba(26, 28, 30, 0.38);
    cursor: not-allowed;
    box-shadow: none;
  }
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
