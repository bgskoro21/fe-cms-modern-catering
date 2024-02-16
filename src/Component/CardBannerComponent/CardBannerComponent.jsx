import React from "react";

const CardBannerComponent = ({ banner, handleEdit, handleDelete, isDefault = false }) => {
  return (
    <div className="col-md-2 d-flex flex-column mb-2">
      <div className="img-wapper">
        <img src={banner} alt="Banner" className="img-fluid rounded mb-3" />
      </div>
      {!isDefault ? (
        <div className="d-flex justify-content-center">
          <button className="btn btn-sm bg-purple ms-1" onClick={handleEdit}>
            <i className="bx bx-edit"></i>
          </button>
          <button className="btn btn-sm bg-red ms-1" onClick={handleDelete}>
            <i className="bx bx-trash"></i>
          </button>
        </div>
      ) : (
        <span className="text-center">No Action</span>
      )}
    </div>
  );
};

export default CardBannerComponent;
