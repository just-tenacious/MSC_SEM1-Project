import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css";
import { FaUser, FaEnvelope, FaLock, FaBirthdayCake } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    dob: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const { fullname, username, dob, gender, email, password, confirmPassword } = formData;
    if (!fullname || !username || !dob || !gender || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setSuccess("");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email");
      setSuccess("");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/register", { fullname, username, dob, gender, email, password });
      if (res.data.status === "ok") {
        setSuccess("Signup successful! Redirecting...");
        setFormData({ fullname: "", username: "", dob: "", gender: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => window.location.href = "/login", 2000);
      } else setError("Registration failed");
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <section className="auth-section signup">
      <div className="auth-card horizontal">
        <div className="card-left">
          <img src="https://static.vecteezy.com/system/resources/previews/023/088/728/original/register-here-sign-business-concept-advertising-banner-template-flat-design-vector.jpg" alt="Register Banner" width="300" height="500" />
        </div>
        <div className="card-right">
          <h3>Create Account</h3>
          <p className="subtitle">Join Curio and unlock your personalized fashion journey.</p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-wrapper"><FaUser className="input-icon" /><input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} /></div>
              <div className="input-wrapper"><FaUser className="input-icon" /><input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="input-wrapper"><FaBirthdayCake className="input-icon" /><input type="date" name="dob" value={formData.dob} onChange={handleChange} /></div>
              <div className="gender-options horizontal-gender">
                {["male", "female", "other"].map(g => (
                  <label key={g}>
                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="full-width" />
              </div>
            </div>
            <div className="form-row">
              <div className="input-wrapper"><FaLock className="input-icon" /><input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /></div>
              <div className="input-wrapper"><FaLock className="input-icon" /><input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} /></div>
            </div>
            <button type="submit" className="btn">Sign Up</button>
          </form>
          <p className="small-text">Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
