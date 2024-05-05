import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { errorMessage, successMessage } from "../../src/utils/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/store/useAuthStore";
import AuthAPI from "../../src/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { USER_ROLES } from "../../src/constants/roles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Reg.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UserLog = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email is invalid";
    }

    if (!password) {
      isValid = false;
      errors.password = "Password is required";
    } else if (password.length < 1) { // Corrected length check
      isValid = false;
      errors.password = "Password must be at least 6 characters";
    }

    setErrors(errors);
    return isValid;
  };

  const redirectToDashboard = (res) => {
    // Now using UserId from the response
    const { role, UserId } = res.data.user;
    if (role === USER_ROLES.CUSTOMER) {
      navigate("/", { state: { userId: UserId } });
    } else if (role === USER_ROLES.ADMIN) {
      navigate("/admin"); // Example: Admin dashboard path
    } else {
      navigate("/"); // Default navigation, could adjust based on needs
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: (res) => {
      login(res.data.user, res.data.token);
      successMessage("Success", res.data.message, () => {
        redirectToDashboard(res);
      });
    },
    onError: (err) => {
      errorMessage("Error", err.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate({ email, password });
    }
  };

  return (
    <div>
      <Header/>
      <h1 className="regmtitle">Login</h1>
      <div className="uregmallitems">
        <form onSubmit={handleSubmit}>
          <div className="regfitems">
            <input
              type="email"
              className={`regfminputs ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}

            <input
              type="password"
              className={`regfminputs ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}

            <button type="submit" className="remubtn" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
            <div className="mt-3 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default UserLog;
