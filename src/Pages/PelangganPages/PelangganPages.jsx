import React, { useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import TableComponent from "../../Component/TableComponent/TableComponent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";

const PelangganPages = () => {
  const [pelanggan, setPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // column table
  const column = [
    { id: 0, header: "Profile Picture" },
    { id: 1, header: "Nama Pelanggan" },
    { id: 2, header: "Email Pelanggan" },
    { id: 3, header: "Terverifikasi" },
  ];
  // first rendering
  useEffect(() => {
    getAllPelanggan();
    document.title = "Admin - Data Pelanggan";
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get Pelanggan
  const getAllPelanggan = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/pelanggan", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    console.log(result);
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
      setPelanggan(result.pelanggan);
      setLoading(false);
    }
  };

  // handle delete pelanggan
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Pelanggan?",
      text: "Apakah kamu yakin menghapus pelanggan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus Pelanggan",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/pelanggan/" + id, {
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
        } else {
          toast.success(result.message);
          getAllPelanggan();
        }
      }
    });
  };

  return (
    <>
      <TitleComponent title="Data Pelanggan" />
      <section className="p-3 border rounded bg-greys overflow-auto">
        {loading ? <LoadingComponent /> : <TableComponent showTambahButton={false} data={pelanggan} header={column} sort="name" table="pelanggan" handleDelete={handleDelete} />}
      </section>
      <ToastContainer />
    </>
  );
};

export default PelangganPages;
