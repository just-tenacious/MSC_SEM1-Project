import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';

const IconPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    if (search.length < 2) return;
    
    const fetchIcons = async () => {
      try {
        const res = await fetch(`https://api.iconify.design/search?query=${search}&limit=20`);
        const data = await res.json();
        setIcons(data.icons || []);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchIcons();
  }, [search]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Search fashion icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "250px", marginBottom: "10px" }}
      />
      {icons.length > 0 && (
        <div style={{
          position: "absolute",
          top: "40px",
          left: 0,
          border: "1px solid #ccc",
          borderRadius: "4px",
          backgroundColor: "#fff",
          zIndex: 1000,
          maxHeight: "200px",
          overflowY: "auto",
          width: "250px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "5px",
          padding: "5px"
        }}>
          {icons.map((icon) => (
            <div
              key={icon.name}
              onClick={() => onSelect(icon.name)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <Icon icon={icon.name} width="40" height="40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconPicker;
