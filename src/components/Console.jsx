import { Fragment, useEffect, useRef, useState } from "react";

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

// A command box with a Copy button. Lines that start with # render as comments.
export default function Console({ label, code, variant }) {
  const [status, setStatus] = useState("idle"); // idle | copied | failed
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function done(ok) {
    setStatus(ok ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  function copy() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).then(
        () => done(true),
        () => done(fallbackCopy(code))
      );
    } else {
      done(fallbackCopy(code));
    }
  }

  const text = { idle: "Copy", copied: "Copied", failed: "Press Ctrl+C" }[status];

  return (
    <figure className={variant ? `console ${variant}` : "console"}>
      <figcaption>
        <span>{label}</span>
        <button type="button" onClick={copy}>{text}</button>
      </figcaption>
      <pre>
        <code>
          {code.split("\n").map((line, i) => (
            <Fragment key={i}>
              {i > 0 && "\n"}
              {line.startsWith("#") ? <span className="c">{line}</span> : line}
            </Fragment>
          ))}
        </code>
      </pre>
    </figure>
  );
}
