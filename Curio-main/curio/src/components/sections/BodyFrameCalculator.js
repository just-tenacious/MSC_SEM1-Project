import React, { useState, useEffect } from "react";
import "./Calculator.css";

const stepsConfig = [
  { id: "intro", title: "Welcome to Body Frame Calculator", content: <p>This calculator helps you determine your body frame type based on your foot size, height, and weight.</p> },
  { id: "footSize", title: "Foot Size", label: "Foot Size (cm)", inputId: "footSize", min: 10, max: 40 },
  { id: "height", title: "Height", label: "Height (cm)", inputId: "height", min: 100, max: 250 },
  { id: "weight", title: "Weight", label: "Weight (kg)", inputId: "weight", min: 30, max: 200 },
  { id: "review", title: "Review" },
  { id: "result", title: "Result" },
];

const BodyFrameCalculator = ({ userId, gender }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState({ footSize: "", height: "", weight: "" });
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/height-build/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setInputs({
              footSize: data.footSize || "",
              height: data.height || "",
              weight: data.weight || "",
            });
            setResult(data.frame ? { frame: data.frame, desc: data.desc } : null);
          }
        }
      } catch (err) {
        console.error("Error fetching user height-build:", err);
      }
    };

    if (userId) fetchExistingData();
  }, [userId]);

  const handleInputChange = (e) => setInputs({ ...inputs, [e.target.id]: e.target.value });

  const validateInput = (id, min, max) => {
    const val = parseFloat(inputs[id]);
    return !isNaN(val) && val >= min && val <= max;
  };

  const nextStep = () => {
    const step = stepsConfig[currentStep];
    if (step.inputId && !validateInput(step.inputId, step.min, step.max)) {
      alert(`Please enter a valid number between ${step.min} and ${step.max}.`);
      return;
    }

    if (currentStep === 4) calculateFrame();
    else if (currentStep < stepsConfig.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const calculateFrame = async () => {
    const foot = parseFloat(inputs.footSize);
    const height = parseFloat(inputs.height);
    const weight = parseFloat(inputs.weight);

    if (isNaN(foot) || isNaN(height) || isNaN(weight)) return;

    const footRatio = foot / height;
    const weightRatio = weight / height;

    let frame = "Large";
    if (footRatio < 0.14 && weightRatio < 0.35) frame = "Small";
    else if (footRatio >= 0.14 && footRatio < 0.17 && weightRatio >= 0.35 && weightRatio < 0.45) frame = "Medium";

    let desc = "";
    if (frame === "Small") desc = "Lighter bone structure and smaller joints.";
    else if (frame === "Medium") desc = "Balanced body proportions.";
    else desc = "Larger bone structure and broader joints.";

    setResult({ frame, desc });
    setCurrentStep(5);

    // Save or update in backend dynamically
    try {
      const res = await fetch("http://localhost:3001/api/height-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:userId,
          gender: gender,
          footSize: foot,
          height,
          weight,
          frame,
        }),
      });

      const data = await res.json();
      console.log("Saved height_build data:", data);
    } catch (err) {
      console.error("Error saving height_build:", err);
    }
  };

  const restart = () => {
    setInputs({ footSize: "", height: "", weight: "" });
    setResult(null);
    setCurrentStep(0);
  };

  const step = stepsConfig[currentStep];

  return (
    <div className="calculator-wrapper">
      <div className="analysis-container analysis-card">
        <div className="stepper">
          {stepsConfig.map((s, idx) => (
            <div key={s.id} className={`stepper-step ${idx < currentStep ? "completed" : ""} ${idx === currentStep ? "active" : ""}`}>
              <div className="step-counter">{idx + 1}</div>
              <div className="step-name">{s.title}</div>
            </div>
          ))}
        </div>

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

          {currentStep === 4 && (
            <div>
              <h4>Review your inputs:</h4>
              <ul>
                <li>Foot Size: {inputs.footSize} cm</li>
                <li>Height: {inputs.height} cm</li>
                <li>Weight: {inputs.weight} kg</li>
              </ul>
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            {currentStep > 0 && currentStep < stepsConfig.length - 1 && <button onClick={prevStep}>Back</button>}
            {currentStep < stepsConfig.length - 2 && <button onClick={nextStep}>Next</button>}
            {currentStep === stepsConfig.length - 2 && <button onClick={nextStep}>See Result</button>}
            {currentStep === stepsConfig.length - 1 && <button onClick={restart}>Restart</button>}
          </div>

          {currentStep === 5 && result && (
            <div className="result-display">
              <h3>Your Body Frame Type: {result.frame}</h3>
              <p>{result.desc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BodyFrameCalculator;


// import React, { useState } from "react";
// import "./Calculator.css";

// const stepsConfig = [
//   { id: "intro", title: "Welcome to Body Frame Calculator", content: <p>This calculator helps you determine your body frame type based on your foot size, height, and weight.</p> },
//   { id: "footSize", title: "Foot Size", label: "Foot Size (cm)", inputId: "footSize", min: 10, max: 40 },
//   { id: "height", title: "Height", label: "Height (cm)", inputId: "height", min: 100, max: 250 },
//   { id: "weight", title: "Weight", label: "Weight (kg)", inputId: "weight", min: 30, max: 200 },
//   { id: "review", title: "Review" },
//   { id: "result", title: "Result" },
// ];

// const BodyFrameCalculator = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [inputs, setInputs] = useState({ footSize: "", height: "", weight: "" });
//   const [result, setResult] = useState(null);

//   const handleInputChange = (e) => setInputs({ ...inputs, [e.target.id]: e.target.value });

//   const validateInput = (id, min, max) => {
//     const val = parseFloat(inputs[id]);
//     return !isNaN(val) && val >= min && val <= max;
//   };

//   const nextStep = () => {
//     const step = stepsConfig[currentStep];
//     if (step.inputId && !validateInput(step.inputId, step.min, step.max)) {
//       alert(`Please enter a valid number between ${step.min} and ${step.max}.`);
//       return;
//     }

//     if (currentStep === 4) calculateFrame();
//     else if (currentStep < stepsConfig.length - 1) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

//   const calculateFrame = () => {
//     const foot = parseFloat(inputs.footSize);
//     const height = parseFloat(inputs.height);
//     const weight = parseFloat(inputs.weight);

//     if (isNaN(foot) || isNaN(height) || isNaN(weight)) return;

//     const footRatio = foot / height;
//     const weightRatio = weight / height;

//     let frame = "Large";
//     if (footRatio < 0.14 && weightRatio < 0.35) frame = "Small";
//     else if (footRatio >= 0.14 && footRatio < 0.17 && weightRatio >= 0.35 && weightRatio < 0.45) frame = "Medium";

//     let desc = "";
//     if (frame === "Small") desc = "Lighter bone structure and smaller joints.";
//     else if (frame === "Medium") desc = "Balanced body proportions.";
//     else desc = "Larger bone structure and broader joints.";

//     setResult({ frame, desc });
//     setCurrentStep(5);
//   };

//   const restart = () => {
//     setInputs({ footSize: "", height: "", weight: "" });
//     setResult(null);
//     setCurrentStep(0);
//   };

//   const step = stepsConfig[currentStep];

//   return (
//     <div className="calculator-wrapper">
//     <div className="analysis-container analysis-card">
//       <div className="stepper">
//         {stepsConfig.map((s, idx) => (
//           <div key={s.id} className={`stepper-step ${idx < currentStep ? "completed" : ""} ${idx === currentStep ? "active" : ""}`}>
//             <div className="step-counter">{idx + 1}</div>
//             <div className="step-name">{s.title}</div>
//           </div>
//         ))}
//       </div>

//       <div className="step active">
//         <h3>{step.title}</h3>
//         {step.content && <>{step.content}</>}

//         {step.inputId && (
//           <>
//             <label>{step.label}</label>
//             <input
//               type="number"
//               id={step.inputId}
//               min={step.min}
//               max={step.max}
//               step="0.1"
//               value={inputs[step.inputId]}
//               onChange={handleInputChange}
//             />
//           </>
//         )}

//         {currentStep === 4 && (
//           <div>
//             <h4>Review your inputs:</h4>
//             <ul>
//               <li>Foot Size: {inputs.footSize} cm</li>
//               <li>Height: {inputs.height} cm</li>
//               <li>Weight: {inputs.weight} kg</li>
//             </ul>
//           </div>
//         )}

//         <div style={{ marginTop: "1rem" }}>
//           {currentStep > 0 && currentStep < stepsConfig.length - 1 && <button onClick={prevStep}>Back</button>}
//           {currentStep < stepsConfig.length - 2 && <button onClick={nextStep}>Next</button>}
//           {currentStep === stepsConfig.length - 2 && <button onClick={nextStep}>See Result</button>}
//           {currentStep === stepsConfig.length - 1 && <button onClick={restart}>Restart</button>}
//         </div>

//         {currentStep === 5 && result && (
//           <div className="result-display">
//             <h3>Your Body Frame Type: {result.frame}</h3>
//             <p>{result.desc}</p>
//           </div>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default BodyFrameCalculator;
