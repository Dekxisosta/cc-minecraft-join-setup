// Highlights the word or phrase a reader is most likely to get wrong.
// <strong> stays for button and menu labels; <Key> is for actions and constraints.
export default function Key({ children }) {
  return <mark className="key">{children}</mark>;
}
