import { Proposal } from '../../../interfaces/proposals/Proposal';
import { Publication } from '../../../interfaces/publications/Publication';
import EmptyState from '../../../components/common/EmptyState';
import { SectionTitle, ProposalList } from '../PublicationDetailPage.styles';
import ProposalCardItem from './ProposalCardItem';

interface Props {
  proposals: Proposal[];
  publication: Publication;
  isActive: boolean;
  actionLoading: string | null;
  onAccept: (proposal: Proposal) => void;
  onReject: (proposal: Proposal) => void;
}

export default function ProposalsList({
  proposals, publication, isActive, actionLoading, onAccept, onReject,
}: Props) {
  const pendingCount = proposals.filter(p => p.status === 'PENDIENTE').length;
  return (
    <section>
      <SectionTitle>
        Propuestas recibidas ({proposals.length}
        {pendingCount > 0 && ` · ${pendingCount} pendiente${pendingCount !== 1 ? 's' : ''}`})
      </SectionTitle>
      {proposals.length === 0 ? (
        <EmptyState>Aún no hay propuestas sobre esta publicación.</EmptyState>
      ) : (
        <ProposalList>
          {proposals.map(p => (
            <ProposalCardItem
              key={p.id}
              proposal={p}
              publication={publication}
              showActions={isActive && p.status === 'PENDIENTE'}
              actionLoading={actionLoading}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </ProposalList>
      )}
    </section>
  );
}
