import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";
import Welcome from "./Welcome";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("welcome");
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  useEffect(() => {
    if (!user) return;

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8001";

    fetch(`${apiUrl}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
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

  const handleSelectExperiment = (experiment) => {
    setSelectedExperiment(experiment);
    setPage("dashboard");
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  if (page === "profile" && !user.guest) {
    return (
      <Profile
        currentUser={user}
        onLogout={handleLogout}
        onBack={() => setPage("dashboard")}
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
    />
  );
}

export default App;