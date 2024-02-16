import React from "react";
import { Link } from "react-router-dom";
import "./RowKategori.css";

const TableRowKategoriComponent = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td style={{ width: "20%" }}>{props.nama_kategori}</td>
      <td className="desc-width">{<div dangerouslySetInnerHTML={{ __html: props.description }} />}</td>
      <td className="text-center">
        <Link to={`/kategori/form_kategori?tipe=edit&kategori=${props.id}`} className="btn btn-sm bg-purple">
          <i className="bx bx-edit-alt"></i>
        </Link>
        <button className="btn btn-sm bg-red ms-1" onClick={props.handleClickDelete}>
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default TableRowKategoriComponent;
