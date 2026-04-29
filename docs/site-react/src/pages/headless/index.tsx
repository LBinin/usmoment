import React from "react";

const headlessComponents = [
  "createExpressionEngine",
  "createSelectionState",
];

export function HeadlessPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Headless</p>
      <h2>Capability primitives</h2>
      <div className="card">
        <ul className="flat-list">
          {headlessComponents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
