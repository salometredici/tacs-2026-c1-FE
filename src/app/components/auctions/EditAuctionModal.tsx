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

  const [reputacionActiva, setReputacionActiva] = useState(!!repRule);
  const [reputacionMinima, setReputacionMinima] = useState(repRule ? Number(repRule.value) : 0);
  const [intercambiosActivo, setIntercambiosActivo] = useState(!!intRule);
  const [intercambiosMinimos, setIntercambiosMinimos] = useState(intRule ? Number(intRule.value) : 1);
  const [cantMinActivo, setCantMinActivo] = useState(!!cantRule);
  const [cantMinFiguritas, setCantMinFiguritas] = useState(cantRule ? Number(cantRule.value) : 1);
  const [categoriaActiva, setCategoriaActiva] = useState(!!catRule);
  const [categoriaMinima, setCategoriaMinima] = useState<'COMUN' | 'EPICO' | 'LEGENDARIO'>(
    catRule ? (catRule.value as 'COMUN' | 'EPICO' | 'LEGENDARIO') : 'EPICO'
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const rules: AuctionRule[] = [];
      if (reputacionActiva && reputacionMinima > 0)
        rules.push({ type: 'REPUTACION_MINIMA', value: String(reputacionMinima) });
      if (intercambiosActivo)
        rules.push({ type: 'INTERCAMBIOS_MINIMOS', value: String(intercambiosMinimos) });
      if (cantMinActivo)
        rules.push({ type: 'CANTIDAD_MINIMA_FIGURITAS', value: String(cantMinFiguritas) });
      if (categoriaActiva)
        rules.push({ type: 'CATEGORIA_MINIMA', value: categoriaMinima });

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
            <input type="checkbox" checked={reputacionActiva}
              onChange={e => setReputacionActiva(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Reputación mínima
          </Label>
          {reputacionActiva && (
            <>
              <Hint>Solo pueden ofertar usuarios con este rating o superior</Hint>
              <StarsRow>
                {[1, 2, 3, 4, 5].map(star => (
                  <StarButton key={star} type="button" $active={star <= reputacionMinima}
                    onClick={() => setReputacionMinima(star === reputacionMinima ? star - 1 : star)}>
                    ★
                  </StarButton>
                ))}
                <StarLabel>{reputacionMinima === 0 ? 'Sin restricción' : `${reputacionMinima} / 5`}</StarLabel>
              </StarsRow>
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={intercambiosActivo}
              onChange={e => setIntercambiosActivo(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Intercambios mínimos
          </Label>
          {intercambiosActivo && (
            <>
              <Hint>El postor debe tener al menos N intercambios concretados</Hint>
              <Input type="number" min={1} value={intercambiosMinimos}
                onChange={e => setIntercambiosMinimos(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }} />
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={cantMinActivo}
              onChange={e => setCantMinActivo(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Cantidad mínima de figuritas en oferta
          </Label>
          {cantMinActivo && (
            <>
              <Hint>La oferta debe incluir al menos N figuritas</Hint>
              <Input type="number" min={1} value={cantMinFiguritas}
                onChange={e => setCantMinFiguritas(Math.max(1, Number(e.target.value)))}
                style={{ width: '100px' }} />
            </>
          )}
        </Field>

        <Field>
          <Label>
            <input type="checkbox" checked={categoriaActiva}
              onChange={e => setCategoriaActiva(e.target.checked)}
              style={{ marginRight: '0.5rem' }} />
            Categoría mínima de figuritas ofrecidas
          </Label>
          {categoriaActiva && (
            <>
              <Hint>Las figuritas ofrecidas deben ser de esta categoría o superior</Hint>
              <Select value={categoriaMinima}
                onChange={e => setCategoriaMinima(e.target.value as 'COMUN' | 'EPICO' | 'LEGENDARIO')}>
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
