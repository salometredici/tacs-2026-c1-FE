import { useState } from 'react';
import { Auction } from '../../interfaces/auctions/Auction';
import { AuctionRule } from '../../interfaces/auctions/auctionRule/AuctionRule';
import { updateAuction } from '../../api/AuctionsService';
import { theme } from '../../styles/theme';
import {
  ConfirmOverlay,
  ConfirmModal,
  ConfirmTitle,
  ConfirmFooter,
  CancelBtn,
  ConfirmBtn,
} from '../../pages/auctions/AuctionDetailPage.styles';
import {
  Field,
  Label,
  Hint,
  Input,
  Select,
  StarsRow,
  StarButton,
  StarLabel,
  ErrorMsg,
} from '../../pages/auctions/CreateAuctionPage.styles';

interface Props {
  auction: Auction;
  onClose: () => void;
  onSuccess: (updated: Auction) => void;
}

export default function EditAuctionModal({ auction, onClose, onSuccess }: Props) {
  const findRule = (type: string) => auction.rules.find(r => r.type === type);

  const repRule = findRule('REPUTACION_MINIMA');
  const intRule = findRule('INTERCAMBIOS_MINIMOS');
  const cantRule = findRule('CANTIDAD_MINIMA_FIGURITAS');
  const catRule = findRule('CATEGORIA_MINIMA');

  const [reputationEnabled, setReputationEnabled] = useState(!!repRule);
  const [minReputation, setMinReputation] = useState(repRule ? Number(repRule.value) : 0);
  const [exchangesEnabled, setExchangesEnabled] = useState(!!intRule);
  const [minExchanges, setMinExchanges] = useState(intRule ? Number(intRule.value) : 1);
  const [cardCountEnabled, setCardCountEnabled] = useState(!!cantRule);
  const [minCardCount, setMinCardCount] = useState(cantRule ? Number(cantRule.value) : 1);
  const [categoryEnabled, setCategoryEnabled] = useState(!!catRule);
  const [minCategory, setMinCategory] = useState<'COMUN' | 'EPICO' | 'LEGENDARIO'>(
    catRule ? (catRule.value as 'COMUN' | 'EPICO' | 'LEGENDARIO') : 'EPICO'
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const rules: AuctionRule[] = [];
      if (reputationEnabled && minReputation > 0)
        rules.push({ type: 'REPUTACION_MINIMA', value: String(minReputation) });
      if (exchangesEnabled)
        rules.push({ type: 'INTERCAMBIOS_MINIMOS', value: String(minExchanges) });
      if (cardCountEnabled)
        rules.push({ type: 'CANTIDAD_MINIMA_FIGURITAS', value: String(minCardCount) });
      if (categoryEnabled)
        rules.push({ type: 'CATEGORIA_MINIMA', value: minCategory });

      await updateAuction(auction.id, { rules });
      onSuccess({ ...auction, rules });
    } catch {
      setError('Error al guardar los cambios. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ConfirmOverlay>
      <ConfirmModal style={{ maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <ConfirmTitle>Editar condiciones de participación</ConfirmTitle>

        <Field>
          <Label>
            <input type="checkbox" checked={reputationEnabled}
              onChange={e => setReputationEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Reputación mínima
          </Label>
          {reputationEnabled && (
            <>
              <Hint>Solo pueden ofertar usuarios con este rating o superior</Hint>
              <StarsRow>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton key={star} type="button" $active={star <= minReputation}
                    onClick={() => setMinReputation(star === minReputation ? star - 1 : star)}>
                    ★
                  </StarButton>
                ))}
                <StarLabel>{minReputation === 0 ? 'Sin restricción' : `${minReputation} / 5`}</StarLabel>
              </StarsRow>
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={exchangesEnabled}
              onChange={e => setExchangesEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Intercambios mínimos
          </Label>
          {exchangesEnabled && (
            <>
              <Hint>El postor debe tener al menos N intercambios concretados</Hint>
              <Input type="number" min={1} value={minExchanges}
                onChange={e => setMinExchanges(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }} />
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={cardCountEnabled}
              onChange={e => setCardCountEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Cantidad mínima de figuritas en oferta
          </Label>
          {cardCountEnabled && (
            <>
              <Hint>La oferta debe incluir al menos N figuritas</Hint>
              <Input type="number" min={1} value={minCardCount}
                onChange={e => setMinCardCount(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }} />
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={categoryEnabled}
              onChange={e => setCategoryEnabled(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Categoría mínima de figuritas ofrecidas
          </Label>
          {categoryEnabled && (
            <>
              <Hint>Las figuritas ofrecidas deben ser de esta categoría o superior</Hint>
              <Select value={minCategory}
                onChange={e => setMinCategory(e.target.value as 'COMUN' | 'EPICO' | 'LEGENDARIO')}>
                <option value="COMUN">COMÚN</option>
                <option value="EPICO">ÉPICO</option>
                <option value="LEGENDARIO">LEGENDARIO</option>
              </Select>
            </>
          )}
        </Field>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <ConfirmFooter>
          <CancelBtn onClick={onClose} disabled={saving}>Cancelar</CancelBtn>
          <ConfirmBtn onClick={handleSave} disabled={saving}
            style={{ background: theme.colors.primary }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </ConfirmBtn>
        </ConfirmFooter>
      </ConfirmModal>
    </ConfirmOverlay>
  );
}
