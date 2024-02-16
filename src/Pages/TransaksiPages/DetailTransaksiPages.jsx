import React from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";
import formatRupiah from "../../Utils/FormatRupiah";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import scrollToTop from "../../Utils/ScrollToTop";
import { ToastContainer, toast } from "react-toastify";

const DetailTransaksiPages = () => {
  const params = useParams();
  const [order, setOrder] = useState([]);
  const [show, setShow] = useState(false);
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(true);
  const [tipeModal, setTipeModal] = useState("");
  const [selected, setSelected] = useState("");
  const [jumlah, setJumlah] = useState(0);
  const navigate = useNavigate();
  //   site Effect
  useEffect(() => {
    scrollToTop();
    document.title = "Admin - Detail Transaksi";
    getOrderbyId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Realtime
  useEffect(() => {
    const interval = setInterval(() => {
      getOrderbyId();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  //   getOrder By Id
  const getOrderbyId = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/order/" + params.id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setOrder(result.order);
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
  //   handle button pesanan
  const handleClickButtonOrder = async (status) => {
    const form = new FormData();
    form.append("status", status);
    form.append("user_id", order.user_id);
    const response = await fetch("http://127.0.0.1:8000/api/updateStatusPesanan/" + params.id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();
    if (result.status) {
      Swal.fire({
        title: "Success",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      getOrderbyId();
    } else {
      if (result.message === "Token is Expired") {
        Swal.fire({
          title: "Sesi Habis!",
          text: "Mohon maaf sesi anda sudah habis! Silahkan login kembali!",
          icon: "error",
          confirmButtonText: "OK",
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDenied) {
            navigate("/login");
            localStorage.removeItem("token_admin");
          }
        });
      }
    }
  };
  // handling end Process Order
  const handleEndProcess = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/endProcess/" + params.id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    // console.log(result);
    if (result.status) {
      Swal.fire({
        title: "Sukses!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      if (result.message === "Token is Expired") {
        Swal.fire({
          title: "Sesi Habis!",
          text: "Mohon maaf sesi anda sudah habis! Silahkan login kembali!",
          icon: "error",
          confirmButtonText: "OK",
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDenied) {
            navigate("/login");
            localStorage.removeItem("token_admin");
          }
        });
      }
    }
    getOrderbyId();
  };

  const handleCloseModal = () => {
    setShow(false);
    setAlasan("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("alasan", alasan);
    form.append("status", "Tolak");
    form.append("user_id", order.user_id);
    const response = await fetch("http://127.0.0.1:8000/api/updateStatusPesanan/" + params.id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();
    if (result.status) {
      Swal.fire({
        title: "Success",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      getOrderbyId();
      handleCloseModal();
    } else {
      if (result.message === "Token is Expired") {
        Swal.fire({
          title: "Sesi Habis!",
          text: "Mohon maaf sesi anda sudah habis! Silahkan login kembali!",
          icon: "error",
          confirmButtonText: "OK",
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDenied) {
            navigate("/login");
            localStorage.removeItem("token_admin");
          }
        });
      }
    }
  };

  // handle submit pembayaran
  const handleSubmitPembayaran = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("order_id", params.id);
    form.append("jumlah_bayar", jumlah);
    form.append("jenis_bayar", selected);

    const response = await fetch("http://127.0.0.1:8000/api/manual_payment", {
      method: "POST",
      body: form,
    });
    const result = await response.json();
    if (result.status) {
      toast.success(result.message);
      getOrderbyId();
      setShow(false);
      setSelected("");
      setJumlah("");
    }
  };

  // handle proses pesanan
  const handleProcessPesanan = async (id) => {
    const form = new FormData();
    form.append("order_id", id);
    console.log(id);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        },
        body: form,
      });
      const result = await response.json();
      if (result.status) {
        toast.success(result.message);
      } else {
        if (result.message === "Token is Expired") {
          Swal.fire({
            title: "Sesi Habis!",
            text: "Mohon maaf sesi anda sudah habis! Silahkan login kembali!",
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed || result.isDenied || result.isDenied) {
              navigate("/login");
              localStorage.removeItem("token_admin");
            }
          });
        }
      }
      getOrderbyId();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TitleComponent title="Detail Transaksi" />
      <Link className="btn btn-dark mb-2" to="/data-transaksi">
        <i className="bx bx-arrow-back"></i> Kembali
      </Link>
      <section className="p-4 border rounded bg-greys overflow-auto">
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Modern Catering</span>
              {order.status !== "Menunggu Persetujuan" && order.status !== "Diproses" && order.status !== "Booked" ? (
                <div className="identity-order">
                  <span>
                    NO. PESANAN. <strong className="bg-blue p-1 rounded">#{order.id}</strong> |{" "}
                    <strong
                      className={`${order.status === "Selesai" || order.status === "Diproses" || order.status === "Tanggal Booked" || order.status === "Booked" ? "text-success" : ""} ${
                        order.status === "Menunggu Persetujuan" ? "text-primary" : ""
                      } ${order.status === "Dibatalkan" || order.status === "Ditolak" ? "text-danger" : ""} ${order.status === "Belum DP" || order.status === "Menunggu Pelunasan" ? "text-warning" : ""} bg-light p-1 rounded`}
                    >
                      {order.status}
                    </strong>
                  </span>
                </div>
              ) : (
                <div className="identity-order d-flex align-items-center">
                  <span>NO. PESANAN. #{order.id} |&nbsp;</span>
                  {order.status === "Diproses" ? (
                    <button className="btn btn-success btn-sm" onClick={() => handleEndProcess("Terima")}>
                      Selesaikan
                    </button>
                  ) : order.status === "Booked" ? (
                    <button className="btn btn-sm bg-purple" onClick={() => handleProcessPesanan(order.id)}>
                      Proses Pesanan
                    </button>
                  ) : (
                    <div className="action">
                      <button className="btn btn-success btn-sm" onClick={() => handleClickButtonOrder("Terima")}>
                        Terima
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setShow(true);
                          setTipeModal("tolak");
                        }}
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <hr />
            <div className="row d-flex justify-content-between mt-4">
              <div className="col-md-2 d-flex flex-column">
                <span className="fw-bold">Tgl. Pemesanan</span>
                <span>{format(new Date(order.tanggal_pemesanan), "EEEE, dd MMMM yyyy", { locale: id })}</span>
              </div>
              <div className="col-md-2 d-flex flex-column">
                <span className="fw-bold">Waktu Acara</span>
                <span>{format(new Date(order.tanggal_acara), "EEEE, dd MMMM yyyy", { locale: id })}</span>
                <span>
                  {order.waktu_acara.substring(0, 5).replace(":", ".")} s/d {order.waktu_selesai_acara.substring(0, 5).replace(":", ".")}{" "}
                </span>
              </div>
              <div className="col-md-2 d-flex flex-column">
                <span className="fw-bold">Lokasi Acara</span>
                <span>{order.lokasi_acara}</span>
              </div>
              <div className="col-md-2 d-flex flex-column">
                <span className="fw-bold">Catatan</span>
                <span>{order.catatan}</span>
              </div>
              <div className="col-md-2 d-flex flex-column">
                <span className="fw-bold">Status Pesanan</span>
                <span className="badge bg-blue">{order.status}</span>
              </div>
            </div>
            <hr />
            <div className="row d-flex mt-4">
              <div className="col-3 d-flex flex-column">
                <span className="fw-bold mb-2">Nama Pemesanan</span>
                <span className="fw-bold mb-2">No. Telp Pemesanan</span>
                <span className="fw-bold">Alamat Pemesanan</span>
              </div>
              <div className="col-1 d-flex flex-column p-0">
                <span className="fw-bold mb-2">:</span>
                <span className="fw-bold mb-2">:</span>
                <span className="fw-bold">:</span>
              </div>
              <div className="col-4 d-flex flex-column justify-content-center p-0">
                <span className="mb-2">{order.nama_pemesan}</span>
                <span className="mb-2">{order.no_telp_pemesan}</span>
                <span>{order.alamat_pemesan}</span>
              </div>
            </div>
            <hr />
            <div className="row">
              {order.transactions.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="d-flex align-items-center justify-content-between my-2">
                    <div className="paket d-flex align-items-center">
                      <img src={item.paket_prasmanan.gambar_paket} alt="Paket" style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                      &nbsp;&nbsp;
                      <div className="desc d-flex flex-column">
                        <span className="text-muted">{item.paket_prasmanan.nama_paket}</span>
                        <span style={{ maxWidth: 500 }} dangerouslySetInnerHTML={{ __html: item.menu }} />
                        <span>Jumlah: {item.jumlah_pesanan + " " + item.paket_prasmanan.satuan}</span>
                      </div>
                    </div>
                    <span>{formatRupiah(item.total_harga)}</span>
                  </div>
                </React.Fragment>
              ))}
              <h3 className="mt-3 text-end text-danger fw-bold">Total: {formatRupiah(order.total)}</h3>
            </div>
            <hr />
            <h3 className="text-danger fw-bold mb-3">Pembayaran</h3>
            {order.status === "Belum DP" || order.status === "Menunggu Pelunasan" || order.status === "Tanggal Booked" ? (
              <button
                className="btn bg-purple mb-3"
                onClick={() => {
                  setShow(true);
                  setTipeModal("tambah_pembayaran");
                }}
              >
                + Tambah Pembayaran
              </button>
            ) : (
              ""
            )}
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    No.
                  </th>
                  <th scope="col">Metode Pembayaran</th>
                  <th scope="col">Tanggal Bayar</th>
                  <th scope="col">Jumlah Bayar</th>
                  <th scope="col">Sisa Tagihan</th>
                  <th scope="col">Jenis Bayar</th>
                </tr>
              </thead>
              <tbody>
                {order.payments.length !== 0 ? (
                  order.payments.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row" className="text-center">
                        {index + 1}
                      </th>
                      <td>{item.metode_pembayaran}</td>
                      <td>{format(new Date(item.tanggal_pembayaran), "EEEE, dd MMMM yyyy", { locale: id })}</td>
                      <td>{formatRupiah(item.jumlah_bayar)}</td>
                      <td>{formatRupiah(item.sisa)}</td>
                      <td>{item.jenis_pembayaran}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center">
                      Belum ada pembayaran!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
      <ModalComponent show={show} handleClose={handleCloseModal} title={tipeModal === "tolak" ? "Alasan Penolakan" : "Tambah Pembayaran"} handleSubmit={tipeModal === "tolak" ? handleSubmit : handleSubmitPembayaran}>
        <>
          {tipeModal === "tolak" ? (
            <form onSubmit={handleSubmit}>
              <textarea placeholder="Masukkan pesan anda..." className="form-control" style={{ height: "150px" }} onChange={(e) => setAlasan(e.target.value)} value={alasan} required></textarea>
            </form>
          ) : (
            <form onSubmit={handleSubmitPembayaran}>
              <div className="mb-3">
                <label htmlFor="jumlah bayar" className="mb-2 fw-bold">
                  Jumlah Bayar
                </label>
                <input type="number" className="form-control" placeholder="Masukkan jumlah bayar" value={jumlah} onChange={(e) => setJumlah(e.target.value)} />
              </div>
              <div className="mt-3">
                <label htmlFor="jumlah bayar" className="mb-2 fw-bold">
                  Jenis Pembayaran
                </label>
                <select className="form-select" defaultValue={selected} onChange={(e) => setSelected(e.target.value)}>
                  <option value="">Pilih jenis pembayaran</option>
                  <option value="DP Tanggal">DP Tanggal</option>
                  <option value="DP Pesanan">DP Pesanan</option>
                  <option value="Pelunasan">Pelunasan</option>
                </select>
              </div>
            </form>
          )}
        </>
      </ModalComponent>
      <ToastContainer />
    </>
  );
};

export default DetailTransaksiPages;
