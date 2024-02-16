import React from "react";
import { Link } from "react-router-dom";
import formatRupiah from "../../../Utils/FormatRupiah";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const RowOrder = (props) => {
  return (
    <tr>
      <td style={{ width: "20%" }}>{props.no}</td>
      <td>{format(new Date(props.tpemesanan), "EEEE, dd MMMM yyyy HH:mm", { locale: id })}</td>
      <td>{props.nama}</td>
      <td>{format(new Date(props.tacara), "EEEE, dd MMMM yyyy", { locale: id })}</td>
      <td>{formatRupiah(props.total)}</td>
      <td>
        <span
          className={`badge ${props.status === "Selesai" || props.status === "Diproses" || props.status === "Booked" || props.status === "Tanggal Booked" ? "bg-green" : ""} ${props.status === "Menunggu Persetujuan" ? "bg-blue" : ""} ${
            props.status === "Dibatalkan" || props.status === "Ditolak" || props.status.includes("Pending") ? "bg-red" : ""
          } ${props.status === "Belum DP" || props.status === "Menunggu Pelunasan" ? "bg-purple" : ""}`}
        >
          {props.status}
        </span>
      </td>
      <td className="text-center">
        <Link className="btn bg-purple" to={`/data-transaksi/detail/${props.id}`}>
          <i className="bx bx-detail"></i>
        </Link>
      </td>
    </tr>
  );
};

export default RowOrder;
