import type { ReactNode } from "react";

type DataTableProps = {
  headers: string[];
  rows: string[][];
  className?: string;
  caption?: string;
};

export default function DataTable({
  headers,
  rows,
  className = "",
  caption,
}: DataTableProps) {
  return (
    <div className={`table-wrap${className ? ` ${className}` : ""}`}>
      <table className="data-table">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${rowIndex}-${cellIndex}`}>
                  {cellIndex === 0 ? <strong>{cell}</strong> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="profile-section">
      <h3>{title}</h3>
      <div className="section-content">{children}</div>
    </section>
  );
}
