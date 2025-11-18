// import React from "react";
// import "../styles/auth.css"; // adjust the path if your CSS is elsewhere

// const Review = () => {
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Collect form data
//     const formData = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       message: e.target.message.value,
//     };

//     try {
//       // Send data to backend
//       const res = await fetch("http://localhost:3001/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (result.status === "ok") {
//         alert("✅ Message sent successfully!");
//         e.target.reset(); // clear form
//       } else {
//         alert("❌ Failed to send message");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("⚠️ Error sending message");
//     }
//   };

//   return (
//     <section className="auth-section contact">
//       <div className="auth-card contact">
//         <h3>Contact Us</h3>
//         <p className="subtitle">We’d love to hear from you</p>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Your Name" required />
//           <input type="email" name="email" placeholder="Your Email" required />
//           <textarea name="message" placeholder="Message" required></textarea>
//           <button type="submit" className="btn">Send</button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Review;

// import React from "react";
// import "../styles/auth.css"; // adjust the path if your CSS is elsewhere

// const Contact = () => {
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Collect form data
//     const formData = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       message: e.target.message.value,
//     };

//     try {
//       // Send data to backend
//       const res = await fetch("http://localhost:3001/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const result = await res.json();

//       if (result.status === "ok") {
//         alert("✅ Message sent successfully!");
//         e.target.reset(); // clear form
//       } else {
//         alert("❌ Failed to send message");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("⚠️ Error sending message");
//     }
//   };

//   return (
//     <section className="auth-section contact">
//       <div className="auth-card contact">
//         <h3>Contact Us</h3>
//         <p className="subtitle">We’d love to hear from you</p>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Your Name" required />
//           <input type="email" name="email" placeholder="Your Email" required />
//           <textarea name="message" placeholder="Message" required></textarea>
//           <button type="submit" className="btn">Send</button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Contact;
import React from "react";
import "../styles/auth.css";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

const Review = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.status === "ok") {
        alert("✅ Message sent successfully!");
        e.target.reset();
      } else {
        alert("❌ Failed to send message");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Error sending message");
    }
  };

  return (
    <section className="auth-section contact">
      <div className="auth-card horizontal">
        {/* Left pane with full-screen image */}
        <div className="card-left">
          <img
            src="https://tse3.mm.bing.net/th/id/OIP.dnNvNZO2JDslsXm1nTiZmwHaHa?cb=12&pid=ImgDet&w=179&h=179&c=7&dpr=1.5&o=7&rm=3"
            alt="Contact Us"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Right pane with form */}
        <div className="card-right">
          <h3 style={{ textAlign: "center" }}> Review Us </h3>
          <p className="subtitle" style={{ textAlign: "center" }}>
            We’d love to hear from you your experience
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>

            <div className="form-row full-width">
              <div className="input-wrapper">
                <FaCommentDots className="textarea-icon" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  style={{
                    width: "100%",
                    height: "180px",
                    padding: "10px 35px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Review;
