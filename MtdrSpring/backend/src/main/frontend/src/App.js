/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
import React, { useEffect, useState } from "react";

import Background from "./components/background/Background";
import HeaderStart from "./components/headerStart/headerStart";

import SideMenu from "./components/sideMenu/sideMenu";

import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import TaskDashboard from "./views/taskDashboard/taskDashboard";
import AnalyticsView from "./views/analytics/AnalyticsView";
import Notifications from "./views/notifications/notifications";
import HomeView from "./views/home/HomeView";
import PodView from "./views/pod/PodView";
import ProfileView from "./views/profile/ProfileView";

const SESSION_KEY = "octobuddy_user";

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [currView, setCurrView] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = readStoredUser();
    if (stored?.id) {
      setUser(stored);
      setAuthenticated(true);
      setCurrView("taskDashboard");
    }
  }, []);

  function handleUserAfter(userData) {
    setUser(userData);
    setAuthenticated(true);
    setCurrView("taskDashboard");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAuthenticated(false);
    setCurrView("login");
  }

  function handleNavigate(view) {
    setCurrView(view);
  }

  if (!isAuthenticated) {
    return (
      <div className="app-shell app-shell--unauth" data-theme="auth-dark">
        <HeaderStart vista={currView} onNavigate={handleNavigate} />
        <Background isAuthenticated={isAuthenticated}>
          <div className="shell-main shell-main--auth">
            {currView === "register" ? (
              <RegisterView
                onRegister={handleUserAfter}
                onBackToLogin={() => handleNavigate("login")}
              />
            ) : (
              <LoginView
                onLogin={handleUserAfter}
                onGoToRegister={() => handleNavigate("register")}
              />
            )}
          </div>
        </Background>
      </div>
    );
  }

  return (
    <Background isAuthenticated={isAuthenticated}>
      <div className="app-shell app-shell--app" data-theme="app-light">
        <HeaderStart
          vista={currView}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
        />
        <div className="shell-body">
          <SideMenu currentView={currView} onNavigate={handleNavigate} user={user}>
            {currView === "home" ? (
              <HomeView user={user} onNavigate={handleNavigate} />
            ) : currView === "taskDashboard" ? (
              <TaskDashboard user={user} />
            ) : currView === "analytics" ? (
              <AnalyticsView user={user} />
            ) : currView === "notifications" ? (
              <Notifications user={user} />
            ) : currView === "team" ? (
              <PodView user={user} />
            ) : currView === "profile" ? (
              <ProfileView user={user} onNavigate={handleNavigate} />
            ) : (
              <TaskDashboard user={user} />
            )}
          </SideMenu>
        </div>
      </div>
    </Background>
  );
}
export default App;
