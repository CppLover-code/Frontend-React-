import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Books from "./pages/Books";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import BookPage from "./pages/BookPage";
import EditBook from "./pages/EditBook";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import Notification from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

// Компонент — это обычная JavaScript-функция, которая возвращает JSX.
// App - это компонент.
function App() {

  return (
    <>
      <Notification />

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<HomePage />} />

          <Route path="/books" element={<Books />} />

          <Route path="/books/:id" element={<BookPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute staffOnly={true} />}>
            <Route path="/books/:id/edit" element={<EditBook />} />
          </Route>

          <Route path="/about" element={<AboutPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

        </Route>

      </Routes>
    </>

  );
}

export default App;
