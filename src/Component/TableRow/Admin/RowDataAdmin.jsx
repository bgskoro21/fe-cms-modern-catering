import React from "react";

const RowDataAdmin = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td className="text-center">
        <div className="d-flex justify-content-center align-items-center">
          <img src={props.foto ? props.foto : "http://cdn.onlinewebfonts.com/svg/img_329115.png"} alt="Profile Admin" className="img-fluid rounded-circle profile-pic" />
        </div>
      </td>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>{props.hp}</td>
      <td>{props.alamat}</td>
      <td className="text-center">
        <button className="btn btn-sm bg-red ms-1" onClick={props.handleClickDelete}>
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default RowDataAdmin;
