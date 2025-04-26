import { Route, Routes } from "react-router-dom";
import "./App.css";
import DecksPage from "./pages/decks/page";
import LoginPage from "./pages/login/page";
import NotFoundPage from "./pages/not-found/page";
import SignupPage from "./pages/signup/page";
import DeckPage from "./pages/deck/page";
import ReviewPage from "./pages/review/page";
import ProfilePage from "./pages/profile/page";
import ProtectedRoute from "./components/protected-route";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <DecksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="decks"
          element={
            <ProtectedRoute>
              <DecksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="decks/:id"
          element={
            <ProtectedRoute>
              <DeckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="review"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
