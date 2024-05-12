import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./Reg.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/", formData);
      console.log("Response:", response.data);

      // Clear form data
      setFormData({ email: "", password: "" });
      setError("");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <div>
      <div className="regmtitle">LOGIN</div>
      <div className="uregmallitems">
        <form onSubmit={handleSubmit}>
          <div className="regfitems">
            <div>
              <input
                className="regfminputs"
                type="email"
                id="email"
                name="email"
                placeholder="Email Address : "
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className="regfminputs"
                type="password"
                id="password"
                name="password"
                placeholder="Password : "
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="remubtn">
              Login
            </button>
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ToastContainer />
    </div>
  );
};

export default Login;
