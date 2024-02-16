import React from "react";
import "./TitleComponent.css";

const TitleComponent = ({ title }) => {
  return (
    <section className="title p-3 border rounded mb-2 bg-greys">
      <h1>{title}</h1>
    </section>
  );
};

export default TitleComponent;
