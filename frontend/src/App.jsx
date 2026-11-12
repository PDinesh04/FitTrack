
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import ProgressHistory from "./pages/ProgressHistory";
import WorkoutTimer from "./pages/WorkoutTimer";
import WorkoutPlans from "./pages/WorkoutPlans";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import ProgressComparison from "./pages/ProgressComparison";
import Streak from "./pages/Streak";
import Badges from "./pages/Badges";
import PersonalizedDashboard from "./pages/PersonalizedDashboard";
import Nutrition from "./pages/Nutrition";
import WaterTracker from "./pages/WaterTracker";
import Recommendations from "./pages/Recommendations";
import ExternalActivities from "./pages/ExternalActivities";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import Reminders from "./pages/Reminders";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/workouts"
          element={<ProtectedRoute><Workouts /></ProtectedRoute>}
        />

        <Route
          path="/workout-timer"
          element={<ProtectedRoute><WorkoutTimer /></ProtectedRoute>}
        />

        <Route
          path="/progress"
          element={<ProtectedRoute><Progress /></ProtectedRoute>}
        />

        <Route
          path="/progress-history"
          element={<ProtectedRoute><ProgressHistory /></ProtectedRoute>}
        />

        <Route
          path="/goals"
          element={<ProtectedRoute><Goals /></ProtectedRoute>}
        />

        <Route
          path="/analytics"
          element={<ProtectedRoute><Analytics /></ProtectedRoute>}
        />

        <Route
          path="/notifications"
          element={<ProtectedRoute><Notifications /></ProtectedRoute>}
        />
        <Route
           path="/workout-plans"
           element={
            <ProtectedRoute>
            <WorkoutPlans />
            </ProtectedRoute>
          }
        />


        <Route
          path="/exercise-library"
          element={
            <ProtectedRoute>
                <ExerciseLibrary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress-comparison"
          element={
            <ProtectedRoute>
                <ProgressComparison />
            </ProtectedRoute>
          }
        />
        <Route
          path="/streak"
          element={
            <ProtectedRoute>
              <Streak />
            </ProtectedRoute>
          }
        />

        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <Badges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personalized-dashboard"
          element={
            <ProtectedRoute>
                <PersonalizedDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
              <ProtectedRoute>
                 <Nutrition />
              </ProtectedRoute>
            }
        />
        <Route
            path="/water-tracker"
            element={
              <ProtectedRoute>
                <WaterTracker />
              </ProtectedRoute>
            }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/external-activities"
          element={
            <ProtectedRoute>
              <ExternalActivities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/advanced-analytics"
          element={
           <ProtectedRoute>
              <AdvancedAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
             <ProtectedRoute>
                <Reminders />
             </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
