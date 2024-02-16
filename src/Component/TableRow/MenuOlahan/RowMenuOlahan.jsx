import React from "react";
import { Link } from "react-router-dom";

export const RowMenuOlahan = (props) => {
  return (
    <tr>
      <td className="text-center">{props.no}</td>
      <td>{props.menu}</td>
      <td className="text-center">
        {!props.submenu && (
          <Link className="btn btn-sm bg-blue ms-1" to={"/menu/submenu/" + props.id}>
            <i className="bx bx-food-menu"></i>
          </Link>
        )}
        <button className="btn btn-sm bg-purple ms-1" onClick={props.handleClickEdit}>
          <i className="bx bx-edit"></i>
        </button>
        <button className="btn btn-sm bg-red ms-1" onClick={props.handleClickDelete}>
          <i className="bx bx-trash"></i>
        </button>
      </td>
    </tr>
  );
};
