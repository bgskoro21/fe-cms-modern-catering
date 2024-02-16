import React, { useEffect, useRef } from "react";
import { InputNamaComponent, InputFileComponent, ButtonKategoriComponent, InputSelectComponent, InputNumberComponent, InputDescriptionComponent } from "../../Component/FormKategoriComponent/FormKategoriComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import queryString from "query-string";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";

const TambahPaketPages = () => {
  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [idKategori, setIdKategori] = useState(0);
  const [errorKategori, setErrorKategori] = useState(false);
  const [messageKategori, setMessageKategori] = useState("");
  const [errorNama, setErrorNama] = useState(false);
  const [messageNama, setMessageNama] = useState("");
  const [errorHarga, setErrorHarga] = useState(false);
  const [messageHarga, setMessageHarga] = useState("");
  const [errorFile, setErrorFile] = useState(false);
  const [messageFile, setMessageFile] = useState("");
  const [errorDesc, setErrorDesc] = useState(false);
  const [messageDesc, setMessageDesc] = useState("");
  const [errorMinOrder, setErrorMinOrder] = useState(false);
  const [messageMinOrder, setMessageMinOrder] = useState("");
  const [errorUnit, setErrorUnit] = useState(false);
  const [messageUnit, setMessageUnit] = useState("");
  const [minOrder, setMinOrder] = useState(0);
  const [unit, setUnit] = useState(0);
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState(0);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const location = useLocation();
  const values = queryString.parse(location.search);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const satuan = [
    { id: "porsi", nama_kategori: "porsi" },
    { id: "pyrex", nama_kategori: "pyrex" },
    { id: "ekor", nama_kategori: "ekor" },
    { id: "pcs", nama_kategori: "pcs" },
    { id: "tampah", nama_kategori: "tampah" },
  ];

  const getKategori = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/kategori");
    const result = await response.json();
    setKategori(result.kategori);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    let url = "";
    setLoadingSubmit(true);
    e.preventDefault();
    if (values.tipe === "tambah") {
      url += "http://127.0.0.1:8000/api/paket_prasmanan";
    } else {
      url += "http://127.0.0.1:8000/api/paket_prasmanan/" + values.paket;
    }

    const form = new FormData();
    form.append("nama_paket", nama);
    if (idKategori !== 0) {
      form.append("kategori_id", idKategori);
    }
    form.append("harga", harga);
    if (file !== null) {
      form.append("gambar_paket", file);
    }
    if (desc !== "") {
      form.append("description", desc);
    }
    if (minOrder !== 0) {
      form.append("min_order", minOrder);
    }
    if (unit !== 0) {
      form.append("satuan", unit);
    }
    console.log(unit);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();
    console.log(result);
    if (!result.status) {
      if (result.message === "Token is Expired") {
        localStorage.removeItem("token_admin");
        navigate("/login");
      } else if (result.hasOwnProperty("form_validation")) {
        // Validation Kategori
        setErrorKategori(result.message.hasOwnProperty("kategori_id") || idKategori === 0 ? true : false);
        setMessageKategori(result.message.hasOwnProperty("kategori_id") ? result.message.kategori_id[0] : false);
        // Validation Nama Paket
        setErrorNama(result.message.hasOwnProperty("nama_paket") ? true : false);
        setMessageNama(result.message.hasOwnProperty("nama_paket") ? result.message.nama_paket[0] : false);
        // Validation Harga Paket
        setErrorHarga(result.message.hasOwnProperty("harga") ? true : false);
        setMessageHarga(result.message.hasOwnProperty("harga") ? result.message.harga[0] : false);
        // Validation Harga Paket
        setErrorFile(result.message.hasOwnProperty("gambar_paket") ? true : false);
        setMessageFile(result.message.hasOwnProperty("gambar_paket") ? result.message.gambar_paket[0] : false);
        // Validation Harga Paket
        setErrorDesc(result.message.hasOwnProperty("description") ? true : false);
        setMessageDesc(result.message.hasOwnProperty("description") ? result.message.description[0] : false);
        // Validation Min Order
        setErrorMinOrder(result.message.hasOwnProperty("min_order") ? true : false);
        setMessageMinOrder(result.message.hasOwnProperty("min_order") ? result.message.min_order[0] : false);
        // Validation Unit
        setErrorUnit(result.message.hasOwnProperty("satuan") ? true : false);
        setMessageUnit(result.message.hasOwnProperty("satuan") ? result.message.satuan[0] : false);
        setLoadingSubmit(false);
      }
    } else {
      // toast.success(result.message);
      Swal.fire({
        title: "Sukses!",
        text: result.message + ` Apakah anda ingin ${values.tipe === "tambah" ? "input" : "update"} paket lagi?`,
        icon: "success",
        confirmButtonText: "Ya",
        showCancelButton: true,
        cancelButtonText: "Tidak",
      }).then((result) => {
        if (result.isConfirmed && values.tipe === "tambah") {
          handleReset();
        } else {
          navigate("/paket");
        }
      });
      setLoadingSubmit(false);
      // Clear Validation
      // Validation Kategori
      setErrorKategori(false);
      setMessageKategori("");
      // Validation Nama Paket
      setErrorNama(false);
      setMessageNama("");
      // Validation Harga Paket
      setErrorHarga(false);
      setMessageHarga("");
      // Validation Harga Paket
      setErrorFile(false);
      setMessageFile("");
      // Validation Harga Paket
      setErrorDesc(false);
      setMessageDesc("");
      // Validation min order
      setErrorMinOrder(false);
      setMessageMinOrder("");
      // Validation Unit
      setErrorMinOrder(false);
      setMessageMinOrder(0);
    }
  };

  const handleReset = () => {
    setNama("");
    setIdKategori(0);
    setHarga(0);
    setPreview("");
    setDesc("");
    setMinOrder(0);
    setUnit(0);
    setFile();
    fileInputRef.current.value = null;
  };

  const getPaketById = async () => {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/paket_prasmanan/" + values.paket);
    const result = await response.json();
    setNama(result.paket.nama_paket);
    setIdKategori(result.paket.kategori_id);
    setHarga(result.paket.harga);
    setPreview(result.paket.gambar_paket);
    setDesc(result.paket.description);
    setUnit(result.paket.satuan);
    setMinOrder(result.paket.min_order);
    setLoading(false);
  };

  useEffect(() => {
    getKategori();
    scrollToTop();
    if (values.tipe === "edit") {
      getPaketById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="overflow-auto">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <Link to="/paket" className="text-decoration-none d-flex align-items-center">
            <i className="bx bxs-left-arrow-square fs-2 text-blue"></i>&nbsp;
          </Link>
          <span className="fs-4 fw-bold">Form Tambah Paket</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <InputSelectComponent
              label="Kategori Paket/Menu"
              selected={idKategori}
              kategori={kategori}
              error={errorKategori}
              handleSelectedChange={(e) => {
                setIdKategori(e.target.value);
                setErrorKategori(e.target.value !== 0 ? false : true);
              }}
              isInvalid={errorKategori}
              message={messageKategori}
            />
            <InputNamaComponent
              label="Nama Paket/Menu"
              nama={nama}
              handleNamaChange={(e) => {
                setNama(e.target.value);
                setErrorNama(e.target.value !== "" ? false : true);
              }}
              isInvalid={errorNama}
              message={messageNama}
            />
            <InputNumberComponent
              label="Harga Paket/Menu"
              harga={harga}
              handleNumberChange={(e) => {
                setHarga(e.target.value);
                setErrorHarga(e.target.value !== 0 ? false : true);
              }}
              isInvalid={errorHarga}
              message={messageHarga}
            />
            <InputSelectComponent
              label="Satuan"
              selected={unit}
              kategori={satuan}
              error={errorUnit}
              handleSelectedChange={(e) => {
                setUnit(e.target.value);
                setErrorUnit(e.target.value !== 0 ? false : true);
              }}
              isInvalid={errorUnit}
              message={messageUnit}
            />
            <InputNumberComponent
              label="Minimal Order"
              harga={minOrder}
              handleNumberChange={(e) => {
                setMinOrder(e.target.value);
                setErrorMinOrder(e.target.value !== 0 ? false : true);
              }}
              isInvalid={errorMinOrder}
              message={messageMinOrder}
            />
            <InputFileComponent label="Gambar Paket/Menu" preview={preview} handleFileChange={handleFileChange} fileInputRef={fileInputRef} isInvalid={errorFile} message={messageFile} />
            <InputDescriptionComponent
              handleDescChange={(value) => {
                setDesc(value);
                setErrorDesc(value !== "" ? false : true);
              }}
              desc={desc}
              isInvalid={errorDesc}
              message={messageDesc}
            />
            <hr />
            <ButtonKategoriComponent handleResetClick={handleReset} loading={loadingSubmit} />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TambahPaketPages;
