import React from "react";
export default function SortHeader({ label, field, sort, setSort }) {
  const [key, dir] = sort.split(":");
  const isActive = key === field;
  const nextDir = isActive && dir === "asc" ? "desc" : "asc";
  return (
    <th onClick={() => setSort(`${field}:${nextDir}`)}>
      {label} {isActive ? (dir === "asc" ? "▲" : "▼") : ""}
    </th>
  );
}
