import { HashRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/person/:id" element={<ProfilePage />} />
          <Route path="/person/:id/development" element={<p>Development</p>} />
          <Route path="/person/:id/review" element={<p>Review</p>} />
          <Route path="/person/:id/review/manager" element={<p>Manager</p>} />
          <Route path="/person/:id/review/employee" element={<p>Employee</p>} />
          <Route path="/person/:id/review/combine" element={<p>Combine</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
