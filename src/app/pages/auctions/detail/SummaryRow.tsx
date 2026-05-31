import { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

// Si este patrón aparece en CreateAuction / PublicationDetail, promover a common/.
export default function SummaryRow({ label, children }: Props) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="value">{children}</div>
    </div>
  );
}
