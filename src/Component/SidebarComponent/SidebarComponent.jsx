import React, { useState } from "react";
import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SidebarComponent.css";
import Swal from "sweetalert2";
import { useContext } from "react";
import UserContext from "../../Context/UserContext/UserContext";
import { Logo } from "../../assets";
import { NotificationContext } from "../../Context/NotificationContext/NotificationContext";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const SidebarComponent = ({ children }) => {
  const { userState } = useContext(UserContext);
  const { notifAmount } = useContext(NotificationContext);
  const [isVisible, setIsVisible] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const showAlert = () => {
    Swal.fire({
      title: "Yakin Logout?",
      text: "Apakah kamu ingin keluar?",
      icon: "question",
      confirmButtonText: "Ya",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
          },
        });
        const result = await response.json();
        if (result.status) {
          localStorage.removeItem("token_admin");
          navigate("/login");
        } else {
          localStorage.removeItem("token_admin");
          navigate("/login");
        }
      }
    });
  };

  const handleClickArrow = (e) => {
    const arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
  };

  const handleClickSidebarBtn = () => {
    sidebarRef.current.classList.toggle("close");
  };

  const handleNavigate = async (id) => {
    setIsVisible(false);
    navigate("/data-transaksi/detail/" + id);
  };
  return (
    <>
      <div className="sidebar" ref={sidebarRef}>
        <div className="logo-details">
          <img src={Logo} alt="Eyzel" className="rounded-circle border-white" />
          <span className="logo_name">Modern Catering</span>
        </div>
        <ul className="nav-links">
          <li className={location.pathname.split("/")[1] === "" ? "active mb-3" : "mb-3"}>
            <Link to="/">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/">
                  Dashboard
                </Link>
              </li>
            </ul>
          </li>
          <p className="sub-kategori">Catering</p>
          <li className={location.pathname.split("/")[1] === "kategori" ? "active" : ""}>
            <Link to="/kategori">
              <i className="bx bx-collection"></i>
              <span className="link_name">Data Kategori</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/kategori">
                  Data Kategori
                </Link>
              </li>
            </ul>
          </li>
          <li className={location.pathname.split("/")[1] === "menu" || location.pathname.split("/")[1] === "submenu" ? "active" : ""}>
            <Link to="/menu">
              <i className="bx bx-menu"></i>
              <span className="link_name">Data Menu Olahan</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/menu">
                  Data Menu Olahan
                </Link>
              </li>
            </ul>
          </li>
          <li className={location.pathname.split("/")[1] === "paket" ? "active mb-3" : "mb-3"}>
            <Link to="/paket">
              <i className="bx bx-food-menu"></i>
              <span className="link_name">Data Paket/Menu</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/paket">
                  Data Paket/Menu
                </Link>
              </li>
            </ul>
          </li>
          <p className="sub-kategori">Pengguna</p>
          <li className={location.pathname.split("/")[1] === "data-admin" || location.pathname === "/tambah-admin" || location.pathname.split("/")[1] === "data-pelanggan" ? "active mb-3" : "mb-3"}>
            <div className="iocn-link">
              <Link to="/data-admin">
                <i className="bx bxs-group"></i>
                <span className="link_name">Data User</span>
              </Link>
              <i className="bx bxs-chevron-down arrow" onClick={handleClickArrow}></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/admin">
                  Data User
                </Link>
              </li>
              <li>
                <Link to="/data-admin">Data Admin</Link>
              </li>
              <li>
                <Link to="/data-pelanggan">Data Pelanggan</Link>
              </li>
            </ul>
          </li>
          <p className="sub-kategori">Transaksi</p>
          <li className={`${location.pathname.split("/")[1] === "data-transaksi" ? "active" : ""}`}>
            <Link to="data-transaksi">
              <i className="bx bx-pie-chart-alt-2"></i>
              <span className="link_name">Data Transaksi</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/data-transaksi">
                  Data Transaksi
                </Link>
              </li>
            </ul>
          </li>
          <li className={location.pathname.split("/")[1] === "laporan" ? "active mb-3" : "mb-3"}>
            <Link to="/laporan">
              <i className="bx bx-line-chart"></i>
              <span className="link_name">Laporan Penjualan</span>
            </Link>
            <ul className="sub-menu blank">
              <li>
                <Link className="link_name" to="/laporan">
                  Laporan Penjualan
                </Link>
              </li>
            </ul>
          </li>
          <p className="sub-kategori">Konfigurasi</p>
          <li className={location.pathname.split("/")[1] === "testimoni" || location.pathname.split("/")[1] === "data-banner" ? "active mb-5" : "mb-5"}>
            <div className="iocn-link">
              <Link to="/data-banner">
                <i className="bx bx-plug"></i>
                <span className="link_name">Konfigurasi</span>
              </Link>
              <i className="bx bxs-chevron-down arrow" onClick={handleClickArrow}></i>
            </div>
            <ul className="sub-menu">
              <li>
                <Link className="link_name" to="/data-bank">
                  Konfigurasi
                </Link>
              </li>
              <li>
                <Link to="/data-banner">Data Banner</Link>
              </li>
              <li>
                <Link to="/testimoni">Testimoni</Link>
              </li>
              <li>
                <Link to="/konsultasi">Konsultasi</Link>
              </li>
            </ul>
          </li>
          <li>
            <div className="profile-details">
              <Link to="/admin-profile">
                <div className="profile-content">
                  {userState.user.hasOwnProperty("profile_pic") && <img src={userState.user.profile_pic !== null ? userState.user.profile_pic : "http://cdn.onlinewebfonts.com/svg/img_329115.png"} alt="profileImg" />}
                </div>
              </Link>
              <div className="name-job">
                <div className="profile_name">{userState.user.name}</div>
                <div className="job">{userState.user.role}</div>
              </div>
              <i className="bx bx-log-out" onClick={showAlert}></i>
            </div>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <div className="home-content sticky-top border">
          <i className="bx bx-menu" onClick={handleClickSidebarBtn}></i>
          <div className="notification-container d-flex align-items-center" onClick={() => setIsVisible(!isVisible)}>
            <Link to="/notifikasi" className={location.pathname === "/notifikasi" ? "text-danger d-flex align-items-center text-decoration-none" : "text-dark d-flex align-items-center text-decoration-none"}>
              <i className="bx bxs-bell fs-3"></i>
            </Link>
            {notifAmount > 0 && (
              <div className="notif-amount bg-danger d-flex justify-content-center">
                <span className="w-100">{notifAmount}</span>
              </div>
            )}
          </div>
        </div>
        <main className="p-3 d-flex flex-column">
          <div className="content">{children}</div>
          <footer className="p-2">
            <span className="d-flex justify-content-center">Copyright &copy; Modern Catering</span>
          </footer>
        </main>
      </section>
    </>
  );
};
