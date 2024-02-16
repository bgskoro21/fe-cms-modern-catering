import React from "react";
import TableComponent from "../../Component/TableComponent/TableComponent";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import scrollToTop from "../../Utils/ScrollToTop";

const AdminPages = () => {
  const [admin, setAdmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const column = [
    { id: "gambar", header: "Foto Profil", accessor: "profile_pic" },
    { id: "nama", header: "Nama", accessor: "nama" },
    { id: "email", header: "Username", accessor: "email" },
    { id: "nohp", header: "No HP", accessor: "no_hp" },
    { id: "alamat", header: "Alamat", accessor: "alamat" },
  ];

  // first rendering
  useEffect(() => {
    scrollToTop();
    getDataAdmin();
    document.title = "Admin - Data Admin";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get data admin
  const getDataAdmin = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/admin", {
      method: "GET",
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
    setAdmin(result.admin);
    setLoading(false);
  };

  // handle Delete Admin
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Anda yakin ingin menghapus data ini?",
      icon: "warning",
      timer: 5000,
      showCancelButton: true,
      confirmButtonText: "Hapus Data",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/admin/" + id, {
          method: "DELETE",
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
        }

        toast.success(result.message);
        getDataAdmin();
      }
    });
  };

  return (
    <>
      <TitleComponent title="Data Admin" />
      <section className="p-3 border rounded bg-greys">{loading ? <LoadingComponent /> : <TableComponent header={column} data={admin} sort="name" table="admin" urlTambah="/tambah-admin" handleDelete={handleDelete} />}</section>
      <ToastContainer />
    </>
  );
};

export default AdminPages;
