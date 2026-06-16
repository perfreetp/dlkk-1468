import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import DeclarationPath from "@/pages/DeclarationPath";
import Materials from "@/pages/Materials";
import ProjectOverview from "@/pages/ProjectOverview";
import Attachments from "@/pages/Attachments";
import Correction from "@/pages/Correction";
import QaCenter from "@/pages/QaCenter";
import Favorites from "@/pages/Favorites";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/declaration-path" element={<DeclarationPath />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/project-overview" element={<ProjectOverview />} />
          <Route path="/attachments" element={<Attachments />} />
          <Route path="/correction" element={<Correction />} />
          <Route path="/qa" element={<QaCenter />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
}
