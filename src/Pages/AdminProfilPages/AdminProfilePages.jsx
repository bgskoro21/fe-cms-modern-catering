import React, { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import UserContext from "../../Context/UserContext/UserContext";
import { ToastContainer, toast } from "react-toastify";
import scrollToTop from "../../Utils/ScrollToTop";

const AdminProfilePages = () => {
  const { userState, dispatchUser } = useContext(UserContext);
  const fileInputRef = useRef();
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState(false);
  const [messageName, setMessageName] = useState("");
  const [alamat, setAlamat] = useState("");
  const [errorAlamat, setErrorAlamat] = useState(false);
  const [messageAlamat, setMessageAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [errorNoHp, setErrorNoHp] = useState(false);
  const [messageNoHp, setMessageNoHp] = useState("");
  const [profile, setProfile] = useState(null);
  const [errorProfile, setErrorProfile] = useState(false);
  const [messageProfile, setMessageProfile] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errorOldPassword, setErrorOldPassword] = useState(false);
  const [messageOldPassword, setMessageOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [messagePassword, setMessagePassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [errorPasswordConf, setErrorPasswordConf] = useState(false);
  const [messagePasswordConf, setMessagePasswordConf] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  //   first rendering
  useEffect(() => {
    document.title = "Admin - Profile";
    scrollToTop();
    getAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   get User by Id
  // get Authenticated User
  const getAuthUser = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/admin/auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setAdmin(result.user);
      setName(result.user.name);
      setAlamat(result.user.alamat);
      setNoHp(result.user.no_hp);
      setPreview(result.user.profile_pic);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  //   handle click button upload
  const handleUpload = () => {
    fileInputRef.current.click();
  };

  //   handling submit update profile
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    // console.log(profile);
    const form = new FormData();
    if (profile !== null) {
      form.append("profile_pic", profile);
    }
    form.append("name", name);
    form.append("alamat", alamat);
    form.append("no_hp", noHp);

    const response = await fetch("http://127.0.0.1:8000/api/admin/update/" + userState.user.id, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
      body: form,
    });
    const result = await response.json();
    if (result.status) {
      Swal.fire({
        title: "Sukses!",
        text: result.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      dispatchUser({
        type: "UPDATE_USER",
        payload: {
          name: name,
          profile_pic: preview,
          alamat: alamat,
          no_hp: noHp,
        },
      });
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
      if (result.hasOwnProperty("form_validation")) {
        setErrorName(result.message.hasOwnProperty("name") ? true : false);
        setErrorAlamat(result.message.hasOwnProperty("alamat") ? true : false);
        setErrorNoHp(result.message.hasOwnProperty("no_hp") ? true : false);
        setErrorProfile(result.message.hasOwnProperty("profile_pic") ? true : false);
        setMessageName(result.message.hasOwnProperty("name") ? result.message.name : false);
        setMessageAlamat(result.message.hasOwnProperty("alamat") ? result.message.alamat : false);
        setMessageNoHp(result.message.hasOwnProperty("no_hp") ? result.message.no_hp : false);
        setMessageProfile(result.message.hasOwnProperty("profile_pic") ? result.message.profile_pic : false);
      }
    }
    setLoadingSubmit(false);
    setProfile(null);
    getAuthUser();
  };
  //   handle delete profile picture
  const handleDeleteProfilePicture = async () => {
    Swal.fire({
      title: "Hapus Foto Profil!",
      text: "Apakah anda yakin ingin menghapus foto profil anda?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch("http://127.0.0.1:8000/api/admin/update/" + admin.id, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
          },
        });
        const result = await response.json();
        console.log(result);
        if (result.status) {
          toast.success(result.message);
          dispatchUser({ type: "DELETE_PROFILE_PICTURE" });
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
        getAuthUser();
      }
    });
  };
  //   handling change password
  const handleChangePassword = async () => {
    setLoadingSubmit(true);
    const data = {
      old_password: oldPassword,
      password: password,
      password_confirmation: passwordConf,
    };

    const response = await fetch("http://127.0.0.1:8000/api/admin/change-password/" + userState.user.id, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
          timer: 2000,
        }).then((result) => {
          if (result.isConfirmed || result.isDenied || result.isDenied) {
            navigate("/login");
            localStorage.removeItem("token_admin");
          }
        });
      } else {
        toast.error(result.message);
      }
      if (result.hasOwnProperty("form_validation")) {
        setErrorOldPassword(result.message.hasOwnProperty("old_password") ? true : false);
        setErrorPassword(result.message.hasOwnProperty("password") ? true : false);
        setErrorPasswordConf(result.message.hasOwnProperty("password_confirmation") ? true : false);
        setMessageOldPassword(result.message.hasOwnProperty("old_password") ? result.message.old_password : false);
        setMessagePassword(result.message.hasOwnProperty("password") ? result.message.password : false);
        setMessagePasswordConf(result.message.hasOwnProperty("password_confirmation") ? result.message.password_confirmation : false);
      }
    }
    setLoadingSubmit(false);
    setOldPassword("");
    setPassword("");
    setPasswordConf("");
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <LoadingComponent />
      </div>
    );
  }
  return (
    <main className="p-3">
      <h3>Profile</h3>
      <div className="row d-flex mt-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
              <img src={admin.profile_pic ? admin.profile_pic : "http://cdn.onlinewebfonts.com/svg/img_329115.png"} alt="Profile" className="rounded-circle img-fluid" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <h2 className="mt-3">{admin.name}</h2>
              <h3>{admin.role}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body pt-3">
              <ul className="nav nav-tabs nav-tabs-bordered">
                <li className="nav-item">
                  <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">
                    Overview
                  </button>
                </li>

                <li className="nav-item">
                  <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">
                    Edit Profile
                  </button>
                </li>

                <li className="nav-item">
                  <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">
                    Change Password
                  </button>
                </li>
              </ul>
              <div className="tab-content pt-2">
                <div className="tab-pane fade show active profile-overview bg-light text-dark" id="profile-overview">
                  <h5 className="card-title">Profile Details</h5>

                  <div className="row mb-2">
                    <div className="col-lg-3 col-md-4 label ">Nama Admin</div>
                    <div className="col-lg-9 col-md-8">{admin.name}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-lg-3 col-md-4 label">Username</div>
                    <div className="col-lg-9 col-md-8">{admin.email}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-lg-3 col-md-4 label">Posisi</div>
                    <div className="col-lg-9 col-md-8">{admin.role}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-lg-3 col-md-4 label">Alamat</div>
                    <div className="col-lg-9 col-md-8">{admin.alamat}</div>
                  </div>

                  <div className="row">
                    <div className="col-lg-3 col-md-4 label">Nomor HP</div>
                    <div className="col-lg-9 col-md-8">{admin.no_hp}</div>
                  </div>
                </div>

                <div className="tab-pane fade profile-edit pt-3 bg-light text-dark" id="profile-edit">
                  <div className="row mb-3">
                    <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">
                      Profile Image
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <img src={preview ? preview : "http://cdn.onlinewebfonts.com/svg/img_329115.png"} alt="Profile" className="img-fluid rounded-circle" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                      <input type="file" style={{ display: "none" }} ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                      <div className="pt-2">
                        <button className="btn btn-primary btn-sm" title="Upload new profile image" onClick={() => handleUpload()}>
                          <i className="bx bx-upload"></i>
                        </button>
                        &nbsp;
                        {admin.profile_pic && (
                          <button className="btn btn-danger btn-sm" title="Remove my profile image" onClick={handleDeleteProfilePicture}>
                            <i className="bx bx-trash"></i>
                          </button>
                        )}
                      </div>
                      {errorProfile && <span className="text-danger">{messageProfile}</span>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="fullName" className="col-md-4 col-lg-3 col-form-label">
                      Nama Lengkap
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="fullName"
                        type="text"
                        className={`form-control ${errorName ? "is-invalid" : ""}`}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrorName(false);
                          setMessageName("");
                        }}
                      />
                      {errorName && <div className="invalid-feedback">{messageName}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="about" className="col-md-4 col-lg-3 col-form-label">
                      Alamat
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="fullName"
                        type="text"
                        className={`form-control ${errorAlamat ? "is-invalid" : ""}`}
                        value={alamat}
                        onChange={(e) => {
                          setAlamat(e.target.value);
                          setErrorAlamat(false);
                          setMessageAlamat("");
                        }}
                      />
                      {errorAlamat && <div className="invalid-feedback">{messageAlamat}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="company" className="col-md-4 col-lg-3 col-form-label">
                      No HP
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="company"
                        type="text"
                        className={`form-control ${errorNoHp ? "is-invalid" : ""}`}
                        id="company"
                        value={noHp}
                        onChange={(e) => {
                          setNoHp(e.target.value);
                          setErrorNoHp(false);
                          setMessageNoHp("");
                        }}
                      />
                      {errorNoHp && <div className="invalid-feedback">{messageNoHp}</div>}
                    </div>
                  </div>

                  <div className="text-center">
                    {loadingSubmit ? (
                      <LoadingComponent />
                    ) : (
                      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                        Save Changes
                      </button>
                    )}
                  </div>
                </div>

                <div className="tab-pane fade pt-3 bg-light text-dark" id="profile-change-password">
                  <div className="row mb-3">
                    <label htmlFor="currentPassword" className="col-md-4 col-lg-3 col-form-label">
                      Current Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="password"
                        type="password"
                        className={`form-control ${errorOldPassword ? "is-invalid" : ""}`}
                        id="currentPassword"
                        value={oldPassword}
                        onChange={(e) => {
                          setErrorOldPassword(false);
                          setMessageOldPassword("");
                          setOldPassword(e.target.value);
                        }}
                      />
                      {errorOldPassword && <div className="invalid-feedback">{messageOldPassword}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="newPassword" className="col-md-4 col-lg-3 col-form-label">
                      New Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="newpassword"
                        type="password"
                        className={`form-control ${errorPassword ? "is-invalid" : ""}`}
                        id="newPassword"
                        value={password}
                        onChange={(e) => {
                          setErrorPassword(false);
                          setMessagePassword("");
                          setPassword(e.target.value);
                        }}
                      />
                      {errorPassword && <div className="invalid-feedback">{messagePassword}</div>}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="renewPassword" className="col-md-4 col-lg-3 col-form-label">
                      Re-enter New Password
                    </label>
                    <div className="col-md-8 col-lg-9">
                      <input
                        name="renewpassword"
                        type="password"
                        className={`form-control ${errorPasswordConf ? "is-invalid" : ""}`}
                        id="renewPassword"
                        value={passwordConf}
                        onChange={(e) => {
                          setErrorPasswordConf(false);
                          setMessagePasswordConf("");
                          setPasswordConf(e.target.value);
                        }}
                      />
                      {errorPasswordConf && <div className="invalid-feedback">{messagePasswordConf}</div>}
                    </div>
                  </div>

                  <div className="text-center">
                    {loadingSubmit ? (
                      <LoadingComponent />
                    ) : (
                      <button type="submit" className="btn btn-primary" onClick={handleChangePassword}>
                        Change Password
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default AdminProfilePages;
