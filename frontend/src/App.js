import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

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

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Dashboard users={users} currentUser={user} onLogout={() => setUser(null)} />;
}

export default App;