import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import UserLayout from "../components/UserLayout";
import AdminLayout from "../components/AdminLayout"; 
import Home from "../pages/Home";
import MainInfo from "../pages/MainInfo";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OTP from "../pages/otp";
import AnalysisDetails from "../components/sections/AnalysisDetails";
import Dashboard from "../pages/Dashboard";
// import StylesSection from "../components/sections/StylesSection";
import Review from "../pages/Review";
import ProfileCard from "../components/ProfileCard";
import ProtectedRoutes from "../components/ProtectedRoutes";
import AdminDashboard from "../pages/AdminDashboard";
import AdminContact from "../pages/AdminContact";
import AdminUsers from "../components/AdminUsers";
import ManageAdmins from "../pages/ManageAdmins";
import UserAnalysis from "../components/sections/UserAnalysis";
import FaceShapeCalculator from "../components/sections/FaceShapeCalculator";
import BodyTypeCalculator from "../components/sections/BodyTypeCalculator";
import BodyFrameCalculator from "../components/sections/BodyFrameCalculator";
import RecommendationPage from "../pages/RecommendationPage";
import AdminRecommendation from "../pages/AdminRecommendation";
import AdminRecommendationDetail from "../pages/AdminRecommendationDetail";
import AdminReports from "../pages/AdminReports";
import AdminFace from "../components/sections/AdminFace";
import AdminBody from "../components/sections/AdminBody";
import AdminHeightBuild from "../components/sections/AdminHeightBuild";
import UserStyles from "../components/sections/UserStyles";
import UserMainInfo from "../pages/UserMainInfo";

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="otp" element={<OTP />} />
      <Route path="face-style" element={<MainInfo />} />
      <Route path="body-style" element={<MainInfo />} />
      <Route path="clothing-style" element={<MainInfo />} />
      <Route path="analysis-detail" element={<AnalysisDetails />} />
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Route>

    {/* Protected user routes */}
    <Route
      element={
        <ProtectedRoutes>
          <UserLayout />
        </ProtectedRoutes>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user-styles" element={<UserStyles />} />
      <Route path="user-face-style" element={<UserMainInfo />} />
      <Route path="user-body-style" element={<UserMainInfo />} />
      <Route path="user-clothing-style" element={<UserMainInfo />} />
      <Route path="/analysis" element={<UserAnalysis />} />
      <Route path="/analysis-face" element={<FaceShapeCalculator />} />
      <Route path="/analysis-body" element={<BodyTypeCalculator />} />
      <Route path="/analysis-clothing" element={<BodyFrameCalculator />} />

      <Route path="/recommendations" element={<RecommendationPage />}>
        <Route path=":type" element={<RecommendationPage />} />
      </Route>

      <Route path="/review" element={<Review />} />
      <Route path="/profile" element={<ProfileCard />} />
    </Route>

    {/* Protected admin routes */}
    <Route
      element={
        <ProtectedRoutes adminOnly={true}>
          <AdminLayout />
        </ProtectedRoutes>
      }
    >
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-contact" element={<AdminContact />} />
      <Route
        path="/admin-users/sub-user"
        element={<AdminUsers type="active" />}
      />
      <Route
        path="/admin-users/blocked"
        element={<AdminUsers type="blocked" />}
      />
      <Route
        path="/admin-users/unverified"
        element={<AdminUsers type="unverified" />}
      />
      <Route
        path="/admin-ask-request"
        element={<ManageAdmins type="ask-requests" />}
      />
      <Route
        path="/admin-users/admin"
        element={<ManageAdmins type="approved" />}
      />
      <Route
        path="/admin-requests"
        element={<ManageAdmins type="requests" />}
      />
      <Route
        path="/admin-recommendations"
        element={<AdminRecommendation/>}
      />
      <Route
        path="/admin-recommendations/detail"
        element={<AdminRecommendationDetail/>}
      />
      <Route
        path="/reports"
        element={<AdminReports/>}
      />
      <Route
        path="/face-view"
        element={<AdminFace/>}
      />
      <Route
        path="/body-view"
        element={<AdminBody/>}
      />
      <Route
        path="/height-build-view"
        element={<AdminHeightBuild/>}
      />

    </Route>
  </Routes>
);

export default AppRoutes;
