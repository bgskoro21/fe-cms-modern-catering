import { useEffect, useContext, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { SidebarComponent } from "./Component/SidebarComponent/SidebarComponent";
import {
  AdminPages,
  DashboardPages,
  KategoriPages,
  TambahAdminPages,
  FormTambahKategori,
  PaketPages,
  PaketMenuPages,
  PaketGalleryPages,
  TambahPaketPages,
  TestimoniPages,
  PelangganPages,
  TransaksiPages,
  DetailTransaksiPages,
  AdminProfilePages,
  LoginPages,
  BannerPages,
  MenuOlahanPages,
  SubMenuOlahanPages,
  LaporanPages,
  NotifikasiPages,
} from "./Pages";
import UserContext from "./Context/UserContext/UserContext";
import PrivateRoute from "./PrivateRoutes/PrivateRoutes";
import GuestRoute from "./PrivateRoutes/GuestRoutes";
import LoadingComponent from "./Component/LoadingComponent/LoadingComponent";
import KonsultasiPelangganPages from "./Pages/KonsultasiPelangganPages/KonsultasiPelangganPages";

function App() {
  const { dispatchUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token_admin")) {
      getAuthUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchUser]);

  // get Authenticated User
  const getAuthUser = async () => {
    setLoading(true);
    const response = await fetch("http://127.0.0.1:8000/api/admin/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      dispatchUser({ type: "SET_USER", payload: result.user });
    } else {
      if (result.message === "Token is Expired") {
        navigate("/login");
        localStorage.removeItem("token_admin");
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section style={{ height: "100vh" }} className="d-flex justify-content-center align-items-center">
        <LoadingComponent />
      </section>
    );
  }
  return (
    <div className="App">
      {location.pathname === "/login" ? (
        <Routes>
          <Route exact element={<GuestRoute />}>
            <Route path="/login" element={<LoginPages />} />
          </Route>
        </Routes>
      ) : (
        <SidebarComponent>
          <Routes>
            <Route exact element={<PrivateRoute />}>
              <Route path="/" element={<DashboardPages />} />
              <Route path="/kategori" element={<KategoriPages />} />
              <Route path="/kategori/form_kategori" element={<FormTambahKategori />} />
              <Route path="/paket" element={<PaketPages />} />
              <Route path="/paket/form_paket" element={<TambahPaketPages />} />
              <Route path="/paket/menu-paket/:id" element={<PaketMenuPages />} />
              <Route path="/menu" element={<MenuOlahanPages />} />
              <Route path="/menu/submenu/:id" element={<SubMenuOlahanPages />} />
              <Route path="/data-admin" element={<AdminPages />} />
              <Route path="/tambah-admin" element={<TambahAdminPages />} />
              <Route path="/data-pelanggan" element={<PelangganPages />} />
              <Route path="/data-banner" element={<BannerPages />} />
              <Route path="/data-transaksi" element={<TransaksiPages />} />
              <Route path="/data-transaksi/detail/:id" element={<DetailTransaksiPages />} />
              <Route path="/laporan" element={<LaporanPages />} />
              <Route path="/admin-profile" element={<AdminProfilePages />} />
              <Route path="/paket/galery/:id" element={<PaketGalleryPages />} />
              <Route path="/testimoni" element={<TestimoniPages />} />
              <Route path="/konsultasi" element={<KonsultasiPelangganPages />} />
              <Route path="/notifikasi" element={<NotifikasiPages />} />
            </Route>
          </Routes>
        </SidebarComponent>
      )}
    </div>
  );
}

export default App;
