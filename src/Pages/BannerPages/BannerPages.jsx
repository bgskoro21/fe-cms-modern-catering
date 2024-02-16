import React from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { useState } from "react";
import CardBannerComponent from "../../Component/CardBannerComponent/CardBannerComponent";
import { useEffect } from "react";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import scrollToTop from "../../Utils/ScrollToTop";

const BannerPages = () => {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [idBanner, setIdBanner] = useState(0);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState([]);
  const [errorFile, setErrorFile] = useState(false);
  const [messageFile, setMessageFile] = useState("");
  const [tipeSubmit, setTipeSubmit] = useState("");
  const navigate = useNavigate();
  //   first rendering
  useEffect(() => {
    document.title = "Admin - Data Banner";
    scrollToTop();
    getBanner();
  }, []);
  //   get All Banner
  const getBanner = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/banner");
    const result = await response.json();
    setBanner(result.banner);
    setLoading(false);
  };
  //   handleShow Modal Tambah
  const handleShowTambah = () => {
    setShow(true);
    setTipeSubmit("tambah");
    setTitleModal("Tambah Banner");
  };
  //   handle file change
  const handleFileChange = (e) => {
    setFile(Array.from(e.target.files));
    // const imageUrl = URL.createObjectURL(e.target.files[0]);
    // setPreview(imageUrl);
  };
  //   handle Reset
  const handleReset = () => {
    setFile([]);
    setPreview("");
  };
  //   handleClose Modal
  const handleClose = () => {
    setShow(false);
    handleReset();
    setErrorFile(false);
    setMessageFile("");
  };
  //   handleSubmit
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    const urlTambah = "http://127.0.0.1:8000/api/banner";
    const urlEdit = "http://127.0.0.1:8000/api/banner/" + idBanner;
    const form = new FormData();
    if (file.length > 0) {
      file.forEach((file) => {
        form.append("banner[]", file);
      });
    }
    const response = await fetch(tipeSubmit === "tambah" ? urlTambah : urlEdit, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();
    // console.log(result);
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
      if (result.hasOwnProperty("form_validation")) {
        setErrorFile(true);
        setMessageFile(result.message.banner);
      }
      setLoadingSubmit(false);
    } else {
      toast.success(result.message);
      getBanner();
      handleReset();
      handleClose();
      setLoadingSubmit(false);
    }
  };
  //   handle delete banner
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Banner?",
      text: "Apakah anda yakin menghapus banner ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus Data",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/banner/" + id, {
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
        } else {
          toast.success(result.message);
          getBanner();
        }
      }
    });
  };
  //   get banner by id
  const getBannerById = async (id) => {
    const response = await fetch("http://127.0.0.1:8000/api/banner/" + id, {
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
    } else {
      setPreview(result.banner.banner);
    }
  };
  //   handleEdit
  const handleEdit = (id) => {
    setShow(true);
    setTitleModal("Ubah Banner");
    setTipeSubmit("edit");
    setLoadingSubmit(false);
    getBannerById(id);
    setIdBanner(id);
  };
  return (
    <>
      <TitleComponent title="Data Banner" />
      <section className="p-3 rounded border bg-greys">
        <div className="d-flex justify-content-center mb-3">
          <button className="btn bg-blue" onClick={handleShowTambah}>
            <i className="bx bx-plus-circle"></i> Tambah Data
          </button>
        </div>
        {loading ? (
          <LoadingComponent />
        ) : banner.length !== 0 ? (
          <div className="row p-3 d-flex">
            {banner.map((item, index) => (
              <CardBannerComponent key={index} banner={item.banner} handleDelete={() => handleDelete(item.id)} handleEdit={() => handleEdit(item.id)} />
            ))}
          </div>
        ) : (
          <div className="alert alert-secondary text-center" role="alert">
            Belum ada banner!
          </div>
        )}
      </section>
      <ModalComponent show={show} handleClose={handleClose} loading={loadingSubmit} title={titleModal} handleSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="fw-bold mb-2">Gambar Banner</label>
          <br />
          {preview && <img src={preview} alt="Gambar Bank" className="img-fluid rounded mb-3" width={80} />}
          <input type="file" className={`form-control ${errorFile ? "is-invalid" : ""}`} placeholder="Masukkan Gambar Bank" multiple={tipeSubmit === "tambah"} onChange={handleFileChange} accept="image/*" />
          {errorFile && <div className="invalid-feedback">{messageFile}</div>}
        </div>
      </ModalComponent>
      <ToastContainer />
    </>
  );
};

export default BannerPages;
