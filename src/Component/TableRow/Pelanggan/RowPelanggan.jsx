import { format } from "date-fns";
import { id } from "date-fns/locale";
import React from "react";

const RowPelanggan = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td className="text-center">
        <div className="d-flex justify-content-center align-items-center">
          <img src={props.foto !== null ? props.foto : `https://tse2.mm.bing.net/th?id=OIP.rmim2jYzNpSCslo60INohQHaF9&pid=Api&P=0`} alt="Profile" className="img-fluid rounded-circle profile-pic" style={{ objectFit: "cover" }} />
        </div>
      </td>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>{props.verified ? format(new Date(props.verified), "EEEE, dd MMMM yyyy HH.mm", { locale: id }) : <div className="badge bg-danger">Belum Diverifikasi</div>}</td>
      <td className="text-center">
        <button className="btn btn-sm bg-red ms-1" onClick={props.handleClickDelete}>
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default RowPelanggan;
