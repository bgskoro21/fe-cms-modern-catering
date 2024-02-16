import React, { useState } from "react";
import { useEffect } from "react";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import scrollToTop from "../../Utils/ScrollToTop";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "./NotifikasiPages.css";

const NotifikasiPages = () => {
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifikasi();
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNotifikasi = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/notifikasi-admin?page=" + page, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        },
      });
      const result = await response.json();
      if (result.status) {
        const newData = result.notifikasi.data;
        setNotifikasi([...notifikasi, ...newData]);
        if (newData.length === 0) {
          setHasMore(false);
        }
        setPage(page + 1);
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
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="container-loading d-flex align-items-center justify-content-center" style={{ height: "80vh" }}>
        <LoadingComponent />
      </div>
    );
  }
  return notifikasi.length > 0 ? (
    <InfiniteScroll dataLength={notifikasi.length} style={{ overflow: "visible" }} next={getNotifikasi} hasMore={hasMore} loader={<LoadingComponent />}>
      {notifikasi.map((item, index) => (
        <div className={`notif-container`} key={index}>
          <div className={`d-flex border mb-2 p-4 ${item.status === 0 ? "bg-peach" : "bg-white"} shadow-sm`}>
            <div className="col-12 col-md-8 d-flex flex-column justify-content-center mb-3">
              <div className="header mb-3">
                <strong>{item.title}</strong> - {format(new Date(item.date), "dd/MMMM/yyyy HH.mm", { locale: id })}
              </div>
              <div className="body w-100">{item.message}</div>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-md-end align-items-center">
              <Link className="btn btn-outline-danger" to={`/data-transaksi/detail/${item.order_id}`}>
                Lihat Detail Transaksi
              </Link>
            </div>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  ) : (
    <div className="container-not-found d-flex justify-content-center align-items-center bg-white" style={{ height: "85vh" }}>
      <h5>Belum ada notifikasi!</h5>
    </div>
  );
};

export default NotifikasiPages;
