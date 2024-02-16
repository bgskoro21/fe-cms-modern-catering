import React, { useEffect, useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TableComponent from "../../Component/TableComponent/TableComponent";
import { ToastContainer, toast } from "react-toastify";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";

const TestimoniPages = () => {
  const [testi, setTesti] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const headers = [
    { id: 0, header: "Nama" },
    { id: 1, header: "Nilai" },
    { id: 2, header: "Pesan" },
    { id: 3, header: "Status" },
  ];

  //   Side Effect
  useEffect(() => {
    document.title = "Admin - Testimoni";
    getTestimoni();
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   get Testimoni
  const getTestimoni = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/testimoni", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setTesti(result.testimoni);
    } else {
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
    setLoading(false);
  };

  //   handle Edit
  const handleEdit = async (id, tipe) => {
    const response = await fetch("http://127.0.0.1:8000/api/testimoni/" + id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tipe: tipe }),
    });
    const result = await response.json();
    if (result.status) {
      toast.success(result.message);
      getTestimoni();
    } else {
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
      } else {
        Swal.fire({
          title: "Peringatan!",
          text: result.message,
          icon: "warning",
          confirmButtonText: "Ya",
          showCancelButton: "Tidak",
        }).then(async (result) => {
          // console.log(result);
          if (result.isConfirmed) {
            const response = await fetch("http://127.0.0.1:8000/api/testimoni/" + id, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ tipe: tipe, ok: "ya" }),
            });
            const result = await response.json();
            if (result.status) {
              toast.success(result.message);
              getTestimoni();
            } else {
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
          }
        });
      }
    }
  };
  return (
    <>
      <TitleComponent title="Testimoni Pelanggan" />
      <section className="p-4 border rounded bg-greys overflow-auto">{loading ? <LoadingComponent /> : <TableComponent showTambahButton={false} data={testi} header={headers} table="testimoni" handleEdit={handleEdit} />}</section>
      <ToastContainer />
    </>
  );
};

export default TestimoniPages;
