import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { createAuction } from '../../api/AuctionsService';
import { AuthedOutletContext } from '../../components/layout/UserRoute';
import { theme } from '../../styles/theme';
import { AUCTION_DURATION_MIN, AUCTION_DURATION_MAX } from '../../constants/auctions';
import { formatDuration } from '../../utils/utils';
import {
  PageContainer, Header, BackButton, Title, Card, Field, Label, Hint, Select,
  Input, StarsRow, StarButton, StarLabel, ErrorMsg, SubmitButton,
  SelectableItem, SelectIndicator,
} from './CreateAuctionPage.styles';
import {
  SearchInput, CardList, CardNum, CardDescription, CardQuantityLabel, EmptyItem,
} from '../../components/proposals/MakeProposalModal.styles';

// ─── Componente ─────────────────────────────────────────────────────────────

export default function CreateAuctionPage() {
  const navigate = useNavigate();
  const { currentUser } = useOutletContext<AuthedOutletContext>();

  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [cardId, setCardId] = useState<string | ''>('');
  const [durationHours, setDurationHours] = useState<number>(24);
  const [minReputation, setMinReputation] = useState<number>(0);
  const [reputationEnabled, setReputationEnabled] = useState(false);
  const [minExchanges, setMinExchanges] = useState<number>(1);
  const [exchangesEnabled, setExchangesEnabled] = useState(false);
  const [minCardCount, setMinCardCount] = useState<number>(1);
  const [cardCountEnabled, setCardCountEnabled] = useState(false);
  const [minCategory, setMinCategory] = useState<'COMUN' | 'EPICO' | 'LEGENDARIO'>('EPICO');
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
      await createAuction({
        cardId: cardId as string,
        duration: durationHours,
        rules,
      });
      navigate('/auctions');
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
        <BackButton onClick={() => navigate('/auctions')} aria-label="Volver a subastas">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
        </BackButton>
        <Title>Nueva Subasta</Title>
      </Header>

      <Card as="form" onSubmit={handleSubmit}>
        {/* Figurita */}
        <Field>
          <Label>Figurita a subastar</Label>
          {loadingCollection ? (
            <Hint>Cargando colección...</Hint>
          ) : collection.length === 0 ? (
            <Hint>No tenés figuritas en tu colección</Hint>
          ) : (
            <>
              <SearchInput
                placeholder="Buscar por descripción o número..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <CardList>
                {collection
                  .filter(fc => fc.quantity - fc.compromisedCount > 0)
                  .filter(fc =>
                    fc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(fc.number).includes(searchQuery)
                  )
                  .map(fc => {
                    const isSelected = cardId === fc.cardId;
                    const available = fc.quantity - fc.compromisedCount;
                    return (
                      <SelectableItem
                        key={fc.cardId}
                        $selected={isSelected}
                        onClick={() => setCardId(fc.cardId)}
                      >
                        <SelectIndicator $selected={isSelected}>
                          <span className="material-symbols-outlined" aria-hidden="true">
                            {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                        </SelectIndicator>
                        <CardNum>#{fc.number}</CardNum>
                        <CardDescription>{fc.description}</CardDescription>
                        <CardQuantityLabel>{available} disp. / {fc.quantity} tot.</CardQuantityLabel>
                      </SelectableItem>
                    );
                  })
                }
                {collection.filter(fc =>
                  fc.quantity - fc.compromisedCount > 0 && (
                    fc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    String(fc.number).includes(searchQuery)
                  )
                ).length === 0 && (
                  <EmptyItem>No tenés figuritas con disponibilidad</EmptyItem>
                )}
              </CardList>
            </>
          )}
        </Field>

        {/* Duración */}
        <Field>
          <Label htmlFor="duracion-input">
            Duración&nbsp;
            <Hint>({AUCTION_DURATION_MIN}h mínimo — 5 días máximo)</Hint>
          </Label>
          <StarsRow>
            <Input
              id="duracion-input"
              type="number"
              min={AUCTION_DURATION_MIN}
              max={AUCTION_DURATION_MAX}
              value={durationHours}
              onChange={e => setDurationHours(Number(e.target.value))}
              style={{ width: '100px' }}
              required
            />
            <span style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
              horas&nbsp;({formatDuration(durationHours)})
            </span>
          </StarsRow>
        </Field>

        {/* Reputación mínima */}
        <Field>
          <Label>
            <input
              type="checkbox"
              checked={reputationEnabled}
              onChange={e => setReputationEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Reputación mínima
          </Label>
          {reputationEnabled && (
            <>
              <Hint>Solo podrán ofertar usuarios con este rating o superior</Hint>
              <StarsRow>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton
                    key={star}
                    type="button"
                    $active={star <= minReputation}
                    onClick={() => setMinReputation(star === minReputation ? star - 1 : star)}
                    title={`${star} estrella${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </StarButton>
                ))}
                <StarLabel>
                  {minReputation === 0 ? 'Sin restricción' : `${minReputation} / 5`}
                </StarLabel>
              </StarsRow>
            </>
          )}
        </Field>

        {/* Intercambios mínimos */}
        <Field>
          <Label>
            <input
              type="checkbox"
              checked={exchangesEnabled}
              onChange={e => setExchangesEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Intercambios mínimos
          </Label>
          {exchangesEnabled && (
            <>
              <Hint>El postor debe tener al menos N intercambios concretados</Hint>
              <Input
                type="number"
                min={1}
                value={minExchanges}
                onChange={e => setMinExchanges(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }}
              />
            </>
          )}
        </Field>

        {/* Cantidad mínima de figuritas */}
        <Field>
          <Label>
            <input
              type="checkbox"
              checked={cardCountEnabled}
              onChange={e => setCardCountEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Cantidad mínima de figuritas en oferta
          </Label>
          {cardCountEnabled && (
            <>
              <Hint>La oferta debe incluir al menos N figuritas</Hint>
              <Input
                type="number"
                min={1}
                value={minCardCount}
                onChange={e => setMinCardCount(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }}
              />
            </>
          )}
        </Field>

        {/* Categoría mínima */}
        <Field>
          <Label>
            <input
              type="checkbox"
              checked={categoryEnabled}
              onChange={e => setCategoryEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Categoría mínima de figuritas ofrecidas
          </Label>
          {categoryEnabled && (
            <>
              <Hint>Las figuritas ofrecidas deben ser de esta categoría o superior</Hint>
              <Select
                value={minCategory}
                onChange={e => setMinCategory(e.target.value as 'COMUN' | 'EPICO' | 'LEGENDARIO')}
              >
                <option value="COMUN">COMÚN</option>
                <option value="EPICO">ÉPICO</option>
                <option value="LEGENDARIO">LEGENDARIO</option>
              </Select>
            </>
          )}
        </Field>

        {/* Error */}
        {error && <ErrorMsg>{error}</ErrorMsg>}

        {/* Submit */}
        <SubmitButton type="submit" disabled={submitting || cardId === ''}>
          {submitting ? 'Creando...' : 'Crear Subasta'}
        </SubmitButton>
      </Card>
    </PageContainer>
  );
}
