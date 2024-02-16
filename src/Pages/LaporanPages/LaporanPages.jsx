import React, { useEffect, useState } from "react";
import "./Laporan.css";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import scrollToTop from "../../Utils/ScrollToTop";

const LaporanPages = () => {
  const [bulan, setBulan] = useState(0);
  const [tahun, setTahun] = useState(0);
  const [pdfURL, setPdfURL] = useState("");
  const [chevron, setChevron] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [tipe, setTipe] = useState("Laporan Penjualan");
  const startYear = 2020;
  const endYear = 2030;
  const years = [];

  useEffect(() => {
    document.title = "Admin - Laporan";
    scrollToTop();
  }, []);

  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};

    if (bulan === 0) {
      formIsValid = false;
      newErrors["bulan"] = "Pilih Bulan Terlebih Dahulu!";
    }

    if (tahun === 0) {
      formIsValid = false;
      newErrors["tahun"] = "Pilih Tahun Terlebih Dahulu!";
    }
    setError(newErrors);
    return formIsValid;
  };

  //   handle Submit Penjualan
  const handleSubmitPenjualan = async () => {
    let url = "";
    setPdfURL("");
    setLoading(true);
    if (tipe === "Laporan Penjualan") {
      url += `http://127.0.0.1:8000/api/laporan-penjualan?bulan=${bulan}&tahun=${tahun}`;
    } else if (tipe === "Laporan Paket Terlaris") {
      url += "http://127.0.0.1:8000/api/paket-terlaris";
    } else if (tipe === "Laporan Pelanggan") {
      url += "http://127.0.0.1:8000/api/laporan-pelanggan";
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = response.headers.get("content-type");
    if (result === "application/pdf") {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfURL(url);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="d-flex flex-column border mb-3 shadow-sm rounded p-4 bg-greys">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{tipe}</h2>
          <i className={`bx bx-chevron-${chevron ? "up" : "down"} fs-1`} onClick={() => setChevron(!chevron)} style={{ cursor: "pointer" }} />
        </div>
        {chevron && (
          <>
            <div
              className={`d-flex justify-content-between align-items-center rounded p-1 ${tipe === "Laporan Penjualan" ? "active" : ""}`}
              id="penjualan"
              onClick={() => {
                setTipe("Laporan Penjualan");
                setChevron(false);
              }}
            >
              <span>Laporan Penjualan</span>
            </div>
            <div
              className={`d-flex justify-content-between align-items-center rounded p-1 ${tipe === "Laporan Paket Terlaris" ? "active" : ""}`}
              id="paket"
              onClick={() => {
                setTipe("Laporan Paket Terlaris");
                setChevron(false);
              }}
            >
              <span>Laporan Paket Terlaris</span>
            </div>
            <div
              className={`d-flex justify-content-between align-items-center rounded p-1 ${tipe === "Laporan Pelanggan" ? "active" : ""}`}
              id="pelanggan"
              onClick={() => {
                setTipe("Laporan Pelanggan");
                setChevron(false);
              }}
            >
              <span>Laporan Pelanggan</span>
            </div>
          </>
        )}
        <hr />
        {tipe === "Laporan Penjualan" && (
          <div className="form d-flex mt-3">
            <div className="col-md-6">
              <label htmlFor="monthPicker">Cari Bulan</label>
              <select name="month" id="month-picker" className="form-select" defaultValue={bulan} onChange={(e) => setBulan(e.target.value)}>
                <option value="0">--Pilih Bulan--</option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
            &nbsp;
            <div className="col-md-6">
              <label htmlFor="monthPicker">Cari Tahun</label>
              <select name="year" id="year-picker" className="form-select" defaultValue={tahun} onChange={(e) => setTahun(e.target.value)}>
                <option value={0}>--Pilih Tahun--</option>
                {years.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {tipe === "Laporan Penjualan" ? (
          <div className="button-wrapper d-flex justify-content-end mt-4">
            {loading ? (
              <LoadingComponent />
            ) : (
              <button className="btn bg-purple" onClick={handleSubmitPenjualan} disabled={bulan == 0 || tahun == 0}>
                <i className="bx bxs-file-pdf"></i> Cetak Laporan
              </button>
            )}
          </div>
        ) : loading ? (
          <LoadingComponent />
        ) : (
          <button className="btn bg-purple" onClick={handleSubmitPenjualan}>
            <i className="bx bxs-file-pdf"></i> Cetak Laporan
          </button>
        )}
      </div>
      {pdfURL && <iframe src={pdfURL} width="100%" height="600px" title="Laporan" />}
    </>
  );
};

export default LaporanPages;
