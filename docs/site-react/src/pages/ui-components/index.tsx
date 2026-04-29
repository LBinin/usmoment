import React from "react";

const groups = [
  {
    title: "Input",
    items: ["CalcKeyboard", "CalcDisplay"],
  },
  {
    title: "Selection",
    items: ["Placeholder"],
  },
  {
    title: "Display",
    items: ["Placeholder"],
  },
];

export function UiComponentsPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">UI Components</p>
      <h2>Browse by category</h2>
      <div className="grid">
        {groups.map((group) => (
          <article key={group.title} className="card">
            <h3>{group.title}</h3>
            <ul className="flat-list">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
