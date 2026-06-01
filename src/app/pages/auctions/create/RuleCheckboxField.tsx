import { ReactNode } from 'react';
import { Field, Label, Hint } from '../CreateAuctionPage.styles';

interface Props {
  label: string;
  hint: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: ReactNode;
}

// Helper local: checkbox + label + (hint + control) cuando está habilitado.
// Si este patrón aparece en otro form, promover a common/.
export default function RuleCheckboxField({ label, hint, enabled, onToggle, children }: Props) {
  return (
    <Field>
      <Label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onToggle(e.target.checked)}
        />
        {label}
      </Label>
      {enabled && (
        <>
          <Hint>{hint}</Hint>
          {children}
        </>
      )}
    </Field>
  );
}
