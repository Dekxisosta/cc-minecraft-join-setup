import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import WindowsPage from "./pages/WindowsPage.jsx";
import MacLinuxPage from "./pages/MacLinuxPage.jsx";
import NotFound from "./pages/NotFound.jsx";

// New page = start at the top. A hash link (#setup) is left to the browser.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/windows" element={<WindowsPage />} />
        <Route path="/macos-linux" element={<MacLinuxPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
