import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiguritaColeccion } from '../../interfaces/FiguritaColeccion';
import { getUserCollection } from '../../api/UsersService';
import { createAuction } from '../../api/AuctionsService';
import { theme } from '../../styles/theme';

// ─── Estilos ────────────────────────────────────────────────────────────────

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: ${theme.colors.primary};
  padding: 0;
  line-height: 1;
  &:hover { opacity: 0.7; }
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 1.8rem;
  margin: 0;
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${theme.colors.text};
`;

const Hint = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

const Select = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Input = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  color: ${theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const StarsRow = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
  align-items: center;
`;

const StarButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 2px;
  color: ${({ $active }) => ($active ? '#f57c00' : theme.colors.border)};
  transition: color 0.15s;
  line-height: 1;
  &:hover { color: #f57c00; }
`;

const StarLabel = styled.span`
  margin-left: ${theme.spacing.sm};
  font-size: 0.9rem;
  color: ${theme.colors.textSecondary};
`;

const ErrorMsg = styled.p`
  color: ${theme.colors.danger};
  font-size: 0.9rem;
  margin: 0;
`;

const SubmitButton = styled.button`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover:not(:disabled) {
    background: #1565c0;
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }

  &:disabled {
    background: ${theme.colors.border};
    cursor: not-allowed;
  }
`;

// ─── Constantes ─────────────────────────────────────────────────────────────

const DURACION_MIN = 6;
const DURACION_MAX = 120;
const CURRENT_USER_ID = 1; // TODO: reemplazar por el usuario autenticado

// ─── Componente ─────────────────────────────────────────────────────────────

export default function CreateAuctionPage() {
  const navigate = useNavigate();

  const [collection, setCollection] = useState<FiguritaColeccion[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);

  const [figuritaId, setFiguritaId] = useState<number | ''>('');
  const [duracionHoras, setDuracionHoras] = useState<number>(24);
  const [ratingMinimo, setRatingMinimo] = useState<number>(0);

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

    if (figuritaId === '') {
      setError('Seleccioná una figurita.');
      return;
    }
    if (duracionHoras < DURACION_MIN || duracionHoras > DURACION_MAX) {
      setError(`La duración debe estar entre ${DURACION_MIN} y ${DURACION_MAX} horas.`);
      return;
    }

    setSubmitting(true);
    try {
      await createAuction({
        figuritaId: figuritaId as number,
        publicanteId: CURRENT_USER_ID,
        duracionHoras,
        ratingMinimo,
      });
      navigate('/auctions');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Error al crear la subasta.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuracion = (horas: number) => {
    if (horas < 24) return `${horas}h`;
    const dias = Math.floor(horas / 24);
    const resto = horas % 24;
    return resto > 0 ? `${dias}d ${resto}h` : `${dias}d`;
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/auctions')} title="Volver">←</BackButton>
        <Title>Nueva Subasta</Title>
      </Header>

      <Card as="form" onSubmit={handleSubmit}>
        {/* ── Figurita ── */}
        <Field>
          <Label htmlFor="figurita-select">Figurita a subastar</Label>
          {loadingCollection ? (
            <Hint>Cargando colección...</Hint>
          ) : collection.length === 0 ? (
            <Hint>No tenés figuritas en tu colección.</Hint>
          ) : (
            <Select
              id="figurita-select"
              value={figuritaId}
              onChange={e => setFiguritaId(Number(e.target.value))}
              required
            >
              <option value="">— Seleccioná una figurita —</option>
              {collection.map(fc => (
                <option key={fc.figurita.id} value={fc.figurita.id}>
                  #{fc.figurita.numero} · {fc.figurita.jugador} ({fc.figurita.seleccion}) · {fc.figurita.categoria}
                  {fc.cantidad > 1 ? ` ×${fc.cantidad}` : ''}
                </option>
              ))}
            </Select>
          )}
        </Field>

        {/* ── Duración ── */}
        <Field>
          <Label htmlFor="duracion-input">
            Duración&nbsp;
            <Hint>({DURACION_MIN}h mínimo — 5 días máximo)</Hint>
          </Label>
          <StarsRow>
            <Input
              id="duracion-input"
              type="number"
              min={DURACION_MIN}
              max={DURACION_MAX}
              value={duracionHoras}
              onChange={e => setDuracionHoras(Number(e.target.value))}
              style={{ width: '100px' }}
              required
            />
            <span style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
              horas&nbsp;({formatDuracion(duracionHoras)})
            </span>
          </StarsRow>
        </Field>

        {/* ── Rating mínimo ── */}
        <Field>
          <Label>Rating mínimo de interesados</Label>
          <Hint>Solo podrán ofertar usuarios con este rating o superior.</Hint>
          <StarsRow>
            {[1, 2, 3, 4, 5].map(star => (
              <StarButton
                key={star}
                type="button"
                $active={star <= ratingMinimo}
                onClick={() => setRatingMinimo(star === ratingMinimo ? star - 1 : star)}
                title={`${star} estrella${star !== 1 ? 's' : ''}`}
              >
                ★
              </StarButton>
            ))}
            <StarLabel>
              {ratingMinimo === 0 ? 'Sin restricción' : `${ratingMinimo} / 5`}
            </StarLabel>
          </StarsRow>
        </Field>

        {/* ── Error ── */}
        {error && <ErrorMsg>{error}</ErrorMsg>}

        {/* ── Submit ── */}
        <SubmitButton type="submit" disabled={submitting || figuritaId === ''}>
          {submitting ? 'Creando...' : 'Crear Subasta'}
        </SubmitButton>
      </Card>
    </PageContainer>
  );
}
