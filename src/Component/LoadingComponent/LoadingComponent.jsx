import React from "react";

const LoadingComponent = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-grow bg-red" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow bg-red mx-1" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow bg-red" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingComponent;
