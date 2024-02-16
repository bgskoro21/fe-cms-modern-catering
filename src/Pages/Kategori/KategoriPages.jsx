import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TableComponent from "../../Component/TableComponent/TableComponent";
import "./Kategori.css";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";

const KategoriPages = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state && location.state.message;

  if (message) {
    toast.success(message);
  }

  const column = [
    { id: "nama_kategori", header: "Nama Kategori", accessor: "nama_kategori" },
    { id: "desc", header: "Deskripsi", accessor: "description" },
  ];

  const getKategori = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/kategori");
    const result = await response.json();
    setKategori(result.kategori);
    setLoading(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      icon: "warning",
      text: "Apakah anda yakin?",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/kategori/" + id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
          },
        });

        const result = await response.json();
        if (!result.status) {
          if (result.message === "Token is Expired") {
            localStorage.removeItem("token_admin");
            navigate("/login");
          }
        }
        toast.success(result.message);
        getKategori();
      }
    });
  };

  useEffect(() => {
    getKategori();
    document.title = "Admin - Data Kategori";
    scrollToTop();
  }, []);

  return (
    <>
      <ToastContainer />
      <TitleComponent title="Data Kategori" />
      <section className="p-3 border rounded mb-2 bg-greys overflow-auto">
        {loading ? <LoadingComponent /> : <TableComponent data={kategori} header={column} table="kategori" urlTambah="/kategori/form_kategori?tipe=tambah" handleDelete={handleDelete} />}
      </section>
    </>
  );
};

export default KategoriPages;
