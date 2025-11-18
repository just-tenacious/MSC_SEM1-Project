import React, { useState } from "react";
import data from "../data/recommendation-detail.json"; // Import static data

const AdminRecommendationDetail = () => {
  const [details, setDetails] = useState(data); // Static data as state
  const [search, setSearch] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowsPerPage = 5; // Rows per page

  // Filter data based on search input
  const filtered = details.filter(
    (row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
  );

  // Pagination logic: calculate total pages
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  // Calculate the rows to display for the current page
  const displayedRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to generate page numbers for pagination
  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div style={{ padding: "20px", marginLeft: "120px" }}>
      <h2>Recommendation Detail</h2>

      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search all fields"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to page 1 when search input changes
          }}
          style={inputStyle}
        />
      </div>

      {/* Table Display */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Body Type</th>
              <th style={thStyle}>Occasion</th>
              <th style={thStyle}>Footwear Pairing</th>
              <th style={thStyle}>Season</th>
              <th style={thStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.length > 0 ? (
              displayedRows.map((row, index) => (
                <tr key={row.id} style={trStyle}>
                  <td style={tdStyle}>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{row.img || "No image"}</td>
                  <td style={tdStyle}>{row.desc}</td>
                  <td style={tdStyle}>{row.gender}</td>
                  <td style={tdStyle}>
                    {Array.isArray(row.bodyType) ? row.bodyType.join(", ") : "N/A"}
                  </td>
                  <td style={tdStyle}>{row.occasion}</td>
                  <td style={tdStyle}>
                    {Array.isArray(row.footwearPairing) ? row.footwearPairing.join(", ") : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    {Array.isArray(row.season) ? row.season.join(", ") : "N/A"}
                  </td>
                  <td style={tdStyle}>{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "10px" }}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={paginationContainer}>
          {/* Previous Button */}
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              style={pageBtn}
            >
              Previous
            </button>
          )}

          {/* Page Numbers */}
          {generatePageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              style={{
                ...pageBtn,
                backgroundColor: p === currentPage ? "#4e73df" : "#eee",
                color: p === currentPage ? "#fff" : "#000",
              }}
            >
              {p}
            </button>
          ))}

          {/* Next Button */}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              style={pageBtn}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  marginBottom: "15px",
  padding: "8px",
  width: "300px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "1000px" };
const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
const thStyle = { padding: "10px", textAlign: "left" };
const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const trStyle = { transition: "background 0.3s" };
const pageBtn = { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };
const paginationContainer = { marginTop: "20px" };

export default AdminRecommendationDetail;


// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminRecommendationDetail = () => {
//   const [details, setDetails] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         // Replace with your API endpoint
//         const res = await axios.get("http://localhost:3001/recommendation-details");
//         const formatted = res.data.map((item, index) => ({
//           id: index + 1,
//           _id: item._id,
//           masterCategory: item.masterCategory || "N/A",
//           subCategory: item.subCategory || "N/A",
//           recommendation: item.recommendation || "—",
//           createdAt: new Date(item.createdAt).toLocaleString(),
//         }));
//         setDetails(formatted);
//       } catch (err) {
//         console.error("Error fetching recommendation details:", err);
//       }
//     };
//     fetchDetails();
//   }, []);

//   const filtered = details.filter(
//     (row) =>
//       row.masterCategory.toLowerCase().includes(search.toLowerCase()) ||
//       row.subCategory.toLowerCase().includes(search.toLowerCase()) ||
//       row.recommendation.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.ceil(filtered.length / rowsPerPage);
//   const displayedRows = filtered.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div style={{ padding: "20px", marginLeft: "120px" }}>
//       <h2>Recommendation Detail</h2>

//       {/* Search */}
//       <input
//         type="text"
//         placeholder="Search by category, sub-category, or recommendation"
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setCurrentPage(1);
//         }}
//         style={inputStyle}
//       />

//       {/* Table */}
//       <div style={{ overflowX: "auto" }}>
//         <table style={tableStyle}>
//           <thead>
//             <tr style={theadStyle}>
//               <th style={thStyle}>#</th>
//               <th style={thStyle}>Master Category</th>
//               <th style={thStyle}>Sub Category</th>
//               <th style={thStyle}>Recommendation</th>
//               <th style={thStyle}>Created At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedRows.length > 0 ? (
//               displayedRows.map((row) => (
//                 <tr key={row._id} style={trStyle}>
//                   <td style={tdStyle}>{row.id}</td>
//                   <td style={tdStyle}>{row.masterCategory}</td>
//                   <td style={tdStyle}>{row.subCategory}</td>
//                   <td style={tdStyle}>{row.recommendation}</td>
//                   <td style={tdStyle}>{row.createdAt}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
//                   No records found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div>
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//             <button
//               key={p}
//               onClick={() => setCurrentPage(p)}
//               style={{
//                 ...pageBtn,
//                 backgroundColor: p === currentPage ? "#4e73df" : "#eee",
//                 color: p === currentPage ? "#fff" : "#000",
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
// const inputStyle = {
//   marginBottom: "15px",
//   padding: "8px",
//   width: "300px",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
// };
// const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "600px" };
// const theadStyle = { backgroundColor: "#4e73df", color: "#fff" };
// const thStyle = { padding: "10px", textAlign: "left" };
// const tdStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
// const trStyle = { transition: "background 0.3s" };
// const pageBtn = { marginRight: "5px", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" };

// export default AdminRecommendationDetail;