import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InputNamaComponent, InputDescriptionComponent, ButtonKategoriComponent, InputNumberComponent } from "../../Component/FormKategoriComponent/FormKategoriComponent";
import { ToastContainer } from "react-toastify";
import queryString from "query-string";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";
import Swal from "sweetalert2";

const FormTambahKategori = () => {
  // const [preview, setPreview] = useState("");
  const [nama, setNama] = useState("");
  const [desc, setDesc] = useState("");
  const [minOrder, setMinOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorNama, setErrorNama] = useState(false);
  const [messageNama, setMessageNama] = useState("");
  const [errorDesc, setErrorDesc] = useState(false);
  const [messageDesc, setMessageDesc] = useState("");
  // const [errorMinOrder, setErrorMinOrder] = useState(false);
  // const [messageMinOrder, setMessageMinOrder] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const values = queryString.parse(location.search);

  // FIrst Rendering
  useEffect(() => {
    if (values.tipe === "edit") {
      getKategoriById();
    }
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // handle get Kategori By Id
  const getKategoriById = async () => {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/kategori/" + values.kategori);
    const result = await response.json();
    setNama(result.kategori.nama_kategori);
    setDesc(result.kategori.description);
    // setMinOrder(result.kategori.min_order);
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    setLoadingSubmit(true);
    event.preventDefault();
    const form = new FormData();
    let url = "";
    form.append("nama_kategori", nama);
    form.append("description", desc);
    form.append("min_order", minOrder);
    if (values.tipe === "tambah") {
      url += "http://127.0.0.1:8000/api/kategori/";
    } else {
      url += "http://127.0.0.1:8000/api/kategori/" + values.kategori;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();

    if (result.status === false) {
      if (result.message === "Token is Expired") {
        localStorage.removeItem("token_admin");
        navigate("/login");
      } else if (result.form_validation) {
        // Validasi Min Order
        // setErrorMinOrder(result.message.hasOwnProperty("min_order") ? true : false);
        // setMessageMinOrder(result.message.hasOwnProperty("min_order") ? result.message.min_order[0] : "");
        // Validasi Deskripsi
        setErrorDesc(result.message.hasOwnProperty("description") ? true : false);
        setMessageDesc(result.message.hasOwnProperty("description") ? result.message.description[0] : "");
        // Validasi Nama
        setErrorNama(result.message.hasOwnProperty("nama_kategori") ? true : false);
        setMessageNama(result.message.hasOwnProperty("nama_kategori") ? result.message.nama_kategori[0] : "");
      }
      setLoadingSubmit(false);
    } else {
      Swal.fire({
        title: "Sukses!",
        text: result.message + ` Apakah anda ingin ${values.tipe === "tambah" ? "input" : "update"} kategori lagi?`,
        icon: "success",
        confirmButtonText: "Ya",
        showCancelButton: true,
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed && values.tipe === "tambah") {
          handleReset();
        } else {
          navigate("/kategori");
        }
      });
      if (values.tipe === "tambah") {
        setNama("");
        setDesc("");
        // setPreview("");
        setMinOrder(0);
      }
      setLoadingSubmit(false);
      // Validasi Min Order
      // setErrorMinOrder(false);
      // setMessageMinOrder("");
      // Validasi Deskripsi
      setErrorDesc(false);
      setMessageDesc("");
      // Validasi Nama
      setErrorNama(false);
      setMessageNama("");
      // navigate("/kategori");
    }
  };

  const handleReset = () => {
    setNama("");
    setDesc("");
    setMinOrder("");
  };
  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="overflow-auto">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <Link to="/kategori" className="text-decoration-none d-flex align-items-center">
            <i className="bx bxs-left-arrow-square fs-2 text-blue"></i>&nbsp;
          </Link>
          <span className="fs-4 fw-bold">Form {values.tipe === "tambah" ? "Tambah" : "Ubah"} Kategori</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <InputNamaComponent
              handleNamaChange={(event) => {
                setNama(event.target.value);
                setErrorNama(false);
              }}
              nama={nama}
              label="Nama Kategori"
              isInvalid={errorNama}
              message={messageNama}
            />
            {/* <InputNumberComponent
              label="Minimal Order"
              harga={minOrder}
              handleNumberChange={(event) => {
                setMinOrder(event.target.value);
                setErrorMinOrder(false);
              }}
              isInvalid={errorMinOrder}
              message={messageMinOrder}
            /> */}
            <InputDescriptionComponent
              handleDescChange={(value) => {
                setDesc(value);
                setErrorDesc(false);
              }}
              desc={desc}
              isInvalid={errorDesc}
              message={messageDesc}
            />
            <hr />
            {/* <ButtonKategoriComponent handleResetClick={() => setPreview("")} loading={loadingSubmit} /> */}
            <ButtonKategoriComponent loading={loadingSubmit} />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormTambahKategori;
