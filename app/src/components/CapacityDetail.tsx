import type { CapacityProfile } from "../types/capacity";
import type { Role } from "../types/role";
import {
  CAPACITY_CATEGORY_ORDER,
  capacityCategoryClass,
  capacityTotals,
  formatDate,
  groupedAllocations,
} from "../lib/capacity";

type CapacityDetailProps = {
  role: Role;
  capacity: CapacityProfile;
  compact?: boolean;
};

export default function CapacityDetail({
  role,
  capacity,
  compact = false,
}: CapacityDetailProps) {
  const totals = capacityTotals(capacity);
  const groups = groupedAllocations(capacity);
  const displayGroups = CAPACITY_CATEGORY_ORDER.filter(
    (category) => groups[category]?.length,
  );
  const categoryLabels = displayGroups.map((category) => ({
    category,
    percent: totals[category] || 0,
    className: capacityCategoryClass(category),
  }));

  return (
    <div className={`capacity-card${compact ? " compact" : ""}`}>
      <div className="capacity-card-header">
        <div>
          <span className="card-label">Current Assignment Clarity</span>
          <h3>{role.person}</h3>
          <p>{capacity.basis}</p>
        </div>
        <div
          className={`capacity-total${totals.total === 100 ? " complete" : " partial"}`}
        >
          <strong>{totals.total}%</strong>
          <span>Total planned capacity</span>
        </div>
      </div>

      <div className="capacity-meta-grid">
        <div>
          <span>Effective date</span>
          <strong>{formatDate(capacity.effectiveDate)}</strong>
        </div>
        {categoryLabels.map((item) => (
          <div key={item.category}>
            <span>{item.category} work</span>
            <strong>{item.percent}%</strong>
          </div>
        ))}
      </div>

      <div className="capacity-stacked-bar" aria-label="Capacity allocation bar">
        {categoryLabels.map((item) => (
          <span
            key={item.category}
            className={item.className}
            style={{ width: `${item.percent}%` }}
          >
            {item.category} {item.percent}%
          </span>
        ))}
      </div>

      <div className="capacity-group-grid">
        {displayGroups.map((category) => (
          <section
            key={category}
            className={`capacity-group ${capacityCategoryClass(category)}`}
          >
            <div className="capacity-group-title">
              <h4>{category} Work</h4>
              <strong>{totals[category]}%</strong>
            </div>
            <div className="allocation-list">
              {groups[category].map((item) => (
                <div key={`${category}-${item.name}`} className="allocation-row">
                  <span>{item.name}</span>
                  <strong>{item.percent}%</strong>
                  <div className="allocation-meter">
                    <span style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
