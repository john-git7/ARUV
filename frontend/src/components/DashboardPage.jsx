import { useParams, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const DashboardPage = () => {
  const { role } = useParams(); // role comes from URL

  if (!role || (role !== "farmer" && role !== "consumer")) {
    return <Navigate to="/" />; // invalid role redirects to signup
  }

  return <Dashboard role={role} />;
};

export default DashboardPage;
