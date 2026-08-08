import { useEffect } from "react";

/**
 * Netlify serves the crawlable public homepage from /home.html via a rewrite.
 * This component is only reached when an in-app route navigates back to "/";
 * a document navigation lets Netlify apply that rewrite consistently.
 */
export default function Home() {
  useEffect(() => {
    window.location.replace("/home.html");
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#111111",
        color: "#f9f5ee",
        fontFamily: "Georgia, serif",
      }}
    >
      <a href="/home.html" style={{ color: "#c9a84c" }}>
        Enter The Hair Care King studio
      </a>
    </main>
  );
}
