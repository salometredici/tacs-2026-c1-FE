import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../interfaces/auth/User';
import { MissingCard } from '../../interfaces/cards/MissingCard';
import { Proposal } from '../../interfaces/proposals/Proposal';
import { Auction } from '../../interfaces/auctions/Auction';
import { UserBid } from '../../interfaces/auctions/bid/UserBid';
import { Publication } from '../../interfaces/publications/Publication';
import { Exchange } from '../../interfaces/exchanges/Exchange';
import { getUserMissingCards } from '../../api/UsersService';
import { getAuctionsByUserId, getAuctionBidsByUserId } from '../../api/AuctionsService';
import { getProposals, acceptProposal, rejectProposal } from '../../api/ProposalsService';
import { getMyPublications } from '../../api/PublicationsService';
import { getExchangesByUserId } from '../../api/ExchangesService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useFetch } from '../../hooks/useFetch';
import { useSnackbar } from '../../context/useSnackbar';
import {
  ProfileContainer, ProfileHeader, ProfileAvatar, ProfileTitle, ProfileEmail, ProfileMeta, ProfileMetaStar,
  TabSection, TabNav, TabButton,
} from './ProfilePage.styles';
import EmptyState from '../../components/common/EmptyState';
import Collection from '../../components/collection/Collection';
import AddMissingCardsModal from '../../components/cards/AddMissingCardsModal';
import PublishCardModal from '../../components/exchanges/PublishCardModal';
import ExchangeDetailModal from '../../components/exchanges/ExchangeDetailModal';
import ProposalDetailModal from '../../components/proposals/ProposalDetailModal';
import MissingTab from './tabs/MissingTab';
import PublicationsTab from './tabs/PublicationsTab';
import ProposalsTab from './tabs/ProposalsTab';
import AuctionsTab from './tabs/AuctionsTab';
import ExchangesTab from './tabs/ExchangesTab';

type Tab = 'collection' | 'missing' | 'publications' | 'propuestas' | 'subastas' | 'exchanges';

export default function ProfilePage() {
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess, showError } = useSnackbar();
  const user: User = currentUser;

  const [activeTab, setActiveTab] = useState<Tab>('collection');
  const [showAddMissingModal, setShowAddMissingModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [exchangeDetail, setExchangeDetail] = useState<Exchange | null>(null);
  const [proposalDetail, setProposalDetail] = useState<Proposal | null>(null);

  // Carga las 7 secciones en paralelo con allSettled. Si una sola falla, el resto igual se muestra.
  // Si TODAS fallan, marcamos error global. `refetch` re-corre las 7 (lo invocan los modales de
  // crear faltante / publicar figurita, y "Ya la conseguí")
  const { data, isLoading, error, refetch } = useFetch(
    () => Promise.allSettled([
      getUserMissingCards(user.id),
      getProposals(user.id),
      getProposals('', user.id),
      getMyPublications(user.id),
      getAuctionsByUserId(user.id),
      getAuctionBidsByUserId(user.id),
      getExchangesByUserId(user.id),
    ]).then(results => {
      const allFailed = results.every(r => r.status === 'rejected');
      if (allFailed) throw new Error('all sections failed');
      const valueOr = <U,>(r: PromiseSettledResult<U>, fallback: U): U =>
        r.status === 'fulfilled' ? r.value : fallback;
      return {
        missing:      valueOr<MissingCard[]>(results[0] as PromiseSettledResult<MissingCard[]>, []),
        received:     valueOr<Proposal[]>(results[1] as PromiseSettledResult<Proposal[]>, []),
        sent:         valueOr<Proposal[]>(results[2] as PromiseSettledResult<Proposal[]>, []),
        publications: valueOr<Publication[]>(results[3] as PromiseSettledResult<Publication[]>, []),
        myAuctions:   valueOr<Auction[]>(results[4] as PromiseSettledResult<Auction[]>, []),
        myOffers:     valueOr<UserBid[]>(results[5] as PromiseSettledResult<UserBid[]>, []),
        exchanges:    valueOr<Exchange[]>(results[6] as PromiseSettledResult<Exchange[]>, []),
      };
    }),
    [user.id],
  );
  const missing      = data?.missing      ?? [];
  const received     = data?.received     ?? [];
  const sent         = data?.sent         ?? [];
  const publications = data?.publications ?? [];
  const myAuctions   = data?.myAuctions   ?? [];
  const myOffers     = data?.myOffers     ?? [];
  const exchanges    = data?.exchanges    ?? [];

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      await acceptProposal(proposal.id, user.id);
      showSuccess('Propuesta aceptada');
      refetch();
    } catch {
      showError('Error al aceptar la propuesta. Intentá nuevamente.');
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    try {
      await rejectProposal(proposal.id, user.id);
      showSuccess('Propuesta rechazada');
      refetch();
    } catch {
      showError('Error al rechazar la propuesta. Intentá nuevamente.');
    }
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar src="/assets/user-svgrepo-com.svg" alt={user.name} />
        <div>
          <ProfileTitle>{user.name}</ProfileTitle>
          <ProfileEmail>{user.email}</ProfileEmail>
          <ProfileMeta>
            {user.rating != null
              ? <><ProfileMetaStar>★</ProfileMetaStar> {user.rating.toFixed(1)}</>
              : 'Sin calificaciones aún'}
            {' · '}
            {user.exchangesAmount === 0
              ? 'Sin intercambios todavía'
              : user.exchangesAmount === 1
                ? '1 intercambio'
                : `${user.exchangesAmount} intercambios`}
          </ProfileMeta>
        </div>
      </ProfileHeader>

      <TabSection>
        <TabNav>
          <TabButton $active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
            Mi Colección
          </TabButton>
          <TabButton $active={activeTab === 'missing'} onClick={() => setActiveTab('missing')}>
            Faltantes {!isLoading && `(${missing.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'publications'} onClick={() => setActiveTab('publications')}>
            Publicaciones {!isLoading && `(${publications.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'propuestas'} onClick={() => setActiveTab('propuestas')}>
            Propuestas {!isLoading && `(${received.length + sent.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'subastas'} onClick={() => setActiveTab('subastas')}>
            Subastas {!isLoading && `(${myAuctions.length + myOffers.length})`}
          </TabButton>
          <TabButton $active={activeTab === 'exchanges'} onClick={() => setActiveTab('exchanges')}>
            Intercambios {!isLoading && `(${exchanges.length})`}
          </TabButton>
        </TabNav>

        {isLoading ? (
          <EmptyState>Cargando...</EmptyState>
        ) : error ? (
          <EmptyState>Error al cargar los datos.</EmptyState>
        ) : (
          <>
            {activeTab === 'collection' && <Collection userId={user.id} />}
            {activeTab === 'missing' && (
              <MissingTab
                userId={user.id}
                missing={missing}
                onAdd={() => setShowAddMissingModal(true)}
                onRefetch={refetch}
              />
            )}
            {activeTab === 'publications' && (
              <PublicationsTab
                publications={publications}
                onPublish={() => setShowPublishModal(true)}
              />
            )}
            {activeTab === 'propuestas' && (
              <ProposalsTab
                received={received}
                sent={sent}
                onSelect={setProposalDetail}
              />
            )}
            {activeTab === 'subastas' && (
              <AuctionsTab myAuctions={myAuctions} myOffers={myOffers} />
            )}
            {activeTab === 'exchanges' && (
              <ExchangesTab
                userId={user.id}
                exchanges={exchanges}
                onSelect={setExchangeDetail}
              />
            )}
          </>
        )}
      </TabSection>

      {showAddMissingModal && (
        <AddMissingCardsModal
          userId={user.id}
          onClose={() => setShowAddMissingModal(false)}
          onSuccess={refetch}
        />
      )}

      {showPublishModal && (
        <PublishCardModal
          userId={user.id}
          onClose={() => setShowPublishModal(false)}
          onSuccess={refetch}
        />
      )}

      {proposalDetail && (
        <ProposalDetailModal
          proposal={proposalDetail}
          onClose={() => setProposalDetail(null)}
          onAccept={proposalDetail.publication.publisher.id === user.id
            ? () => handleAcceptProposal(proposalDetail)
            : undefined}
          onReject={proposalDetail.publication.publisher.id === user.id
            ? () => handleRejectProposal(proposalDetail)
            : undefined}
        />
      )}

      {exchangeDetail && (
        <ExchangeDetailModal
          exchange={exchangeDetail}
          currentUserId={user.id}
          onClose={() => setExchangeDetail(null)}
        />
      )}
    </ProfileContainer>
  );
}
