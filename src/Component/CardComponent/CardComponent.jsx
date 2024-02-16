import React from "react";
import "./CardComponent.css";
import { Link } from "react-router-dom";

const CardComponent = ({ bgBody, jumlah, title, url, icon }) => {
  return (
    <div className={`card ${bgBody}`}>
      <div className={`card-body`}>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <h2 className="fw-bold">{jumlah}</h2>
            <span className="title">{title}</span>
          </div>
          <div className="col-md-6 d-none d-md-flex icon-card justify-content-end text-muted">
            <i className={`bx ${icon}`}></i>
          </div>
        </div>
      </div>
      <div className={`card-footer`}>
        <div className="d-flex justify-content-center align-items-center">
          <Link to={url} className="text-decoration-none text-dark link-detail">
            Selengkapnya
          </Link>
          <i className="bx bx-right-arrow-circle"></i>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
