import React from "react";

const RowBank = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td className="text-center">
        <img src={props.gambar} alt="Gambar Bank" className="img-fluid rounded" width={80} />
      </td>
      <td>{props.nama}</td>
      <td>{props.norek}</td>
      <td className="text-center">
        <button className="btn btn-sm btn-success ms-1" onClick={props.handleClickEdit}>
          <i className="bx bx-edit"></i>
        </button>
        <button className="btn btn-sm btn-danger ms-1" onClick={props.handleClickDelete}>
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default RowBank;
