import React from "react";
import { Link } from "react-router-dom";
import formatRupiah from "../../../Utils/FormatRupiah";

const TableRowPaketComponent = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td>{props.kategori}</td>
      <td className="text-center" style={{ width: "20%" }}>
        <img src={props.gambar} alt="Paket" className="img-fluid rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
      </td>
      <td>{props.nama}</td>
      <td className="text-start" style={{ width: "12%" }}>
        {formatRupiah(props.harga)}/{props.satuan}
      </td>
      <td>
        <div className="d-flex justify-content-center align-items-center">
          <button className={`btn btn-sm ${props.andalan ? "bg-red" : "bg-green"}`} onClick={props.handleClickAndalan}>
            {props.andalan ? "Berhenti Andalan" : "Andalan"}
          </button>
          &nbsp;
          <button className={`btn btn-sm ${props.release ? "bg-red" : "bg-purple"}`} onClick={props.handleClickRelease}>
            {props.release ? "Berhenti Release" : "Release"}
          </button>
        </div>
      </td>
      <td>
        <div className="d-flex justify-content-center align-items-center">
          {props.kategori !== "Pondokkan Tambahan" && (
            <Link to={`/paket/menu-paket/${props.id}`} className="btn btn-sm bg-blue">
              <i className="bx bx-food-menu"></i>
            </Link>
          )}
          &nbsp;
          <Link to={`/paket/galery/${props.id}`} className="btn btn-sm bg-green">
            <i className="bx bxs-image-add"></i>
          </Link>
          &nbsp;
          <Link to={`/paket/form_paket?tipe=edit&paket=${props.id}`} className="btn btn-sm bg-purple">
            <i className="bx bx-edit-alt"></i>
          </Link>
          &nbsp;
          <button className="btn btn-sm btn-warning" onClick={props.openModal}>
            <i className="bx bxs-bullseye"></i>
          </button>
          &nbsp;
          <button className="btn btn-sm bg-red" onClick={props.handleClickDelete}>
            <i className="bx bx-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRowPaketComponent;
