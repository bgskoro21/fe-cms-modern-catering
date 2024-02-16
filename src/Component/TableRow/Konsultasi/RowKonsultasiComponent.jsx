import React from "react";

const RowKonsultasiComponent = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td>{props.nama}</td>
      <td>{props.no_hp}</td>
      <td>{props.pesan}</td>
      <td>
        <div className={`badge ${props.status === "Dibalas" ? "bg-green" : "bg-danger"}`}>{props.status}</div>
      </td>
      <td className="text-center">
        <button className="btn bg-purple" onClick={props.handleClickReply} disabled={props.status === "Dibalas"}>
          <i className="bx bx-reply"></i>
        </button>
      </td>
    </tr>
  );
};

export default RowKonsultasiComponent;
