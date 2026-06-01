import RatingStars from '../../../components/common/RatingStars';
import { Select, NumericInputSmall } from '../CreateAuctionPage.styles';
import RuleCheckboxField from './RuleCheckboxField';

export type Category = 'COMUN' | 'EPICO' | 'LEGENDARIO';

interface Props {
  reputationEnabled: boolean;
  setReputationEnabled: (v: boolean) => void;
  minReputation: number;
  setMinReputation: (v: number) => void;
  exchangesEnabled: boolean;
  setExchangesEnabled: (v: boolean) => void;
  minExchanges: number;
  setMinExchanges: (v: number) => void;
  cardCountEnabled: boolean;
  setCardCountEnabled: (v: boolean) => void;
  minCardCount: number;
  setMinCardCount: (v: number) => void;
  categoryEnabled: boolean;
  setCategoryEnabled: (v: boolean) => void;
  minCategory: Category;
  setMinCategory: (v: Category) => void;
}

export default function AuctionRulesFields({
  reputationEnabled, setReputationEnabled, minReputation, setMinReputation,
  exchangesEnabled, setExchangesEnabled, minExchanges, setMinExchanges,
  cardCountEnabled, setCardCountEnabled, minCardCount, setMinCardCount,
  categoryEnabled, setCategoryEnabled, minCategory, setMinCategory,
}: Props) {
  return (
    <>
      <RuleCheckboxField
        label="Reputación mínima"
        hint="Solo podrán ofertar usuarios con este rating o superior"
        enabled={reputationEnabled}
        onToggle={setReputationEnabled}
      >
        <RatingStars
          value={minReputation}
          onChange={setMinReputation}
          label={minReputation === 0 ? 'Sin restricción' : `${minReputation} / 5`}
        />
      </RuleCheckboxField>

      <RuleCheckboxField
        label="Intercambios mínimos"
        hint="El postor debe tener al menos N intercambios concretados"
        enabled={exchangesEnabled}
        onToggle={setExchangesEnabled}
      >
        <NumericInputSmall
          type="number"
          min={1}
          value={minExchanges}
          onChange={e => setMinExchanges(Math.max(1, Number(e.target.value)))}
        />
      </RuleCheckboxField>

      <RuleCheckboxField
        label="Cantidad mínima de figuritas en oferta"
        hint="La oferta debe incluir al menos N figuritas"
        enabled={cardCountEnabled}
        onToggle={setCardCountEnabled}
      >
        <NumericInputSmall
          type="number"
          min={1}
          value={minCardCount}
          onChange={e => setMinCardCount(Math.max(1, Number(e.target.value)))}
        />
      </RuleCheckboxField>

      <RuleCheckboxField
        label="Categoría mínima de figuritas ofrecidas"
        hint="Las figuritas ofrecidas deben ser de esta categoría o superior"
        enabled={categoryEnabled}
        onToggle={setCategoryEnabled}
      >
        <Select
          value={minCategory}
          onChange={e => setMinCategory(e.target.value as Category)}
        >
          <option value="COMUN">COMÚN</option>
          <option value="EPICO">ÉPICO</option>
          <option value="LEGENDARIO">LEGENDARIO</option>
        </Select>
      </RuleCheckboxField>
    </>
  );
}
