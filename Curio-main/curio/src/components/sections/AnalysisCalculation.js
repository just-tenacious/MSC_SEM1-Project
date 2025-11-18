import React from "react";
import { useLocation } from "react-router-dom";

const AnalysisCalculation = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const titles = {
    face: "Face Shape Analysis",
    body: "Body Type Analysis",
    clothing: "Style Preference Analysis",
  };

  return (
    <div>
      <h2>{titles[type] || "Select an Analysis"}</h2>
    </div>
  );
};

export default AnalysisCalculation;
