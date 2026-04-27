import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CollectionCard } from '../../interfaces/cards/CollectionCard';
import { getUserCollection } from '../../api/UsersService';
import { createAuction } from '../../api/AuctionsService';
import { theme } from '../../styles/theme';
import { AUCTION_DURATION_MIN, AUCTION_DURATION_MAX } from '../../constants/auctions';
import { formatDuration } from '../../utils/utils';
import { PageContainer, Header, BackButton, Title, Card, Field, Label, Hint, Select,
  Input, StarsRow, StarButton, StarLabel, ErrorMsg, SubmitButton } from './CreateAuctionPage.styles';

// ─── Constantes ─────────────────────────────────────────────────────────────

const CURRENT_USER_ID = '69e54c037de7f7e868da90f4'; // Para reemplazar por el usuario autenticado cuando esté la llamada disponible en backend

// ─── Componente ─────────────────────────────────────────────────────────────

export default function CreateAuctionPage() {
  const navigate = useNavigate();

  const [collection, setCollection] = useState<CollectionCard[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);

  const [cardId, setCardId] = useState<number | ''>('');
  const [duracionHoras, setDuracionHoras] = useState<number>(24);
  const [reputacionMinima, setReputacionMinima] = useState<number>(0);
  const [reputacionActiva, setReputacionActiva] = useState(false);
  const [intercambiosMinimos, setIntercambiosMinimos] = useState<number>(1);
  const [intercambiosActivo, setIntercambiosActivo] = useState(false);
  const [cantMinFiguritas, setCantMinFiguritas] = useState<number>(1);
  const [cantMinActivo, setCantMinActivo] = useState(false);
  const [categoriaMinima, setCategoriaMinima] = useState<'COMUN' | 'EPICO' | 'LEGENDARIO'>('EPICO');
  const [categoriaActiva, setCategoriaActiva] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserCollection(CURRENT_USER_ID)
      .then(data => setCollection(data))
      .catch(() => setCollection([]))
      .finally(() => setLoadingCollection(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cardId === '') {
      setError('Seleccioná una figurita.');
      return;
    }
    if (duracionHoras < AUCTION_DURATION_MIN || duracionHoras > AUCTION_DURATION_MAX) {
      setError(`La duración debe estar entre ${AUCTION_DURATION_MIN} y ${AUCTION_DURATION_MAX} horas.`);
      return;
    }

    setSubmitting(true);
    try {
      const reglas = [];
      if (reputacionActiva && reputacionMinima > 0)
        reglas.push({ type: 'REPUTACION_MINIMA' as const, value: String(reputacionMinima) });
      if (intercambiosActivo)
        reglas.push({ type: 'INTERCAMBIOS_MINIMOS' as const, value: String(intercambiosMinimos) });
      if (cantMinActivo)
        reglas.push({ type: 'CANTIDAD_MINIMA_FIGURITAS' as const, value: String(cantMinFiguritas) });
      if (categoriaActiva)
        reglas.push({ type: 'CATEGORIA_MINIMA' as const, value: categoriaMinima });
      await createAuction({
        cardId: cardId as number,
        publisherId: CURRENT_USER_ID,
        duration: duracionHoras,
        rules: reglas,
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
        <BackButton onClick={() => navigate('/auctions')} title="Volver">←</BackButton>
        <Title>Nueva Subasta</Title>
      </Header>

      <Card as="form" onSubmit={handleSubmit}>
        {/* Figurita */}
        <Field>
          <Label htmlFor="figurita-select">Figurita a subastar</Label>
          {loadingCollection ? (
            <Hint>Cargando colección...</Hint>
          ) : collection.length === 0 ? (
            <Hint>No tenés figuritas en tu colección</Hint>
          ) : (
            <Select
              id="figurita-select"
              value={cardId}
              onChange={e => setCardId(Number(e.target.value))}
              required
            >
              <option value="">— Seleccioná una figurita —</option>
              {collection.map(fc => (
                <option key={fc.cardId} value={fc.number}>
                  #{fc.number} · {fc.description} ({fc.country}) · {fc.category}
                  {fc.quantity > 1 ? ` ×${fc.quantity}` : ''}
                </option>
              ))}
            </Select>
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
              value={duracionHoras}
              onChange={e => setDuracionHoras(Number(e.target.value))}
              style={{ width: '100px' }}
              required
            />
            <span style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
              horas&nbsp;({formatDuration(duracionHoras)})
            </span>
          </StarsRow>
        </Field>

        {/* Reputación mínima */}
        <Field>
          <Label>
            <input
              type="checkbox"
              checked={reputacionActiva}
              onChange={e => setReputacionActiva(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Reputación mínima
          </Label>
          {reputacionActiva && (
            <>
              <Hint>Solo podrán ofertar usuarios con este rating o superior</Hint>
              <StarsRow>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton
                    key={star}
                    type="button"
                    $active={star <= reputacionMinima}
                    onClick={() => setReputacionMinima(star === reputacionMinima ? star - 1 : star)}
                    title={`${star} estrella${star !== 1 ? 's' : ''}`}
                  >
                    ★
                  </StarButton>
                ))}
                <StarLabel>
                  {reputacionMinima === 0 ? 'Sin restricción' : `${reputacionMinima} / 5`}
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
              checked={intercambiosActivo}
              onChange={e => setIntercambiosActivo(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Intercambios mínimos
          </Label>
          {intercambiosActivo && (
            <>
              <Hint>El postor debe tener al menos N intercambios concretados</Hint>
              <Input
                type="number"
                min={1}
                value={intercambiosMinimos}
                onChange={e => setIntercambiosMinimos(Math.max(1, Number(e.target.value)))}
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
              checked={cantMinActivo}
              onChange={e => setCantMinActivo(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Cantidad mínima de figuritas en oferta
          </Label>
          {cantMinActivo && (
            <>
              <Hint>La oferta debe incluir al menos N figuritas</Hint>
              <Input
                type="number"
                min={1}
                value={cantMinFiguritas}
                onChange={e => setCantMinFiguritas(Math.max(1, Number(e.target.value)))}
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
              checked={categoriaActiva}
              onChange={e => setCategoriaActiva(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Categoría mínima de figuritas ofrecidas
          </Label>
          {categoriaActiva && (
            <>
              <Hint>Las figuritas ofrecidas deben ser de esta categoría o superior</Hint>
              <Select
                value={categoriaMinima}
                onChange={e => setCategoriaMinima(e.target.value as 'COMUN' | 'EPICO' | 'LEGENDARIO')}
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
