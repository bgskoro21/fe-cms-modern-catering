import React, { useEffect, useState } from "react";
import CardComponent from "../../Component/CardComponent/CardComponent";
import KalenderComponent from "../../Component/KalenderComponent/KalenderComponent";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DashboardPages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Admin - Dashboard";
    scrollToTop();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Handle get Data
  const getData = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setData(result);
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

  if (loading) {
    return (
      <section style={{ height: "80vh" }} className="d-flex justify-content-center align-items-center">
        <LoadingComponent />
      </section>
    );
  }
  return (
    <>
      <div className="row">
        <div className="col-md-4 mb-2">
          <CardComponent jumlah={data.pelanggan} title="Data Pelanggan" url={"/data-pelanggan"} bgBody={"bg-greys"} icon="bx-group" />
        </div>
        <div className="col-md-4 mb-2">
          <CardComponent jumlah={data.admin} title="Data Admin" url={"/data-admin"} bgBody={"bg-greys"} icon="bx-user-circle" />
        </div>
        <div className="col-md-4">
          <CardComponent jumlah={data.transaksiCount} title="Data Transaksi" url={"/data-transaksi"} bgBody={"bg-greys"} icon="bxs-report" />
        </div>
      </div>
      <KalenderComponent event={data.transaksi} />
    </>
  );
};

export default DashboardPages;
