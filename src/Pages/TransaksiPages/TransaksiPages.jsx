import React, { useState } from "react";
import TableComponent from "../../Component/TableComponent/TableComponent";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";
import Swal from "sweetalert2";

const TransaksiPages = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrder();
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // first rendering
  useEffect(() => {
    document.title = "Admin - Data Transaksi";
    const interval = setInterval(() => {
      getOrder();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // getAll Ordering
  const getOrder = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/all-invoices", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (!result.status) {
      if (result.message === "Token is Expired") {
        Swal.fire({
          title: "Sesi Habis!",
          text: "Mohon maaf sesi anda telah habis! Silahkan login kembali!",
          icon: "error",
          confirmButtonText: "Login",
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDismissed) {
            localStorage.removeItem("token_admin");
            navigate("/login");
          }
        });
      }
    } else {
      if (JSON.stringify(result.orders) !== JSON.stringify(order)) {
        setOrder(result.invoice);
      }
      setLoading(false);
    }
  };
  const column = [
    { id: "tpemesanan", header: "Tanggal Pesan", accesor: "tanggal_pemesanan" },
    { id: "nama", header: "Nama", accesor: "nama" },
    { id: "tacara", header: "Tanggal Acara", accesor: "tanggal" },
    { id: "total", header: "Total Harga", accesor: "total" },
    { id: "status", header: "Status Pemesanan", accesor: "status" },
  ];

  return (
    <>
      <TitleComponent title="Data Transaksi" />
      <section className="p-3 border rounded bg-greys overflow-auto">{loading ? <LoadingComponent /> : <TableComponent data={order} header={column} sort="no_invoice" table="order" showTambahButton={false} />}</section>
    </>
  );
};

export default TransaksiPages;
