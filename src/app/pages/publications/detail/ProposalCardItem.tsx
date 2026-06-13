import { Proposal } from '../../../interfaces/proposals/Proposal';
import { PROPOSAL_STATUS_LABEL, PROPOSAL_STATUS_TONE as PROPOSAL_TONE } from '../../../interfaces/proposals/ProposalStatus';
import { Publication } from '../../../interfaces/publications/Publication';
import StatusBadge from '../../../components/common/StatusBadge';
import {
  ProposalCard, ProposalInfo, ProposalTitleRow, ProposalTitle, ProposalDetail,
  VerticalDivider, ActionButtons, AcceptButton, RejectButton,
} from '../PublicationDetailPage.styles';

interface Props {
  proposal: Proposal;
  publication: Publication;
  showActions: boolean;
  actionLoading: string | null;
  onAccept: (proposal: Proposal) => void;
  onReject: (proposal: Proposal) => void;
}

export default function ProposalCardItem({
  proposal, publication, showActions, actionLoading, onAccept, onReject,
}: Props) {
  const offeredCount = proposal.offeredCards.length;
  return (
    <ProposalCard>
      <ProposalInfo>
        <ProposalTitleRow>
          <ProposalTitle>De {proposal.bidder.name}</ProposalTitle>
          <StatusBadge tone={PROPOSAL_TONE[proposal.status]}>
            {PROPOSAL_STATUS_LABEL[proposal.status]}
          </StatusBadge>
        </ProposalTitleRow>
        <ProposalDetail>
          Ofrece <strong>{offeredCount}</strong> figurita{offeredCount !== 1 ? 's' : ''}
          {' a cambio de '}
          <strong>{proposal.requestedCount}</strong> de #{publication.card.number} {publication.card.description}
        </ProposalDetail>
        {offeredCount > 0 && (
          <ProposalDetail>
            Ofrecidas: {proposal.offeredCards.map(c => `#${c.number} ${c.description}`).join(', ')}
          </ProposalDetail>
        )}
      </ProposalInfo>
      {showActions && (
        <>
          <VerticalDivider />
          <ActionButtons>
            <AcceptButton
              disabled={actionLoading === proposal.id}
              onClick={() => onAccept(proposal)}
            >
              Aceptar
            </AcceptButton>
            <RejectButton
              disabled={actionLoading === proposal.id}
              onClick={() => onReject(proposal)}
            >
              Rechazar
            </RejectButton>
          </ActionButtons>
        </>
      )}
    </ProposalCard>
  );
}
