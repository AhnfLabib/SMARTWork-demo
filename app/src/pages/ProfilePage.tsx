import { useParams } from "react-router-dom";
import PersonContextBar from "../components/PersonContextBar";
import ProfileHero from "../components/ProfileHero";
import ProfileTabs from "../components/ProfileTabs";
import NotFound from "../components/NotFound";
import { getRoleById } from "../data";
import { getCapacityProfile } from "../lib/capacity";
import "../styles/profile.css";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const role = id ? getRoleById(id) : undefined;

  if (!role) {
    return <NotFound />;
  }

  const capacity = getCapacityProfile(role.id);

  return (
    <article className="profile-page">
      <PersonContextBar role={role} />
      <div className="profile-card">
        <ProfileHero role={role} capacity={capacity} />
        <ProfileTabs role={role} capacity={capacity} />
      </div>
    </article>
  );
}
