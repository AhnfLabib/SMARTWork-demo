import { HashRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import NotFound from "./components/NotFound";
import HomePage from "./pages/HomePage";
import DevelopmentPage from "./pages/DevelopmentPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewLaunchPage from "./pages/ReviewLaunchPage";
import PrivateResponsePage from "./pages/PrivateResponsePage";
import ReviewCombinePage from "./pages/ReviewCombinePage";

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/person/:id" element={<ProfilePage />} />
          <Route path="/person/:id/development" element={<DevelopmentPage />} />
          <Route path="/person/:id/review" element={<ReviewLaunchPage />} />
          <Route
            path="/person/:id/review/manager"
            element={<PrivateResponsePage audience="manager" />}
          />
          <Route
            path="/person/:id/review/employee"
            element={<PrivateResponsePage audience="employee" />}
          />
          <Route path="/person/:id/review/combine" element={<ReviewCombinePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
