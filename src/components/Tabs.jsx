import { useEffect, useRef, useState } from "react";

// tabs: [{ id, label, content }]
// Arrow keys, Home and End move between tabs. A URL hash that matches a tab id
// (for example /windows#powershell) opens that tab.
export default function Tabs({ label, tabs }) {
  const ids = tabs.map((t) => t.id);
  const [current, setCurrent] = useState(ids[0]);
  const refs = useRef({});

  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) setCurrent(id);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  function select(id, focus) {
    setCurrent(id);
    if (focus) refs.current[id]?.focus();
  }

  function onKeyDown(e, i) {
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) {
      e.preventDefault();
      select(ids[next], true);
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[t.id] = el)}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={current === t.id}
            tabIndex={current === t.id ? 0 : -1}
            onClick={() => select(t.id, false)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={current !== t.id}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
