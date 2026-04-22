import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    fetch(`${apiUrl}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return <Dashboard users={users} />;
}

export default App;