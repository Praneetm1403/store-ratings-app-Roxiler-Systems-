import React from "react";
export default function Stars({ value=0 }) {
  const v = Math.round(value);
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => <span key={i} className="star">{i<=v ? "★" : "☆"}</span>)}
    </span>
  );
}
