import React, { useState, useEffect } from "react";

const AdminBody = () => {
  const [bodyEntries, setBodyEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch body data from backend
  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/body-type"); // adjust endpoint
        if (!response.ok) throw new Error("Failed to fetch body types");
        const data = await response.json();
        setBodyEntries(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBodyTypes();
  }, []);

  const filtered = bodyEntries.filter(
    (entry) =>
      entry.userName?.toLowerCase().includes(search.toLowerCase()) ||
      entry.gender?.toLowerCase().includes(search.toLowerCase()) ||
      entry.shoulderWidth?.toString().includes(search) ||
      entry.bust?.toString().includes(search) ||
      entry.waist?.toString().includes(search) ||
      entry.hips?.toString().includes(search) ||
      entry.body_shape?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Body Shape Entries</h2>

      <input
        type="text"
        placeholder="Search by name, gender, measurements, or shape"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          marginBottom: "15px",
          padding: "8px",
          width: "300px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
        <thead>
          <tr style={{ backgroundColor: "#4e73df", color: "#fff" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Gender</th>
            <th style={thStyle}>Shoulder Width</th>
            <th style={thStyle}>Bust/Chest</th>
            <th style={thStyle}>Waist</th>
            <th style={thStyle}>Hips</th>
            <th style={thStyle}>Shape</th>
          </tr>
        </thead>
        <tbody>
          {displayedRows.length > 0 ? (
            displayedRows.map((entry, idx) => (
              <tr key={entry._id} style={trStyle}>
                <td style={tdStyle}>{idx + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td style={tdStyle}>{entry.userName}</td>
                <td style={tdStyle}>{entry.gender}</td>
                <td style={tdStyle}>{entry.shoulderWidth}</td>
                <td style={tdStyle}>{entry.bust}</td>
                <td style={tdStyle}>{entry.waist}</td>
                <td style={tdStyle}>{entry.hips}</td>
                <td style={tdStyle}>{entry.body_shape}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                backgroundColor: p === currentPage ? "#4e73df" : "#eee",
                color: p === currentPage ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };

export default AdminBody;


// import React, { useState } from "react";

// const AdminBody = () => {
//   // Dummy body measurement data
//   const [bodyEntries] = useState([
//     { gender: "female", shoulderWidth: 42, bust: 88, waist: 65, hips: 92, shape: "Hourglass" },
//     { gender: "male", shoulderWidth: 50, bust: 100, waist: 85, hips: 95, shape: "Inverted Triangle" },
//     { gender: "female", shoulderWidth: 38, bust: 80, waist: 70, hips: 100, shape: "Pear (Triangle)" },
//     { gender: "female", shoulderWidth: 40, bust: 85, waist: 75, hips: 85, shape: "Rectangle (Athletic)" },
//     { gender: "male", shoulderWidth: 52, bust: 105, waist: 95, hips: 100, shape: "Apple (Round/Oval)" },
//     { gender: "female", shoulderWidth: 38, bust: 80, waist: 70, hips: 100, shape: "Pear (Triangle)" },
//     { gender: "female", shoulderWidth: 40, bust: 85, waist: 75, hips: 85, shape: "Rectangle (Athletic)" },
//     { gender: "male", shoulderWidth: 52, bust: 105, waist: 95, hips: 100, shape: "Apple (Round/Oval)" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   const filtered = bodyEntries.filter(
//     (entry) =>
//       entry.gender.toLowerCase().includes(search.toLowerCase()) ||
//       entry.shoulderWidth.toString().includes(search) ||
//       entry.bust.toString().includes(search) ||
//       entry.waist.toString().includes(search) ||
//       entry.hips.toString().includes(search) ||
//       entry.shape.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / rowsPerPage);
//   const displayedRows = filtered.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div style={{ padding: "20px", marginLeft: "120px" }}>
//       <h2>Body Shape Entries</h2>

//       <input
//         type="text"
//         placeholder="Search by gender, measurements, or shape"
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setCurrentPage(1);
//         }}
//         style={{
//           marginBottom: "15px",
//           padding: "8px",
//           width: "300px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//         }}
//       />

//       <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#4e73df", color: "#fff" }}>
//             <th style={thStyle}>ID</th>
//             <th style={thStyle}>Gender</th>
//             <th style={thStyle}>Shoulder Width</th>
//             <th style={thStyle}>Bust/Chest</th>
//             <th style={thStyle}>Waist</th>
//             <th style={thStyle}>Hips</th>
//             <th style={thStyle}>Shape</th>
//           </tr>
//         </thead>
//         <tbody>
//           {displayedRows.length > 0 ? (
//             displayedRows.map((entry, idx) => (
//               <tr key={idx} style={trStyle}>
//                 <td style={tdStyle}>{idx + 1 + (currentPage - 1) * rowsPerPage}</td>
//                 <td style={tdStyle}>{entry.gender}</td>
//                 <td style={tdStyle}>{entry.shoulderWidth}</td>
//                 <td style={tdStyle}>{entry.bust}</td>
//                 <td style={tdStyle}>{entry.waist}</td>
//                 <td style={tdStyle}>{entry.hips}</td>
//                 <td style={tdStyle}>{entry.shape}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center", padding: "10px" }}>
//                 No records found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//             <button
//               key={p}
//               onClick={() => setCurrentPage(p)}
//               style={{
//                 marginRight: "5px",
//                 padding: "5px 10px",
//                 backgroundColor: p === currentPage ? "#4e73df" : "#eee",
//                 color: p === currentPage ? "#fff" : "#000",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               {p}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Styles
// const thStyle = { padding: "10px", textAlign: "left" };
// const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
// const trStyle = { transition: "background 0.3s" };

// export default AdminBody;
