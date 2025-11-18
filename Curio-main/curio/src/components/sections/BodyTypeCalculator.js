import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Calculator.css";

const stepsConfig = [
  {
    id: "intro",
    title: "Welcome to Body Shape Calculator",
    content: <p>Follow the steps to enter your body measurements and find out your body shape.</p>,
  },
  {
    id: "gender",
    title: "Gender",
    label: "Select Gender",
    inputId: "gender",
    type: "select",
    options: [
      { value: "", label: "-- Select --" },
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
    ],
  },
  {
    id: "shoulderWidth",
    title: "Shoulder Width",
    label: "Shoulder Width (cm)",
    inputId: "shoulderWidth",
    min: 35,
    max: 60,
  },
  {
    id: "bust",
    title: "Bust / Chest",
    label: "Bust / Chest (cm)",
    inputId: "bust",
    min: 75,
    max: 120,
  },
  {
    id: "waist",
    title: "Waist",
    label: "Waist (cm)",
    inputId: "waist",
    min: 55,
    max: 110,
  },
  {
    id: "hips",
    title: "Hips",
    label: "Hips (cm)",
    inputId: "hips",
    min: 80,
    max: 115,
  },
  {
    id: "result",
    title: "Result",
  },
];

const BodyTypeCalculator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState({
    gender: "",
    shoulderWidth: "",
    bust: "",
    waist: "",
    hips: "",
  });
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3001/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.status === "ok") setUser(res.data.user);
      })
      .catch(err => console.error("Failed to fetch user:", err));
  }, []);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.id]: e.target.value });
  };

  const validateInput = (id, min, max) => {
    const value = parseFloat(inputs[id]);
    if (id === "gender") return inputs[id] !== "";
    return !isNaN(value) && value >= min && value <= max;
  };

  const nextStep = () => {
    const step = stepsConfig[currentStep];
    if (step.inputId && !validateInput(step.inputId, step.min, step.max)) {
      alert(
        step.id === "gender"
          ? "Please select a gender."
          : `Please enter a valid number between ${step.min} and ${step.max} cm.`
      );
      return;
    }
    if (currentStep < stepsConfig.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const calculateBodyShape = async () => {
    const { shoulderWidth: SW, bust: B, waist: W, hips: H } = inputs;
    const SWnum = parseFloat(SW);
    const Bnum = parseFloat(B);
    const Wnum = parseFloat(W);
    const Hnum = parseFloat(H);

    let shape = {
      title: "Undefined",
      desc: "Measurements do not clearly match common body shape categories.",
      img: "undefined.png",
    };

    if (Math.abs(Bnum - Hnum) / Hnum < 0.1 && Wnum <= 0.75 * Math.min(Hnum, Bnum)) {
      shape = {
        title: "Hourglass",
        desc: "Balanced bust and hips with a significantly narrower waist.",
        img: "hourglass.png",
      };
    } else if (Hnum > Bnum && SWnum / Hnum < 0.95) {
      shape = {
        title: "Pear (Triangle)",
        desc: "Wider hips compared to bust and shoulders.",
        img: "pear.png",
      };
    } else if (SWnum / Hnum > 1.05 || Bnum > Hnum) {
      shape = {
        title: "Inverted Triangle",
        desc: "Broader shoulders or bust compared to hips.",
        img: "inverted_triangle.png",
      };
    } else if (Math.abs(Bnum - Hnum) / Hnum < 0.1 && Wnum >= 0.75 * Hnum && Wnum <= 0.85 * Hnum) {
      shape = {
        title: "Rectangle (Athletic)",
        desc: "Bust, waist, and hips are fairly similar, with low definition at the waist.",
        img: "rectangle.png",
      };
    } else if (Wnum >= 0.85 * Hnum && Wnum >= 0.85 * Bnum) {
      shape = {
        title: "Apple (Round/Oval)",
        desc: "Weight concentrated around midsection.",
        img: "apple.png",
      };
    }

    setResult(shape);
    setCurrentStep(stepsConfig.length - 1);

    // Save to backend if user is logged in
    if (!user) {
      alert("Please log in to save your analysis.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/api/body-type",
        {
          user_id: user._id,
          gender: inputs.gender,
          shoulderWidth: SWnum,
          bust: Bnum,
          waist: Wnum,
          hips: Hnum,
          body_shape: shape.title,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("Body type saved successfully!");
    } catch (err) {
      if (err.response) {
        console.error("Backend error status:", err.response.status);
        console.error("Backend error data:", err.response.data);
      } else {
        console.error("Error sending request:", err.message);
      }
    }

  };

  const restart = () => {
    setInputs({ gender: "", shoulderWidth: "", bust: "", waist: "", hips: "" });
    setResult(null);
    setCurrentStep(0);
  };

  const step = stepsConfig[currentStep];

  return (
    <div className="calculator-wrapper">
      <div className="analysis-container analysis-card">
        <div className="stepper">
          {stepsConfig.map((s, idx) => (
            <div
              key={s.id}
              className={`stepper-step ${idx < currentStep ? "completed" : ""} ${idx === currentStep ? "active" : ""}`}
            >
              <div className="step-counter">{idx + 1}</div>
              <div className="step-name">{s.title}</div>
            </div>
          ))}
        </div>

        <div className="step active">
          <h3>{step.title}</h3>
          {step.content && <>{step.content}</>}

          {step.inputId && step.type === "select" && (
            <select id={step.inputId} value={inputs[step.inputId]} onChange={handleInputChange}>
              {step.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {step.inputId && (!step.type || step.type === "number") && (
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
            {currentStep === stepsConfig.length - 2 && (
              <button
                onClick={() => {
                  if (!user) {
                    alert("Please log in to save your analysis.");
                    navigate("/login");
                    return;
                  }
                  calculateBodyShape();
                }}
              >
                Finish
              </button>
            )}
            {currentStep === stepsConfig.length - 1 && <button onClick={restart}>Restart</button>}
          </div>

          {currentStep === stepsConfig.length - 1 && result && (
            <div className="result-display">
              <h2>{result.title}</h2>
              <p>{result.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyTypeCalculator;
