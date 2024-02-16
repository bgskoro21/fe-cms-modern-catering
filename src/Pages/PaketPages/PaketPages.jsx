import React, { useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { useEffect } from "react";
import TableComponent from "../../Component/TableComponent/TableComponent";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";
import ModalBottomComponent from "../../Component/ModalComponent/ModalBottomComponent";
import formatRupiah from "../../Utils/FormatRupiah";

const PaketPages = () => {
  const [paket, setPaket] = useState([]);
  const [packages, setPackages] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const navigate = useNavigate();

  //   get Paket from API
  const getPaket = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/paket_prasmanan");
    const result = await response.json();
    setPaket(result.paket);
    setLoading(false);
  };

  //   getPaket first rendering
  useEffect(() => {
    getPaket();
    scrollToTop();
    document.title = "Admin - Data Paket";
  }, []);

  //   deklarasi column tabel
  const column = [
    { id: "kategori_paket", header: "Kategori Paket", accessor: "kategori_paket" },
    { id: "gambar_paket", header: "Gambar Paket", accessor: "gambar_paket" },
    { id: "nama_paket", header: "Nama Paket", accessor: "nama_paket" },
    { id: "harga", header: "Harga", accessor: "harga" },
    { id: "status", header: "Status Paket", accessor: "status" },
  ];

  //   handle delete paket
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/paket_prasmanan/" + id, {
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
        getPaket();
      }
    });
  };

  // Handling open Modal Bottom
  const openModal = (id) => {
    setIsOpen(true);
    getPaketById(id);
    document.body.style.overflow = "hidden";
  };
  // Handling close Modal Bottom
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setLoadingDetail(false);
  };
  // get Paket by Id
  const getPaketById = async (id) => {
    setLoadingDetail(true);
    const response = await fetch("http://127.0.0.1:8000/api/paket_prasmanan/" + id);
    const result = await response.json();
    console.log(result);
    setPackages(result.paket);
    setLoadingDetail(false);
  };
  // set Paket Andalan
  const setPaketAndalan = async (id) => {
    const response = await fetch("http://127.0.0.1:8000/api/set_andalan/" + id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      toast.success(result.message);
      getPaket();
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
  };
  // set Paket Release
  const setPaketRelease = async (id) => {
    const response = await fetch("http://127.0.0.1:8000/api/set_release/" + id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      toast.success(result.message);
      getPaket();
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
  };

  return (
    <>
      <TitleComponent title="Data Paket/Menu" />
      <section className="p-3 rounded border bg-greys overflow-auto">
        {loading ? (
          <LoadingComponent />
        ) : (
          <TableComponent
            data={paket}
            header={column}
            sort={"nama_paket"}
            table="paket"
            handleDelete={handleDelete}
            urlTambah="/paket/form_paket?tipe=tambah"
            openModal={openModal}
            andalanClick={setPaketAndalan}
            releaseClick={setPaketRelease}
          />
        )}
      </section>
      <ToastContainer />
      <ModalBottomComponent isOpen={isOpen}>
        {Object.keys(packages).length > 0 ? (
          loadingDetail ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
              <LoadingComponent />
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center">
                <h3>Detail Paket</h3>
                <h4 className="text-danger" onClick={closeModal} style={{ cursor: "pointer" }}>
                  X
                </h4>
              </div>
              <hr />
              <div className="body">
                <div className="d-flex align-items-end">
                  <img src={packages.gambar_paket} alt="Paket" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                  &nbsp;
                  <div className="d-flex flex-column justify-content-end">
                    <span className="text-muted">{packages.kategori.nama_kategori}</span>
                    <span className="fw-bold">{packages.nama_paket}</span>
                    <span className="text-danger fs-3">{formatRupiah(packages.harga)}</span>
                    <span className="text-muted" style={{ fontSize: "12px" }}>
                      Terjual {packages.terjual} porsi
                    </span>
                  </div>
                </div>
                <hr />
                <div className="row d-flex">
                  <div className="col-6">
                    <h5>Deskripsi</h5>
                    <div dangerouslySetInnerHTML={{ __html: packages.description }} />
                  </div>
                  <div className="col-6">
                    <h5>Daftar Menu</h5>
                    {packages.menu_prasmanan.length > 0 ? (
                      <ol style={{ padding: 0 }} className="mx-4">
                        {packages.menu_prasmanan.map((item, index) => (
                          <li key={index}>{item.menu}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>Belum ada menu!</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </ModalBottomComponent>
    </>
  );
};

export default PaketPages;
