import React from "react";

const RowTestimoni = (props) => {
  return (
    <tr className={`${props.status === "menunggu" ? "bg-light" : ""}`}>
      <td className="text-center">{props.no}</td>
      <td>{props.nama}</td>
      <td className="text-center">{props.nilai}</td>
      <td>{props.message}</td>
      <td>
        <span className={`badge bg-${props.status === "terima" ? "green" : "red"}`}>{props.status}</span>
      </td>
      <td className="text-center">
        <>
          {props.status !== "terima" ? (
            <button className="btn btn-sm bg-purple ms-1" onClick={props.onTerima}>
              Tampilkan
            </button>
          ) : (
            <button className="btn btn-sm bg-red ms-1" onClick={props.onTolak}>
              Berhenti
            </button>
          )}
        </>
      </td>
    </tr>
  );
};

export default RowTestimoni;
