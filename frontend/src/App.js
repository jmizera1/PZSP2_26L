import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";
import Welcome from "./Welcome";
import Settings from "./Settings";
import UploadResearch from "./UploadResearch";
import SearchExperiments from "./SearchExperiments";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("welcome");
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  const handleLogout = () => {
    setUser(null);
    setPage("welcome");
    setSelectedExperiment(null);
  };

  const handleStartSearching = () => {
    setSelectedExperiment(null);
    setPage("search");
  };

  const handleExperimentClick = (exp) => {
    setSelectedExperiment(exp);
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
        onBack={() => setPage("search")}
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
        onBack={() => setPage("search")}
        onSuccess={() => setPage("search")}
      />
    );
  }

  if (page === "search") {
    return (
      <SearchExperiments
        currentUser={user}
        onLogout={handleLogout}
        onProfileClick={() => setPage("profile")}
        onBack={() => setPage("welcome")}
        onUploadClick={() => setPage("upload")}
        onExperimentClick={handleExperimentClick}
      />
    );
  }

  if (page === "dashboard" && selectedExperiment) {
    return (
      <Dashboard
        experiment={selectedExperiment}
        currentUser={user}
        onLogout={handleLogout}
        onProfileClick={() => setPage("profile")}
        onBack={() => setPage("search")}
        onUploadClick={() => setPage("upload")}
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

  // Fallback to welcome
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

export default App;