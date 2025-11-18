import React, { useRef, useState, useEffect, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF"];

const AdminReports = () => {
  const totalUsersRef = useRef(null);
  const userStatusRef = useRef(null);
  const faceRef = useRef(null);
  const bodyRef = useRef(null);
  const heightRef = useRef(null);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/admin-counts");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.status === "ok") setData(result.counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  /* -------------------- PDF Generator -------------------- */
  const downloadAsPDF = async (ref, filename, title, tableObject) => {
    if (!ref.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.setLineWidth(2);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    pdf.setFontSize(28);
    pdf.text("CURIO REPORT", pageWidth / 2, 50, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(new Date().toLocaleString(), pageWidth - 40, 25, { align: "right" });
    pdf.setFontSize(18);
    pdf.text(title, pageWidth / 2, 90, { align: "center" });
    pdf.addImage(img, "PNG", 30, 120, pageWidth - 60, imgHeight);

    let tableStartY = imgHeight + 150;
    pdf.setFontSize(14);
    pdf.text(`${title} Summary`, 30, tableStartY);

    autoTable(pdf, {
      head: [tableObject.head],
      body: tableObject.body,
      startY: tableStartY + 20,
      theme: "grid",
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    pdf.save(`${filename}.pdf`);
  };

  /* -------------------- Chart Data Helpers -------------------- */
  const genderData = (categories, maleCounts, femaleCounts) => ({
    labels: categories,
    datasets: [
      {
        label: "Male",
        data: categories.map((c) => maleCounts[c] || 0),
        backgroundColor: colors.slice(0, categories.length),
      },
      {
        label: "Female",
        data: categories.map((c) => femaleCounts[c] || 0),
        backgroundColor: colors.slice(categories.length, categories.length * 2),
      },
    ],
  });

  const generalData = (categories, counts) => {
    const total = Object.values(counts || {}).reduce((a, b) => a + b, 0) || 1;
    return {
      labels: categories,
      datasets: [
        {
          label: "Percentage",
          data: categories.map((c) => ((counts[c] || 0) / total) * 100),
          backgroundColor: colors.slice(0, categories.length),
        },
      ],
    };
  };

  /* -------------------- Hooks to Memoize Data -------------------- */
  const faceShapes = useMemo(() => Object.keys(data?.faceCounts || {}), [data]);
  const bodyTypes = useMemo(() => Object.keys(data?.bodyCounts || {}), [data]);
  const heightTypes = useMemo(() => Object.keys(data?.heightCounts || {}), [data]);

  const faceGenderData = useMemo(
    () => genderData(faceShapes, data?.faceCountsMale || {}, data?.faceCountsFemale || {}),
    [faceShapes, data]
  );
  const bodyGenderData = useMemo(
    () => genderData(bodyTypes, data?.bodyCountsMale || {}, data?.bodyCountsFemale || {}),
    [bodyTypes, data]
  );
  const heightGenderData = useMemo(
    () => genderData(heightTypes, data?.heightCountsMale || {}, data?.heightCountsFemale || {}),
    [heightTypes, data]
  );

  const userStatusData = useMemo(
    () => ({
      labels: ["Registered", "Verified", "Blocked"],
      datasets: [
        {
          label: "Male",
          data: [
            data?.statusCounts?.registered || 0,
            data?.statusCounts?.verified || 0,
            data?.statusCounts?.blocked || 0,
          ],
          backgroundColor: "#36A2EB",
        },
        {
          label: "Female",
          data: [
            data?.statusCounts?.registered || 0,
            data?.statusCounts?.verified || 0,
            data?.statusCounts?.blocked || 0,
          ],
          backgroundColor: "#FF6384",
        },
      ],
    }),
    [data]
  );

  if (!data) return <p>Loading...</p>;

  /* -------------------- Tables -------------------- */
  const faceTable = {
    head: ["Face Shape", "Male", "Female", "Total"],
    body: faceShapes.map((f) => [
      f,
      data.faceCountsMale[f] || 0,
      data.faceCountsFemale[f] || 0,
      data.faceCounts[f] || 0,
    ]),
  };

  const bodyTable = {
    head: ["Body Type", "Male", "Female", "Total"],
    body: bodyTypes.map((b) => [
      b,
      data.bodyCountsMale[b] || 0,
      data.bodyCountsFemale[b] || 0,
      data.bodyCounts[b] || 0,
    ]),
  };

  const heightTable = {
    head: ["Height/Build", "Male", "Female", "Total"],
    body: heightTypes.map((h) => [
      h,
      data.heightCountsMale[h] || 0,
      data.heightCountsFemale[h] || 0,
      data.heightCounts[h] || 0,
    ]),
  };

  const totalUsersTable = {
    head: ["Category", "Male", "Female", "Total"],
    body: [
      [
        "Users",
        data.genderCounts?.male || 0,
        data.genderCounts?.female || 0,
        (data.genderCounts?.male || 0) + (data.genderCounts?.female || 0),
      ],
    ],
  };

  const statusUsersTable = {
    head: ["Status", "Male", "Female", "Total"],
    body: ["registered", "verified", "blocked"].map((s) => [
      s,
      data.statusCountsMale?.[s] || 0,
      data.statusCountsFemale?.[s] || 0,
      data.statusCounts?.[s] || 0,
    ]),
  };

  /* -------------------- Section Renderer -------------------- */
  const renderSection = (title, genderChartData, ref, categories, generalCounts, filename, tableObj) => (
    <div style={mainCard} ref={ref}>
      <div style={headerRow}>
        <h3>{title}</h3>
        <button
          style={downloadBtn}
          onClick={() => downloadAsPDF(ref, filename, title, tableObj)}
        >
          Download
        </button>
      </div>
      <div style={flexWrap}>
        <div style={halfCard}>
          <h4>By Gender</h4>
          <div style={{ height: 250 }}>
            <Bar data={genderChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div style={halfCard}>
          <h4>General (Percentage)</h4>
          <div style={{ height: 250 }}>
            <Pie data={generalData(categories, generalCounts)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );

  /* -------------------- Render UI -------------------- */
  return (
    <div style={{ padding: 20, marginLeft: 120 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Reports</h2>

      {/* Total Users & User Status */}
      <div style={{ ...flexWrap, marginBottom: 40 }}>
        <div style={smallCard} ref={totalUsersRef}>
          <div style={headerRow}>
            <h3>Total Users</h3>
            <button
              style={downloadBtn}
              onClick={() => downloadAsPDF(totalUsersRef, "total_users", "Total Users", totalUsersTable)}
            >
              Download
            </button>
          </div>
          <div style={{ height: 250 }}>
            <Bar
              data={{
                labels: ["Users"],
                datasets: [
                  {
                    label: "Male",
                    data: [data.genderCounts?.male || 0],
                    backgroundColor: "#36A2EB",
                  },
                  {
                    label: "Female",
                    data: [data.genderCounts?.female || 0],
                    backgroundColor: "#FF6384",
                  },
                ],
              }}
            />
          </div>
        </div>

        <div style={smallCard} ref={userStatusRef}>
          <div style={headerRow}>
            <h3>User Status</h3>
            <button
              style={downloadBtn}
              onClick={() =>
                downloadAsPDF(userStatusRef, "user_status", "User Status", statusUsersTable)
              }
            >
              Download
            </button>
          </div>
          <div style={{ height: 250 }}>
            <Bar data={userStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Face, Body, Height Sections */}
      {renderSection(
        "Face Shape Distribution",
        faceGenderData,
        faceRef,
        faceShapes,
        data.faceCounts,
        "face_distribution",
        faceTable
      )}

      {renderSection(
        "Body Type Distribution",
        bodyGenderData,
        bodyRef,
        bodyTypes,
        data.bodyCounts,
        "body_distribution",
        bodyTable
      )}

      {renderSection(
        "Height & Build Distribution",
        heightGenderData,
        heightRef,
        heightTypes,
        data.heightCounts,
        "height_distribution",
        heightTable
      )}
    </div>
  );
};

/* -------------------- Styles -------------------- */
const mainCard = {
  background: "#f9f9f9",
  padding: 20,
  borderRadius: 10,
  border: "2px solid #ccc",
  marginBottom: 40,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const smallCard = {
  background: "#fff",
  padding: 20,
  marginBottom: 30,
  borderRadius: 10,
  border: "2px solid #ccc",
  flex: "1 1 300px",
  minWidth: "300px",
  maxWidth: "45%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const flexWrap = { display: "flex", gap: 20, flexWrap: "wrap" };
const headerRow = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const downloadBtn = {
  padding: "6px 14px",
  border: "none",
  borderRadius: 6,
  background: "#36A2EB",
  color: "#fff",
  cursor: "pointer",
};
const halfCard = { flex: "1 1 300px", minWidth: "300px" };

export default AdminReports;