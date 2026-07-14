import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="not-found">
      <h2>Page not found</h2>
      <p>The page you requested is not available in Bridge360.</p>
      <Link to="/">Return to home</Link>
    </section>
  );
}
