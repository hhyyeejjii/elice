import React from "react";
import ReactLoading from "react-loading";

export default function Loading() {
  return (
    <ReactLoading
      type="spokes"
      style={{
        width: "100px",
        height: "100px",
      }}
    />
  );
}
