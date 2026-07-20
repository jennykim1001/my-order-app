import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/OrderPage";
import AuthPage from "./pages/AuthPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/my" element={<MyOrdersPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
