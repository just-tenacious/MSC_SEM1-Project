import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError("Please fill in all fields");
      setSuccess("");
      return;
    }

    setError("");
    try {
      const response = await axios.post("http://localhost:3001/login", {
        emailOrUsername,
        password,
      });

      const data = response.data;

      // 🚫 Blocked user (acc_status = 2)
      if (data.user?.acc_status === 2) {
        setError("User is blocked.");
        setSuccess("");
        return;
      }

      // 🔐 OTP required (acc_status = 0)
      if (data.user?.acc_status === 0) {
        setSuccess("Redirecting to OTP verification...");
        setError("");
        localStorage.setItem("otp_user_id", data.user.id);
        setTimeout(() => navigate("/otp"), 1500);
        return;
      }

      // ✅ Normal login (acc_status = 1)
      if (data.user?.acc_status === 1) {
        const { token, user } = data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("is_admin", user.is_admin);
        if (user.profilePic) localStorage.setItem("profilePic", user.profilePic);

        setSuccess(`Welcome, ${user.username}! Redirecting...`);
        setError("");

        setTimeout(() => navigate("/dashboard"), 1500);
        return;
      }

      // fallback for invalid credentials
      setError(data.error || "Invalid credentials");
      setSuccess("");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
      setSuccess("");
    }
  };

  return (
    <section className="auth-section login">
      <div className="auth-card horizontal">
        <div className="card-left">
          <img
            src="https://th.bing.com/th/id/OIP.2gbYbKiZF0v1WPNe9kSkNQHaGL?w=232&h=195&c=7&r=0&o=7&cb=12&dpr=1.5&pid=1.7&rm=3"
            alt="Login Banner"
            width="400"
            height="400"
          />
        </div>
        <div className="card-right">
          <h3>Welcome Back</h3>
          <p className="subtitle">Login to continue exploring your style</p>

          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="text"
                  placeholder="Email or Username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn">Login</button>
          </form>

          <p className="small-text">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/auth.css";
// import { FaEnvelope, FaLock } from "react-icons/fa";

// const Login = () => {
//   const [emailOrUsername, setEmailOrUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();
  
//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!emailOrUsername || !password) {
//     setError("Please fill in all fields");
//     setSuccess("");
//     return;
//   }

//   setError("");
//   try {
//     const response = await axios.post("http://localhost:3001/login", {
//       emailOrUsername,
//       password,
//     });

//     const data = response.data;

//     // 🚫 Blocked user
//     if (data.error === "User is blocked") {
//       setError("User is blocked.");
//       setSuccess("");
//       return;
//     }

//     // 🔐 OTP required
//     if (data.status === "otp_required") {
//       setSuccess(data.message || "Redirecting to OTP verification...");
//       setError("");
//       // store userId or email for OTP verification step
//       localStorage.setItem("otp_user_id", data.userId);
//       setTimeout(() => navigate("/otp"), 1500);
//       return;
//     }

//     // ✅ Normal login
//     if (data.status === "ok") {
//       const { token, user } = data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("username", user.username);
//       localStorage.setItem("is_admin", user.is_admin);
//       if (user.profilePic) localStorage.setItem("profilePic", user.profilePic);

//       setSuccess(`Welcome, ${user.username}! Redirecting...`);
//       setError("");

//       setTimeout(() => navigate("/dashboard"), 1500);
//     } else {
//       setError(data.error || "Invalid credentials");
//       setSuccess("");
//     }
//   } catch (err) {
//     console.error(err);
//     setError(err.response?.data?.error || "Server error");
//     setSuccess("");
//   }
// };

//   return (
//     <section className="auth-section login">
//       <div className="auth-card horizontal">
//         <div className="card-left">
//           <img
//             src="https://th.bing.com/th/id/OIP.2gbYbKiZF0v1WPNe9kSkNQHaGL?w=232&h=195&c=7&r=0&o=7&cb=12&dpr=1.5&pid=1.7&rm=3"
//             alt="Login Banner"
//             width="400"
//             height="400"
//           />
//         </div>
//         <div className="card-right">
//           <h3>Welcome Back</h3>
//           <p className="subtitle">Login to continue exploring your style</p>

//           {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
//           {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

//           <form onSubmit={handleSubmit}>
//             <div className="form-row full-width">
//               <div className="input-wrapper">
//                 <FaEnvelope className="input-icon" />
//                 <input
//                   type="text"
//                   placeholder="Email or Username"
//                   value={emailOrUsername}
//                   onChange={(e) => setEmailOrUsername(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//             <div className="form-row full-width">
//               <div className="input-wrapper">
//                 <FaLock className="input-icon" />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>
//             <button type="submit" className="btn">Login</button>
//           </form>

//           <p className="small-text">
//             Don’t have an account? <a href="/register">Sign up</a>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;
