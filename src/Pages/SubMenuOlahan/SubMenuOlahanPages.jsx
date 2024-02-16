import React, { useState } from "react";
import TitleComponent from "../../Component/TitleComponent/TitleComponent";
import { useEffect } from "react";
import TableComponent from "../../Component/TableComponent/TableComponent";
import ModalComponent from "../../Component/ModalComponent/ModalComponent";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import Swal from "sweetalert2";
import scrollToTop from "../../Utils/ScrollToTop";
import { Link } from "react-router-dom";

const SubMenuOlahanPages = () => {
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingRender, setLoadingRender] = useState(true);
  const [show, setShow] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [formCount, setFormCount] = useState(1);
  const [formData, setFormData] = useState([{ sub_menu: "" }]);
  const [subMenu, setSubMenu] = useState([]);
  const [idSubMenu, setIdSubMenu] = useState(0);
  const [tipeSubmit, setTipeSubmit] = useState("tambah");
  const params = useParams();
  // state for handling error
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const [messageSubMenu, setMessageSubMenu] = useState("");
  const navigate = useNavigate();
  // header
  const column = [{ id: 2, header: "Sub Menu Olahan" }];

  //   get Sub Menu
  const getSubMenu = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/menu_prasmanan/" + params.id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setSubMenu(result.menu);
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
    setLoadingRender(false);
  };

  //   first rendering
  useEffect(() => {
    getSubMenu();
    scrollToTop();
    document.title = "Admin - Data Submenu";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // handling add form
  const handleAddForm = () => {
    if (formCount <= 4) {
      setFormCount(formCount + 1);
      setFormData([...formData, { sub_menu: "" }]);
    } else {
      alert("Form input maksimal 5!");
    }
  };
  // handling Remove Form
  const handleRemoveForm = (index) => {
    setFormCount(formCount - 1);
    const newFormData = [...formData];
    newFormData.splice(index, 1);
    setFormData(newFormData);
  };
  // handle change form
  const handleFormChange = (event, index) => {
    setMessageSubMenu("");
    setErrorSubMenu(false);
    const { name, value } = event.target;
    const newFormData = [...formData];
    newFormData[index] = { ...newFormData[index], [name]: value };
    setFormData(newFormData);
  };
  //   handleDelete Submenu
  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Data?",
      text: "Apakah anda yakin ingin menghapus data ini?",
      showCancelButton: true,
      confirmButtonText: "Hapus Data",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/sub_menu_prasmanan/" + id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
          },
        });
        const result = await response.json();
        if (result.message === "Token is Expired") {
          localStorage.removeItem("token_admin");
          navigate("/login");
        }
        toast.success(result.message);
        getSubMenu();
      }
    });
  };
  //   handle show modal tambah
  const handleShow = () => {
    setShow(true);
    setTipeSubmit("tambah");
    setTitleModal("Tambah Sub Menu");
  };
  //   handle show modal edit
  const getSubMenuById = async (id) => {
    setLoading(true);
    setShow(true);
    setTitleModal("Ubah Sub Menu");
    setTipeSubmit("edit");
    const response = await fetch("http://127.0.0.1:8000/api/sub_menu_prasmanan/" + id, {
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
    // setInputSubMenu(result.sub_menu.sub_menu);
    setFormData([{ sub_menu: result.sub_menu.sub_menu }]);
    setIdSubMenu(result.sub_menu.id);
    setLoading(false);
  };
  //   handling submit
  const handleSubmit = async () => {
    if (tipeSubmit === "tambah") {
      const subMenus = formData.map((item) => item.sub_menu);
      const filteredSubmenus = formData.filter((item) => item.sub_menu === "");
      const uniqueSubMenus = [...new Set(subMenus)];
      if (filteredSubmenus.length > 0) {
        Swal.fire({
          title: "Gagal!",
          text: "Submenu tidak boleh ada yang kosong!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      if (subMenus.length !== uniqueSubMenus.length) {
        Swal.fire({
          title: "Gagal!",
          text: "Submenu yang diinputkan tidak boleh sama!",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
    setLoadingSubmit(true);
    const form = new FormData();
    form.append("menu_prasmanan_id", params.id);
    formData.forEach((item) => {
      form.append("sub_menu[]", item.sub_menu);
    });

    const data = {
      menu_prasmanan_id: params.id,
      sub_menu: formData[0].sub_menu,
    };

    const urlEdit = "http://127.0.0.1:8000/api/sub_menu_prasmanan/" + idSubMenu;
    const urlTambah = "http://127.0.0.1:8000/api/sub_menu_prasmanan";
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
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        "Content-Type": "application/json",
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
            text: result.message.sub_menu,
            icon: "error",
            confirmButtonText: "OK",
          });
          setLoadingSubmit(false);
          return;
        } else {
          setErrorSubMenu(result.message.hasOwnProperty("sub_menu") ? true : false);
          setMessageSubMenu(result.message.hasOwnProperty("sub_menu") ? result.message.sub_menu : "");
        }
      }
    } else {
      toast.success(result.message);
      setFormCount(1);
      if (tipeSubmit === "tambah") {
        setFormData([{ sub_menu: "" }]);
      }
      getSubMenu();
      handleCloseModal();
    }
    setLoadingSubmit(false);
  };
  //   handle Close Modal
  const handleCloseModal = () => {
    setShow(false);
    setFormData([{ sub_menu: "" }]);
    setFormCount(1);
    setErrorSubMenu(false);
  };

  if (loadingRender) {
    return (
      <div style={{ height: "80vh" }} className="d-flex justify-content-center align-items-center">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <>
      <TitleComponent title={"Sub " + subMenu.menu} />
      <Link className="btn btn-dark mb-2" to="/menu">
        <i className="bx bx-arrow-back"></i> Kembali
      </Link>
      <section className="p-3 border rounded bg-greys overflow-auto">
        <TableComponent data={subMenu.sub_menu_prasmanans} header={column} sort={"sub_menu"} table="submenu" handleDelete={handleDelete} handleShow={handleShow} handleEdit={getSubMenuById} />
      </section>
      <ModalComponent show={show} handleClose={handleCloseModal} title={titleModal} handleSubmit={handleSubmit} loading={loadingSubmit}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <>
            {Array.from({ length: formCount }).map((_, index) => (
              <div className="mb-3" key={index}>
                <label className="fw-bold mb-2">
                  Nama Sub Menu
                  {formCount > 1 && index !== 0 ? (
                    <span type="button" onClick={() => handleRemoveForm(index)}>
                      <i className="bx bxs-x-circle text-danger"></i>
                    </span>
                  ) : (
                    ""
                  )}
                </label>
                <input
                  type="text"
                  className={`form-control ${errorSubMenu ? "is-invalid" : ""}`}
                  name="sub_menu"
                  placeholder="Masukkan nama submenu..."
                  value={formData[index].sub_menu}
                  onChange={(e) => handleFormChange(e, index)}
                  autoFocus
                />
                {errorSubMenu && <div className="invalid-feedback">{messageSubMenu}</div>}
              </div>
            ))}
            {tipeSubmit === "tambah" && (
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary" onClick={handleAddForm} disabled={formCount === 5}>
                  <i className="bx bxs-plus-circle"></i>
                </button>
              </div>
            )}
          </>
        )}
      </ModalComponent>
      <ToastContainer />
    </>
  );
};

export default SubMenuOlahanPages;
