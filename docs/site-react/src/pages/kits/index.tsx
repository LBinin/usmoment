import React from "react";

const kits = ["AccountingCalcKit"];

export function KitsPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Kits</p>
      <h2>Scene-level kits</h2>
      <div className="card">
        <ul className="flat-list">
          {kits.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
