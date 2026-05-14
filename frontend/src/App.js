import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";
import Welcome from "./Welcome";
import Settings from "./Settings";
import UploadResearch from "./UploadResearch";
import SearchExperiments from "./SearchExperiments";
import MyResearch from "./MyResearch";

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

useEffect(() => {
  const checkSession = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8001';
        const res = await fetch(`${apiUrl}/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser({ ...userData, token: token, guest: false });
          setPage("search");
        } else {
          localStorage.removeItem("token");
        }
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  };

  checkSession();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        onMyResearchClick={() => setPage("myresearch")}
      />
    );
  }

  if (page === "myresearch" && !user.guest) {
    return (
      <MyResearch
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setPage("profile")}
        onUploadClick={() => setPage("upload")}
        onExperimentClick={handleExperimentClick}
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