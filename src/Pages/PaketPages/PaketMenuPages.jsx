import React, { useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import TableComponent from "../../Component/TableComponent/TableComponent";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import { useContext } from "react";
import UserContext from "../../Context/UserContext/UserContext";
import scrollToTop from "../../Utils/ScrollToTop";

const PaketMenuPages = () => {
  const [paket, setPaket] = useState([]);
  const [show, setShow] = useState(false);
  const [tipeSubmit, setTipeSubmit] = useState("tambah");
  const [titleModal, setTitleModal] = useState("");
  const [idMenu, setIdMenu] = useState([{ menu: 0 }]);
  const [formCount, setFormCount] = useState(1);
  const [menu, setMenu] = useState([]);
  const [idLama, setIdLama] = useState(0);
  const [errorMenu, setErrorMenu] = useState(false);
  const [messageMenu, setMessageMenu] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingRender, setLoadingRender] = useState(false);
  const { dispatchUser } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();
  // deklarasi column
  const headers = [{ id: 1, header: "Nama Menu" }];
  // fungsi untuk menghapus form
  const handleRemoveForm = (index) => {
    setFormCount(formCount - 1);
    const newIdMenu = [...idMenu];
    newIdMenu.splice(index, 1);
    setIdMenu(newIdMenu);
  };

  // fungsi untuk mengubah nilai pada form
  const handleFormChange = (event, index) => {
    setErrorMenu(false);
    const { name, value } = event.target;
    const newIdMenu = [...idMenu];
    newIdMenu[index] = { ...newIdMenu[index], [name]: value };
    setIdMenu(newIdMenu);
  };

  // get Paket Menu By ID
  const getPaketMenu = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/show_menu/" + params.id);
    const result = await response.json();
    setPaket(result.paket_menu);
    setLoading(false);
  };
  // first rendering
  useEffect(() => {
    getPaketMenu();
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // getMenu
  const getMenu = async () => {
    setLoadingRender(true);
    const response = await fetch("http://127.0.0.1:8000/api/menu_prasmanan");
    const result = await response.json();
    setMenu(result.menu);
    setLoadingRender(false);
  };

  // handle add row
  const handleAddForm = () => {
    if (formCount <= 4) {
      setFormCount(formCount + 1);
      setIdMenu([...idMenu, { menu: 0 }]);
    } else {
      alert("Penambahan Form Maksimal 5 Buah!");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Menu?",
      text: "Anda yakin ingin menghapus menu ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus Data",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/delete_menu/" + params.id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            menu_id: id,
          }),
        });
        const result = await response.json();
        if (!result.status) {
          if (result.message === "Token is Expired") {
            localStorage.removeItem("token_admin");
            navigate("/login");
          }
        } else {
          toast.success(result.message);
          getPaketMenu();
        }
      }
    });
  };
  const handleShow = () => {
    setShow(true);
    setTipeSubmit("tambah");
    setTitleModal("Tambah Menu Paket");
    setErrorMenu(false);
    getMenu();
  };
  const getMenuById = (id) => {
    setShow(true);
    setErrorMenu(false);
    getMenu();
    setIdLama(id);
    setIdMenu([{ menu: id }]);
    setTipeSubmit("edit");
    setTitleModal("Edit Menu Paket");
  };
  const handleCloseModal = () => {
    setShow(false);
    setFormCount(1);
    setIdMenu([{ menu: 0 }]);
  };
  const handleSubmit = async () => {
    if (tipeSubmit === "tambah") {
      // Validasi
      const menus = idMenu.map((item) => item.menu);
      const filteredMenus = idMenu.filter((item) => item.menu.toString() === "0");
      const uniqueMenus = [...new Set(menus)];
      // console.log(filteredMenus);
      if (filteredMenus.length > 0) {
        Swal.fire({
          title: "Gagal!",
          text: "Opsi tidak boleh kosong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        // alert("Data yang dimasukkan tidak valid: opsi yang dipilih tidak boleh sama!");
        return;
      }
      if (menus.length !== uniqueMenus.length) {
        Swal.fire({
          title: "Gagal!",
          text: "Opsi yang dipilih tidak boleh sama!",
          icon: "error",
          confirmButtonText: "OK",
        });
        // alert("Data yang dimasukkan tidak valid: opsi yang dipilih tidak boleh sama!");
        return;
      }
    }
    const form = new FormData();
    idMenu.forEach((item) => {
      form.append("menu_id[]", item.menu);
    });
    setLoadingSubmit(true);
    const data = {
      menu_id_lama: idLama,
      menu_id: idMenu[0].menu,
    };
    const urlTambah = "http://127.0.0.1:8000/api/add_menu/" + params.id;
    const urlEdit = "http://127.0.0.1:8000/api/update_menu/" + params.id;
    const optionsTambah = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    };
    const optionsEdit = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(tipeSubmit === "tambah" ? urlTambah : urlEdit, tipeSubmit === "tambah" ? optionsTambah : optionsEdit);
    const result = await response.json();
    if (!result.status) {
      if (result.message === "Token is Expired") {
        Swal.fire({
          title: "Token Expired!",
          text: "Mohon maaf token sudah melewati batas waktu, silahkan login lagi!",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed || result.isDeniedbagabag) {
            localStorage.removeItem("token_admin");
            navigate("/login");
            dispatchUser({ type: "REMOVE_USER" });
          }
        });
      } else if (result.hasOwnProperty("form_validation") && tipeSubmit === "edit") {
        setErrorMenu(true);
        setMessageMenu(result.message.menu_id);
      } else if (result.hasOwnProperty("form_validation") && tipeSubmit === "tambah") {
        Swal.fire({
          title: "Gagal!",
          text: result.message.menu_id,
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      if (result.hasOwnProperty("existing")) {
        Swal.fire({
          title: "Gagal!",
          text: result.existing,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setLoadingSubmit(false);
    } else {
      toast.success(result.message);
      setFormCount(1);
      if (tipeSubmit === "tambah") {
        setIdMenu([{ menu: 0 }]);
      } else {
        setErrorMenu(false);
        setMessageMenu("");
      }
      setShow(false);
      getPaketMenu();
    }
    setLoadingSubmit(false);
  };
  return (
    <>
      <TitleComponent title={`Menu Paket`} />
      <Link className="btn btn-dark mb-2" to="/paket">
        <i className="bx bx-arrow-back"></i> Kembali
      </Link>
      <section className="p-4 border bg-greys rounded overflow-auto">
        {loading ? <LoadingComponent /> : <TableComponent data={paket} header={headers} sort={"nama_paket"} table="paket_menu" handleDelete={handleDelete} handleShow={handleShow} handleEdit={getMenuById} />}
      </section>
      <ModalComponent show={show} handleClose={handleCloseModal} title={titleModal} handleSubmit={handleSubmit} loading={loadingSubmit}>
        <div>
          {loadingRender ? (
            <LoadingComponent />
          ) : (
            <>
              {Array.from({ length: formCount }).map((_, index) => (
                <React.Fragment key={index}>
                  {formCount > 1 && index.toString() !== "0" ? (
                    <div className="d-flex justif-content-between mt-3">
                      <label className="fw-bold mb-2">Menu Olahan</label>&nbsp;
                      <span type="button" className="text-danger" onClick={() => handleRemoveForm(index)}>
                        X
                      </span>
                    </div>
                  ) : (
                    <label className="fw-bold mb-2">Menu Olahan</label>
                  )}
                  <select className={`form-select ${errorMenu ? "is-invalid" : ""}`} aria-label="Default select example" name="menu" onChange={(e) => handleFormChange(e, index)} value={idMenu[index] ? idMenu[index].menu : 0} required>
                    <option value={0}>Pilih Menu</option>
                    {menu.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.menu}
                      </option>
                    ))}
                  </select>
                  {errorMenu && <div className="invalid-feedback">{messageMenu}</div>}
                </React.Fragment>
              ))}
            </>
          )}
          {tipeSubmit === "tambah" && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary" onClick={handleAddForm}>
                <i className="bx bxs-plus-circle"></i>
              </button>
            </div>
          )}
        </div>
      </ModalComponent>
      <ToastContainer />
    </>
  );
};

export default PaketMenuPages;
