/*
## MyToDoReact version 1.0.
##
## Copyright (c) 2022 Oracle, Inc.
## Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/*
 * This is the application main React component. We're using "function"
 * components in this application. No "class" components should be used for
 * consistency.
 * @author  jean.de.lavarene@oracle.com
 */
import React, { useState } from "react";

import Background from "./components/background/Background";
import HeaderStart from "./components/headerStart/headerStart";

import SideMenu from "./components/sideMenu/sideMenu";

import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import TaskDashboard from "./views/taskDashboard/taskDashboard";
import Analytics from "./views/analytics/analytics";
import Notifications from "./views/notifications/notifications";

/* In this application we're using Function Components with the State Hooks
 * to manage the states. See the doc: https://reactjs.org/docs/hooks-state.html
 * This App component represents the entire app. It renders a NewItem component
 * and two tables: one that lists the todo items that are to be done and another
 * one with the items that are already done.
 */
function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [currView, setCurrView] = useState("login");

  function handleLogin(username, password) {
    if (username.trim() && password.trim()) {
      setAuthenticated(true);
      setCurrView("taskDashboard");
      return true;
    }
    return false;
  }

  function handleNavigate(view) {
    setCurrView(view);
  }

  

  if (!isAuthenticated) {
    return (
      <>
        <HeaderStart vista={currView} onNavigate={handleNavigate} />
        <Background isAuthenticated={isAuthenticated}>
          {currView === "register" ? (
            <RegisterView
              onRegister={handleLogin}
              onBackToLogin={() => handleNavigate("login")}
            />
          ) : (
            <LoginView
              onLogin={handleLogin}
              onGoToRegister={() => handleNavigate("register")}
            />
          )}
        </Background>
      </>
    );
  }

  return (
    <Background isAuthenticated={isAuthenticated}>
      <SideMenu currentView={currView} onNavigate={handleNavigate}>
        {currView === "home" ? (
          <h1>Home</h1>
        ) : currView === "taskDashboard" ? (
          <TaskDashboard />
        ) : currView === "analytics" ? (
          <Analytics />
        ) : currView === "notifications" ? (
          <Notifications />
        ) : currView === "team" ? (
          <main>
            <h1>Team</h1>
          </main>
        ) : currView === "profile" ? (
          <main>
            <h1>Profile</h1>
          </main>
        ) : (
          <TaskDashboard />
        )}
      </SideMenu>
    </Background>
  );
}
export default App;
