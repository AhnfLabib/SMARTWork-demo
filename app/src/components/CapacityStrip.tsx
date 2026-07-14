import type { CapacityProfile } from "../types/capacity";
import { capacityTotals, formatDate } from "../lib/capacity";

type CapacityStripProps = {
  capacity: CapacityProfile;
};

export default function CapacityStrip({ capacity }: CapacityStripProps) {
  const totals = capacityTotals(capacity);

  return (
    <div className="capacity-hero-strip" aria-label="Capacity allocation summary">
      <span>
        <strong>Capacity effective</strong> {formatDate(capacity.effectiveDate)}
      </span>
      <span>
        <strong>Project</strong> {totals.Project || 0}%
      </span>
      <span>
        <strong>Product</strong> {totals.Product || 0}%
      </span>
      <span>
        <strong>Internal</strong> {totals.Internal || 0}%
      </span>
    </div>
  );
}
