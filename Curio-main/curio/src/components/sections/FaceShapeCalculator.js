import React, { useState, useEffect } from "react";
import sampleData from "./faceSampleData";
import "./Analysis.css";
import "./Calculator.css";
import axios from "axios";

const stepsConfig = [
  { id: "intro", title: "Welcome to Face Shape Calculator", content: <p>Follow the steps to enter your face measurements and find out your face shape.</p>, buttons: ["start"] },
  { id: "faceLength", title: "Face Length", label: "Face Length (cm)", inputId: "faceLength", min: 15, max: 24 },
  { id: "foreheadWidth", title: "Forehead Width", label: "Forehead Width (cm)", inputId: "foreheadWidth", min: 10, max: 18 },
  { id: "cheekboneWidth", title: "Cheekbone Width", label: "Cheekbone Width (cm)", inputId: "cheekboneWidth", min: 12, max: 20 },
  { id: "jawlineWidth", title: "Jawline Width", label: "Jawline Width (cm)", inputId: "jawlineWidth", min: 10, max: 18 },
  { id: "result", title: "Result" },
];

const FaceShapeCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState({ faceLength: "", foreheadWidth: "", cheekboneWidth: "", jawlineWidth: "" });
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3001/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.status === "ok") setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => setInputs({ ...inputs, [e.target.id]: e.target.value });

  const validateInput = (id, min, max) => {
    const value = parseFloat(inputs[id]);
    return !isNaN(value) && value >= min && value <= max;
  };

  const nextStep = () => {
    const step = stepsConfig[currentStep];
    if (step.inputId && !validateInput(step.inputId, step.min, step.max)) {
      alert(`Please enter a valid number between ${step.min} and ${step.max} cm.`);
      return;
    }
    if (currentStep < stepsConfig.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const calculateShape = async () => {
    if (!user) {
      alert("⚠️ User not found. Please log in to save results.");
      return;
    }

    const { faceLength: FL, foreheadWidth: FW, cheekboneWidth: CW, jawlineWidth: JW } = inputs;
    const LWR = parseFloat(FL) / parseFloat(CW);
    let shape = "Unknown";

    if (LWR >= 0.9 && LWR <= 1.1 && Math.abs(FW - JW) < 2 && Math.abs(CW - FL) < 2) shape = "Round";
    else if (LWR > 1.2 && LWR <= 1.5 && FW > JW) shape = "Oval";
    else if (LWR > 1.5 && Math.abs(FW - JW) < 2) shape = "Rectangle/Oblong";
    else if (Math.abs(FW - JW) < 2 && Math.abs(FW - CW) < 2) shape = "Square";
    else if (FW > JW && JW < CW) shape = "Heart";
    else if (CW > FW && CW > JW) shape = "Diamond";
    else if (JW > FW) shape = "Triangle";

    const content = sampleData.find((item) => item.title.toLowerCase() === shape.toLowerCase()) || {
      title: shape,
      desc: "Face shape information is not available.",
      img: "images/default-icon.png",
    };

    setResult(content);
    setCurrentStep(stepsConfig.length - 1);

    // Save to backend
    try {
      const payload = {
        user_id: user._id, // dynamically fetched
        faceLength: parseFloat(FL),
        foreheadWidth: parseFloat(FW),
        cheekboneWidth: parseFloat(CW),
        jawlineWidth: parseFloat(JW),
        face_shape: content.title,
      };

      const response = await fetch("http://localhost:3001/api/face-shape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) console.error("Failed to save face shape data:", await response.text());
      else console.log("✅ Face shape data saved successfully!");
    } catch (error) {
      console.error("Error saving face shape data:", error);
    }
  };

  const restart = () => {
    setInputs({ faceLength: "", foreheadWidth: "", cheekboneWidth: "", jawlineWidth: "" });
    setResult(null);
    setCurrentStep(0);
  };

  const step = stepsConfig[currentStep];

  return (
    <div className="calculator-wrapper">
      <div className="analysis-container analysis-card">
        {/* Stepper */}
        <div className="stepper">
          {stepsConfig.map((s, idx) => (
            <div key={s.id} className={`stepper-step ${idx < currentStep ? "completed" : ""} ${idx === currentStep ? "active" : ""}`}>
              <div className="step-counter">{idx + 1}</div>
              <div className="step-name">{s.title}</div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step active">
          <h3>{step.title}</h3>
          {step.content && <>{step.content}</>}

          {step.inputId && (
            <>
              <label>{step.label}</label>
              <input
                type="number"
                id={step.inputId}
                min={step.min}
                max={step.max}
                step="0.1"
                value={inputs[step.inputId]}
                onChange={handleInputChange}
              />
            </>
          )}

          <div style={{ marginTop: "1rem" }}>
            {currentStep > 0 && currentStep < stepsConfig.length - 1 && <button onClick={prevStep}>Back</button>}
            {currentStep < stepsConfig.length - 2 && <button onClick={nextStep}>Next</button>}
            {currentStep === stepsConfig.length - 2 && <button onClick={calculateShape}>Finish</button>}
            {currentStep === stepsConfig.length - 1 && <button onClick={restart}>Restart</button>}
          </div>

          {currentStep === stepsConfig.length - 1 && result && (
            <div>
              <h2>{result.title} Face Shape</h2>
              <p>{result.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceShapeCalculator;
