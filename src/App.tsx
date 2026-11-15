import AdminApp from "@/pages/AdminApp";
import NotFound from "@/pages/NotFound";
import Portfolio from "@/pages/Portfolio";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Portfolio/>} />
      <Route path="/about" element={<Portfolio/>} />
      <Route path="/challenges" element={<Portfolio/>} />
      <Route path="/contact" element={<Portfolio/>} />
      <Route path="/services/:slug" element={<Portfolio/>} />
      <Route path="/admin/*" element={<AdminApp/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  </BrowserRouter>;
}
