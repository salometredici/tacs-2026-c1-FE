import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const AuctionsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

export const AuctionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

export const AuctionsTitle = styled.h1`
  color: ${theme.colors.primary};
  font-size: 2rem;
`;

export const CreateButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const AuctionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
`;

export const AuctionCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }
`;

export const FiguritaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.md};
`;

export const FiguritaNumber = styled.h3`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  min-width: 60px;
`;

export const FiguritaDetails = styled.div`
  flex: 1;

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: ${theme.colors.textSecondary};

    strong {
      color: ${theme.colors.text};
      font-weight: 600;
    }
  }
`;

export const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} 0;

  span {
    font-size: 0.85rem;
    color: ${theme.colors.textSecondary};
  }

  .seller-name {
    font-weight: 600;
    color: ${theme.colors.text};
  }

  .reputation {
    color: #f57c00;
    font-weight: 600;
  }
`;

export const AuctionStatus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

export const StarsRating = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  color: #f57c00;
`;

export const TimeRemaining = styled.div`
  color: ${props => props.color || theme.colors.textSecondary};
  font-weight: 600;
  font-size: 0.9rem;
`;

export const BestBidInfo = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;

  .bid-label {
    color: ${theme.colors.textSecondary};
    margin-bottom: 0.25rem;
  }

  .bid-details {
    color: ${theme.colors.text};
    font-weight: 600;
  }
`;

export const RequirmentsInfo = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.85rem;
  border-left: 3px solid ${theme.colors.primary};

  .requirement {
    margin: 0.25rem 0;
    color: ${theme.colors.text};

    .label {
      color: ${theme.colors.textSecondary};
      margin-right: 0.5rem;
    }

    .value {
      font-weight: 600;
      color: ${theme.colors.primary};
    }
  }
`;

export const BidButton = styled.button`
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #1565c0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:disabled {
    background: ${theme.colors.border};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const LoadingMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  padding: ${theme.spacing.xl};
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  padding: ${theme.spacing.xl};
`;
