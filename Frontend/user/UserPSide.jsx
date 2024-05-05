import React, { useState } from "react";
import "./UserPSide.css";
import WLogo from "../../src/assets/logo.png";
import Revpge from "./MyReviews";
import Profile from "./UserProfile";
import UserCart from "./ShoppingCart";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useNavigate } from "react-router-dom";

function App() {
  // const navigate = useNavigate();
  // //
  // const { logout } = useAuthStore((state) => ({
  //   logout: state.logout,
  // }));
  //
  const [activeTab, setActiveTab] = useState("Profile");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  return (
    <div className="App">
      <div className="side-panel">
        <div className="sidepnlimg">
          <img src={WLogo} alt="Logo" className="sidepanelimg" />
        </div>
        <ul>
          <li
            className={activeTab === "Profile" ? "active" : ""}
            onClick={() => handleTabClick("Profilee")}
          >
            <div className="sidepnlicon">
              <i className="fa-sharp fa-solid fa-user"></i>Profile
            </div>
          </li>
          <li
            className={activeTab === "Shopping" ? "active" : ""}
            onClick={() => handleTabClick("Shopping")}
          >
            <div className="sidepnlicon">
              <i class="fa-solid fa-cart-shopping"></i>Shopping
            </div>
          </li>
          <li
            className={activeTab === "Reviews" ? "active" : ""}
            onClick={() => handleTabClick("Reviews")}
          >
            <div className="sidepnlicon">
              <i class="fa-solid fa-comments"></i>Reviews
            </div>
          </li>
        </ul>
      </div>
      <div className="promain-content">
        {activeTab === "Shopping" && (
          <div>
            <UserCart />
          </div>
        )}
        {activeTab === "Profile" && (
          <div>
            <Profile />
          </div>
        )}
        {activeTab === "Reviews" && (
          <div>
            <Revpge />
          </div>
        )}
      </div>

      {/* <div className="logout">
        <button onClick={handleLogout}>Logout</button>
      </div> */}
    </div>
  );
}

export default App;
