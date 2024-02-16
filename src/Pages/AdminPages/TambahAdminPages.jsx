import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonKategoriComponent, InputNamaComponent } from "../../Component/FormKategoriComponent/FormKategoriComponent";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import scrollToTop from "../../Utils/ScrollToTop";
import Swal from "sweetalert2";

const TambahAdminPages = () => {
  const [nama, setNama] = useState("");
  const [errorNama, setErrorNama] = useState(false);
  const [messageNama, setMessageNama] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [messageEmail, setMessageEmail] = useState("");
  const [nohp, setNoHp] = useState("");
  const [errorNoHp, setErrorNoHp] = useState(false);
  const [messageNoHp, setMessageNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [errorAlamat, setErrorAlamat] = useState(false);
  const [messageAlamat, setMessageAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [messagePassword, setMessagePassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errorPasswordConf, setErrorPasswordConf] = useState(false);
  const [messagePasswordConf, setMessagePasswordConf] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin - Tambah Admin";
    scrollToTop();
  }, []);

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const form = new FormData();
    form.append("name", nama);
    form.append("email", email);
    form.append("no_hp", nohp);
    form.append("alamat", alamat);
    form.append("password", password);
    form.append("password_confirmation", confPassword);

    const response = await fetch("http://127.0.0.1:8000/api/admin/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
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
      if (result.hasOwnProperty("form_validation")) {
        setErrorNama(result.message.hasOwnProperty("name") ? true : false);
        setMessageNama(result.message.hasOwnProperty("name") ? result.message.name : "");
        setErrorEmail(result.message.hasOwnProperty("email") ? true : false);
        setMessageEmail(result.message.hasOwnProperty("email") ? result.message.email : "");
        setErrorNoHp(result.message.hasOwnProperty("no_hp") ? true : false);
        setMessageNoHp(result.message.hasOwnProperty("no_hp") ? result.message.no_hp : "");
        setErrorAlamat(result.message.hasOwnProperty("alamat") ? true : false);
        setMessageAlamat(result.message.hasOwnProperty("alamat") ? result.message.alamat : "");
        setErrorPassword(result.message.hasOwnProperty("password") ? true : false);
        setMessagePassword(result.message.hasOwnProperty("password") ? result.message.password : "");
        setErrorPasswordConf(result.message.hasOwnProperty("password_confirmation") ? true : false);
        setMessagePasswordConf(result.message.hasOwnProperty("password_confirmation") ? result.message.password_confirmation : "");
      }
    } else {
      setNama("");
      setPassword("");
      setConfPassword("");
      setAlamat("");
      setNoHp("");
      setEmail("");
      toast.success(result.message);
    }
    setLoadingSubmit(false);
  };
  return (
    <>
      <section className="form">
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <Link to="/data-admin" className="text-decoration-none d-flex align-items-center">
              <i className="bx bxs-left-arrow-square fs-2 text-blue"></i>&nbsp;
            </Link>
            <span className="fw-bold fs-4">Form Tambah Data Admin</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <InputNamaComponent
                label="Nama Admin"
                placeholder="Masukkan nama admin..."
                handleNamaChange={(e) => {
                  setNama(e.target.value);
                  setErrorNama(false);
                  setMessageNama("");
                }}
                nama={nama}
                isInvalid={errorNama}
                message={messageNama}
              />
              <InputNamaComponent
                label="Username"
                placeholder="Masukkan username admin..."
                handleNamaChange={(e) => {
                  setEmail(e.target.value);
                  setErrorEmail(false);
                  setMessageEmail("");
                }}
                nama={email}
                isInvalid={errorEmail}
                message={messageEmail}
              />
              <InputNamaComponent
                label="Nomor HP"
                placeholder="Masukkan nomor hp..."
                handleNamaChange={(e) => {
                  setNoHp(e.target.value);
                  setErrorNoHp(false);
                  setMessageNoHp("");
                }}
                nama={nohp}
                isInvalid={errorNoHp}
                message={messageNoHp}
              />
              <InputNamaComponent
                label="Alamat"
                placeholder="Masukkan alamat admin..."
                handleNamaChange={(e) => {
                  setAlamat(e.target.value);
                  setErrorAlamat(false);
                  setMessageAlamat("");
                }}
                nama={alamat}
                isInvalid={errorAlamat}
                message={messageAlamat}
              />
              <InputNamaComponent
                label="Password"
                placeholder="Masukkan password..."
                password={true}
                handleNamaChange={(e) => {
                  setPassword(e.target.value);
                  setErrorPassword(false);
                  setMessagePassword("");
                }}
                nama={password}
                isInvalid={errorPassword}
                message={messagePassword}
              />
              <InputNamaComponent
                label="Konfirmasi Password"
                placeholder="Ulangi password..."
                password={true}
                handleNamaChange={(e) => {
                  setConfPassword(e.target.value);
                  setErrorPasswordConf(false);
                  setMessagePasswordConf("");
                }}
                nama={confPassword}
                isInvalid={errorPasswordConf}
                message={messagePasswordConf}
              />
              <hr />
              <ButtonKategoriComponent loading={loadingSubmit} />
            </form>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default TambahAdminPages;
