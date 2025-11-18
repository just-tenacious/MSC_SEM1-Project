import React, { useRef, useState, useEffect } from "react";
import "../styles/auth.css";

const OTP = () => {
  const inputsRef = useRef([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
      setOtpSent(true);
      setTimer(30); // 30 sec cooldown before resend
    } catch (err) {
      console.error(err);
      setMessage("Failed to send OTP. Try again.");
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    if (timer === 0) sendOtp();
  };

  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map((input) => input.value).join("");

    if (otp.length !== 6) {
      alert("Please enter complete 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified successfully!");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to verify OTP. Try again.");
    }
  };

  return (
    <section className="auth-section">
      <div
        className="auth-card horizontal"
        style={{ maxWidth: "500px", padding: "2rem" }}
      >
        <div className="card-right" style={{ flex: 1, textAlign: "center" }}>
          <h3>OTP Verification</h3>

          {!otpSent && (
            <>
              <p className="subtitle">Enter your email to receive OTP:</p>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
              <button className="btn" onClick={sendOtp}>
                Send OTP
              </button>
              {message && <p className="small-text">{message}</p>}
            </>
          )}

          {otpSent && (
            <>
              <p className="subtitle">Enter the 6-digit OTP sent to your email.</p>
              {message && <p className="small-text">{message}</p>}

              <form onSubmit={handleSubmit}>
                <div
                  className="form-row"
                  style={{
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "1.5rem",
                    flexWrap: "nowrap",
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputsRef.current[i] = el)}
                      onInput={(e) => handleInput(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      required
                      style={{
                        width: "50px",
                        height: "50px",
                        textAlign: "center",
                        fontSize: "1.4rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        outline: "none",
                        transition: "border-color 0.3s, box-shadow 0.3s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#6c63ff";
                        e.target.style.boxShadow = "0 0 6px rgba(108, 99, 255, 0.3)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  ))}
                </div>

                <button type="submit" className="btn">
                  Verify OTP
                </button>
              </form>

              <p className="small-text">
                Didn’t receive code?{" "}
                <a href="#"
                  onClick={handleResend}
                  style={{
                    pointerEvents: timer > 0 ? "none" : "auto",
                    opacity: timer > 0 ? 0.5 : 1,
                  }}
                >
                  Resend {timer > 0 ? `(${timer}s)` : ""}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default OTP;


// import React, { useRef } from "react";
// import "../styles/auth.css";

// const OTP = () => {
//   const inputsRef = useRef([]);

//   const handleInput = (e, index) => {
//     e.target.value = e.target.value.replace(/[^0-9]/g, "");
//     if (e.target.value && index < 5) {
//       inputsRef.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !e.target.value && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const otp = inputsRef.current.map((input) => input.value).join("");
//     if (otp.length === 6) {
//       alert("OTP Verified: " + otp);
//       window.location.href = "/login";
//     } else {
//       alert("Please enter complete 6-digit OTP");
//     }
//   };

//   return (
//     <section className="auth-section">
//       <div className="auth-card horizontal" style={{ maxWidth: "500px", padding: "2rem" }}>
//         <div className="card-right" style={{ flex: 1, textAlign: "center" }}>
//           <h3>OTP Verification</h3>
//           <p className="subtitle">Enter the 6-digit code sent to your email.</p>

//           <form onSubmit={handleSubmit}>
//             <div
//               className="form-row"
//               style={{
//                 justifyContent: "center",
//                 gap: "10px",
//                 marginBottom: "1.5rem",
//                 flexWrap: "nowrap", // force horizontal
//               }}
//             >
//               {[...Array(6)].map((_, i) => (
//                 <input
//                   key={i}
//                   type="text"
//                   maxLength="1"
//                   ref={(el) => (inputsRef.current[i] = el)}
//                   onInput={(e) => handleInput(e, i)}
//                   onKeyDown={(e) => handleKeyDown(e, i)}
//                   required
//                   style={{
//                     width: "50px",
//                     height: "50px",
//                     textAlign: "center",
//                     fontSize: "1.4rem",
//                     borderRadius: "8px",
//                     border: "1px solid #ddd",
//                     outline: "none",
//                     transition: "border-color 0.3s, box-shadow 0.3s",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#6c63ff";
//                     e.target.style.boxShadow = "0 0 6px rgba(108, 99, 255, 0.3)";
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = "#ddd";
//                     e.target.style.boxShadow = "none";
//                   }}
//                 />
//               ))}
//             </div>

//             <button type="submit" className="btn">
//               Verify OTP
//             </button>
//           </form>

//           <p className="small-text">
//             Didn’t receive code? <a href="#">Resend</a>
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OTP;
