import React, { useEffect, useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import TableComponent from "../../Component/TableComponent/TableComponent";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";

const KonsultasiPelangganPages = () => {
  const [konsultasi, setKonsultasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [idKonsul, setIdKonsul] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    handleGetKonsultasi();
    // eslint-disable-next-line
  }, []);

  //   header
  const header = [
    { id: 1, header: "Nama" },
    { id: 2, header: "Nomor HP" },
    { id: 3, header: "Pesan" },
    { id: 4, header: "Status" },
  ];

  //   handle get Konsultasi
  const handleGetKonsultasi = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/konsultasi", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        },
      });
      const result = await response.json();
      //   console.log(result);
      if (result.status) {
        setKonsultasi(result.konsultasi);
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
    } catch (error) {
      console.log(error);
    }
  };

  //   handle reply message
  const handleReply = (id) => {
    setIdKonsul(id);
    setShow(true);
  };

  //   handle close Modal
  const handleCloseModal = () => {
    setShow(false);
    setIdKonsul(0);
    setMessage("");
  };

  // handle validate form reply
  const validateForm = () => {
    let formIsValid = true;
    let newError = "";

    if (!message) {
      formIsValid = false;
      newError = "Harap isi pesan terlebih dahulu!";
    }

    setError(newError);
    return formIsValid;
  };

  //   handle Submit Reply
  const handleSubmitReply = async () => {
    if (validateForm()) {
      setLoadingSubmit(true);
      try {
        const form = new FormData();
        form.append("id", idKonsul);
        form.append("message", message);
        const response = await fetch("http://127.0.0.1:8000/api/admin-reply", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
          },
          body: form,
        });
        const result = await response.json();
        if (result.status) {
          Swal.fire({
            title: "Sukses!",
            text: result.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          });
          setIdKonsul(0);
          setMessage("");
          setShow(false);
          setError("");
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
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
    handleGetKonsultasi();
  };
  return (
    <>
      <TitleComponent title="Konsultasi Pelanggan" />
      <section id="konsultasi" className="p-3 bg-white rounded overflow-auto">
        {loading ? <LoadingComponent /> : <TableComponent showTambahButton={false} data={konsultasi} header={header} sort="name" table="konsultasi" handleEdit={handleReply} />}
      </section>
      <ModalComponent show={show} handleClose={handleCloseModal} title="Balas Pesan" loading={loadingSubmit} handleSubmit={handleSubmitReply}>
        <div className="mb-3">
          <label htmlFor="pesan" className="form-label">
            Pesan
          </label>
          <textarea className={`form-control ${error ? "is-invalid" : ""}`} id="pesan" required value={message} onChange={(e) => setMessage(e.target.value)} style={{ height: "200px" }}></textarea>
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      </ModalComponent>
    </>
  );
};

export default KonsultasiPelangganPages;
