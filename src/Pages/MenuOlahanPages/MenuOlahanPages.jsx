import React, { useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import TableComponent from "../../Component/TableComponent/TableComponent";
import { useEffect } from "react";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import scrollToTop from "../../Utils/ScrollToTop";

const MenuOlahanPages = () => {
  const [menu, setMenu] = useState([]);
  const [idMenu, setIdMenu] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingRender, setLoadingRender] = useState(true);
  const [tipeSubmit, setTipeSubmit] = useState("tambah");
  const [titleModal, setTitleModal] = useState("");
  const [errorMenu, setErrorMenu] = useState(false);
  const [messageMenu, setMessageMenu] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formCount, setFormCount] = useState(1);
  const [formData, setFormData] = useState([{ menu: "" }]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  // column table
  const column = [{ id: 1, header: "Menu Olahan" }];
  //   get Menu
  const getMenu = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/menu_prasmanan");
    const result = await response.json();
    setMenu(result.menu);
    setLoadingRender(false);
  };
  //   first rendering
  useEffect(() => {
    getMenu();
    scrollToTop();
    document.title = "Admin - Data Menu";
  }, []);
  // handling add row Form
  const handleAddForm = () => {
    if (formCount <= 4) {
      setFormCount(formCount + 1);
      setFormData([...formData, { menu: "" }]);
    } else {
      alert("Penambahan Form Maksimal 5 Buah!");
    }
  };
  // handling form change
  const handleFormChange = (event, index) => {
    const { name, value } = event.target;
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);
  };
  // fungsi untuk menghapus form
  const handleRemoveForm = (index) => {
    setFormCount(formCount - 1);
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };
  //   handling delete menu
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus Data",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/menu_prasmanan/" + id, {
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
        getMenu();
      }
    });
  };
  //   handle Show Modal
  const handleShow = () => {
    setShow(true);
    setLoading(true);
    setLoading(false);
    setTipeSubmit("tambah");
    setLoadingSubmit(false);
    setTitleModal("Tambah Menu");
    setFormCount(1);
    setFormData([{ menu: "" }]);
  };
  //   handleSubmit
  const handleSubmit = async () => {
    if (tipeSubmit === "tambah") {
      const menus = formData.map((item) => item.menu);
      const filteredMenus = formData.filter((item) => item.menu === "");
      const uniqueMenus = [...new Set(menus)];
      if (filteredMenus.length > 0) {
        Swal.fire({
          title: "Gagal!",
          text: "Inputan menu tidak boleh ada yang kosong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        // alert("Data yang dimasukkan tidak valid: opsi yang dipilih tidak boleh sama!");
        return;
      }
      if (menus.length !== uniqueMenus.length) {
        Swal.fire({
          title: "Gagal!",
          text: "Menu yang diinputkan tidak boleh sama!",
          icon: "error",
          confirmButtonText: "OK",
        });
        // alert("Data yang dimasukkan tidak valid: opsi yang dipilih tidak boleh sama!");
        return;
      }
    }
    setLoadingSubmit(true);
    const form = new FormData();
    formData.forEach((item) => {
      form.append("menu[]", item.menu);
    });
    const data = {
      menu: formData[0].menu,
    };
    const urlTambah = "http://127.0.0.1:8000/api/menu_prasmanan";
    const urlEdit = "http://127.0.0.1:8000/api/menu_prasmanan/" + idMenu;
    const optionTambah = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    };
    const optionEdit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(tipeSubmit === "tambah" ? urlTambah : urlEdit, tipeSubmit === "tambah" ? optionTambah : optionEdit);
    const result = await response.json();
    if (!result.status) {
      if (result.message === "Token is Expired") {
        localStorage.removeItem("token_admin");
        navigate("/login");
      } else if (result.hasOwnProperty("form_validation")) {
        if (tipeSubmit === "tambah") {
          Swal.fire({
            title: "Gagal!",
            text: result.message.menu,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setErrorMenu(true);
          setMessageMenu(result.message.menu);
        }
      }
    } else {
      toast.success(result.message);
      setFormCount(1);
      if (tipeSubmit === "tambah") {
        setFormData([{ menu: "" }]);
      } else {
        setErrorMenu(false);
        setMessageMenu("");
      }
      getMenu();
      setShow(false);
    }
    setLoadingSubmit(false);
  };
  //   handle get menu by id
  const getMenuById = async (id) => {
    handleShow(true);
    setLoading(true);
    setTipeSubmit("edit");
    setTitleModal("Ubah Menu");
    const response = await fetch("http://127.0.0.1:8000/api/menu_prasmanan/" + id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    setFormData([{ menu: result.menu.menu }]);
    setIdMenu(id);
    setLoadingSubmit(false);
    setLoading(false);
  };
  return (
    <>
      <TitleComponent title="Menu Olahan" />
      <section className="p-3 rounded border bg-greys overflow-auto">
        {loadingRender ? <LoadingComponent /> : <TableComponent data={menu} header={column} sort={"menu"} table="menu" handleDelete={handleDelete} handleShow={handleShow} handleEdit={getMenuById} />}
      </section>
      <ModalComponent
        show={show}
        handleClose={() => {
          setShow(false);
          setErrorMenu(false);
          setMessageMenu("");
        }}
        handleSubmit={handleSubmit}
        loading={loadingSubmit}
        title={titleModal}
      >
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            {Array.from({ length: formCount }).map((_, index) => (
              <div className="mb-3" key={index}>
                {formCount > 1 && index !== 0 ? (
                  <div className="d-flex">
                    <label className="fw-bold mb-2">Nama Menu</label>&nbsp;
                    <span type="button" onClick={() => handleRemoveForm(index)}>
                      <i className="bx bxs-x-circle text-danger"></i>
                    </span>
                  </div>
                ) : (
                  <label className="fw-bold mb-2">Nama Menu</label>
                )}
                <input type="text" className={`form-control ${errorMenu ? "is-invalid" : ""}`} name={`menu`} placeholder="Masukkan nama menu..." value={formData[index].menu} onChange={(event) => handleFormChange(event, index)} autoFocus />
                {errorMenu && <div className="invalid-feedback">{messageMenu}</div>}
              </div>
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
      </ModalComponent>
      <ToastContainer />
    </>
  );
};

export default MenuOlahanPages;
