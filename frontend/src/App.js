import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";
import Welcome from "./Welcome";
import Settings from "./Settings";
import UploadResearch from "./UploadResearch";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("welcome");
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) return;
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8001";
    fetch(`${apiUrl}/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setPage("welcome");
    setSelectedExperiment(null);
  };

  const handleStartSearching = () => {
    setSelectedExperiment(null);
    setPage("dashboard");
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (page === "settings" && !user.guest) {
    return (
      <Settings
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setPage("profile")}
        theme={theme}
        onThemeChange={setTheme}
      />
    );
  }

  if (page === "profile" && !user.guest) {
    return (
      <Profile
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setPage("dashboard")}
        onSettingsClick={() => setPage("settings")}
        onUploadClick={() => setPage("upload")}
      />
    );
  }

  if (page === "upload" && !user.guest) {
    return (
      <UploadResearch
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setPage("dashboard")}
        onSuccess={() => setPage("profile")}
      />
    );
  }

  if (page === "welcome") {
    return (
      <Welcome
        currentUser={user}
        onLogout={handleLogout}
        onProfileClick={() => setPage("profile")}
        onStartSearching={handleStartSearching}
        onUploadClick={() => setPage("upload")}
      />
    );
  }

  return (
    <Dashboard
      experiment={selectedExperiment}
      currentUser={user}
      onLogout={handleLogout}
      onProfileClick={() => setPage("profile")}
      onBack={() => setPage("welcome")}
      onUploadClick={() => setPage("upload")}
    />
  );
}

export default App;