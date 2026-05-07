import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("dashboard");

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

  return (
    <Dashboard
      users={users}
      currentUser={user}
      onLogout={handleLogout}
      onProfileClick={() => setPage("profile")}
    />
  );
}

export default App;