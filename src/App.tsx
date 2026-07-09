import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Problems from "@/pages/Problems";
import ProblemDetail from "@/pages/ProblemDetail";
import Profile from "@/pages/Profile";
import Exam from "@/pages/Exam";
import Navbar from "@/components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetail />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
