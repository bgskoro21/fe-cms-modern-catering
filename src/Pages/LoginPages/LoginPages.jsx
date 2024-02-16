import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPages.css";
import LoadingComponent from "../../Component/LoadingComponent/LoadingComponent";
import { useContext } from "react";
import UserContext from "../../Context/UserContext/UserContext";
import scrollToTop from "../../Utils/ScrollToTop";

const LoginPages = () => {
  const { dispatchUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin - Login";
    scrollToTop();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setErrorEmail(true);
      setErrorEmailMessage("Email tidak boleh kosong!");
      setErrorPassword(true);
      setErrorPasswordMessage("Password tidak boleh kosong!");
      return false;
    }

    setLoading(true);
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    const response = await fetch("http://127.0.0.1:8000/api/admin/login", {
      method: "POST",
      body: form,
    });
    const result = await response.json();
    if (!result.status) {
      setLoading(false);
      setErrorLogin(result.message);
    } else {
      localStorage.setItem("token_admin", result.token);
      dispatchUser({ type: "SET_USER", payload: result.user });
      navigate("/");
    }
  };
  return (
    <section id="login" className="d-flex justify-content-center align-items-center">
      <div className="col-md-4 bg-white p-4 rounded bg-greys">
        <h3 className="text-center fw-bold">ADMIN MODERN</h3>
        <p className="text-center">Silahkan Login Pada Form Dibawah Ini</p>
        {errorLogin !== "" && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {errorLogin}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setErrorLogin("")}></button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control ${errorEmail && "is-invalid"}`}
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(event) => {
                setEmail(event.target.value);
                errorEmail === true && setErrorEmail(false);
              }}
              autoFocus
            />
            <label htmlFor="floatingInput">Username</label>
            <div className="invalid-feedback">{errorEmailMessage}</div>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className={`form-control ${errorPassword && "is-invalid"}`}
              id="floatingPassword"
              placeholder="Password"
              onChange={(event) => {
                setPassword(event.target.value);
                errorPassword === true && setErrorPassword(false);
              }}
            />
            <label htmlFor="floatingPassword">Password</label>
            <div className="invalid-feedback">{errorPasswordMessage}</div>
          </div>
          <div className="d-flex justify-content-end">
            {loading ? (
              <LoadingComponent />
            ) : (
              <button className="btn bg-blue px-4 d-flex align-items-center" type="submit">
                <i className="bx bx-log-in-circle"></i>&nbsp; Login
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPages;
