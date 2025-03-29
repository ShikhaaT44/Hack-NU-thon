import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import UserRegistration from "./pages/UserRegistration";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/register-user" element={<UserRegistration />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
