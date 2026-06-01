import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { createAuction } from '../../api/AuctionsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { useSnackbar } from '../../context/useSnackbar';
import { AUCTION_DURATION_MIN, AUCTION_DURATION_MAX } from '../../constants/auctions';
import { formatDuration } from '../../utils/utils';
import BackButton from '../../components/common/BackButton';
import {
  PageContainer, Header, Title, Card, Field, Label, Hint,
  StarsRow, ErrorMsg, SubmitButton,
  NumericInputSmall, InputSuffix,
} from './CreateAuctionPage.styles';
import CardSelector from './create/CardSelector';
import AuctionRulesFields, { Category } from './create/AuctionRulesFields';

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();
  const { showSuccess } = useSnackbar();

  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);

  const [cardId, setCardId] = useState<string | ''>('');
  const [durationHours, setDurationHours] = useState<number>(24);
  const [minReputation, setMinReputation] = useState<number>(0);
  const [reputationEnabled, setReputationEnabled] = useState(false);
  const [minExchanges, setMinExchanges] = useState<number>(1);
  const [exchangesEnabled, setExchangesEnabled] = useState(false);
  const [minCardCount, setMinCardCount] = useState<number>(1);
  const [cardCountEnabled, setCardCountEnabled] = useState(false);
  const [minCategory, setMinCategory] = useState<Category>('EPICO');
  const [categoryEnabled, setCategoryEnabled] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserCollection(currentUser.id)
      .then(data => setCollection(data))
      .catch(() => setCollection([]))
      .finally(() => setLoadingCollection(false));
  }, [currentUser]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);

    if (cardId === '') {
      setError('Seleccioná una figurita.');
      return;
    }
    if (durationHours < AUCTION_DURATION_MIN || durationHours > AUCTION_DURATION_MAX) {
      setError(`La duración debe estar entre ${AUCTION_DURATION_MIN} y ${AUCTION_DURATION_MAX} horas.`);
      return;
    }

    setSubmitting(true);
    try {
      const rules = [];
      if (reputationEnabled && minReputation > 0)
        rules.push({ type: 'REPUTACION_MINIMA' as const, value: String(minReputation) });
      if (exchangesEnabled)
        rules.push({ type: 'INTERCAMBIOS_MINIMOS' as const, value: String(minExchanges) });
      if (cardCountEnabled)
        rules.push({ type: 'CANTIDAD_MINIMA_FIGURITAS' as const, value: String(minCardCount) });
      if (categoryEnabled)
        rules.push({ type: 'CATEGORIA_MINIMA' as const, value: minCategory });
      const auction = await createAuction({
        cardId: cardId as string,
        duration: durationHours,
        rules,
      });
      showSuccess(`Subasta creada para la figurita #${auction.card.number}: ${auction.card.description}`);
      navigate(`/auctions/${auction.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al crear la subasta.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/auctions')} variant="tonal" ariaLabel="Volver a subastas" />
        <Title>Nueva Subasta</Title>
      </Header>

      <Card as="form" onSubmit={handleSubmit}>
        <CardSelector
          collection={collection}
          loading={loadingCollection}
          value={cardId}
          onChange={setCardId}
        />

        <Field>
          <Label htmlFor="duracion-input">
            Duración&nbsp;
            <Hint>({AUCTION_DURATION_MIN}h mínimo — 5 días máximo)</Hint>
          </Label>
          <StarsRow>
            <NumericInputSmall
              id="duracion-input"
              type="number"
              min={AUCTION_DURATION_MIN}
              max={AUCTION_DURATION_MAX}
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              required
            />
            <InputSuffix>
              horas&nbsp;({formatDuration(durationHours)})
            </InputSuffix>
          </StarsRow>
        </Field>

        <AuctionRulesFields
          reputationEnabled={reputationEnabled}
          setReputationEnabled={setReputationEnabled}
          minReputation={minReputation}
          setMinReputation={setMinReputation}
          exchangesEnabled={exchangesEnabled}
          setExchangesEnabled={setExchangesEnabled}
          minExchanges={minExchanges}
          setMinExchanges={setMinExchanges}
          cardCountEnabled={cardCountEnabled}
          setCardCountEnabled={setCardCountEnabled}
          minCardCount={minCardCount}
          setMinCardCount={setMinCardCount}
          categoryEnabled={categoryEnabled}
          setCategoryEnabled={setCategoryEnabled}
          minCategory={minCategory}
          setMinCategory={setMinCategory}
        />

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <SubmitButton type="submit" disabled={submitting || cardId === ''}>
          {submitting ? 'Creando...' : 'Crear Subasta'}
        </SubmitButton>
      </Card>
    </PageContainer>
  );
}
