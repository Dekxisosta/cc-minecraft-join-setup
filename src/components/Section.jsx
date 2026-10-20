export default function Section({ id, title, children }) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Step({ title, children }) {
  return (
    <li>
      <h3>{title}</h3>
      {children}
    </li>
  );
}
