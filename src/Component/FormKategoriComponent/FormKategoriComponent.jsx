import React from "react";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import JoditEditor from "jodit-react";

export const InputFileComponent = ({ handleFileChange, preview, fileInputRef, label, isInvalid = false, message }) => {
  return (
    <div className="row mb-3">
      <div className="col-3 d-flex align-items-end">
        <span className="fw-bold">{label}</span>
      </div>
      <div className="col-7">
        {preview !== "" && <img src={preview} alt="Gambar" className="img-fluid rounded mb-2" width={100} style={{ cursor: "pointer" }} />}
        <input type="file" placeholder="Nama Kategori" className={`form-control ${isInvalid ? "is-invalid" : ""}`} onChange={handleFileChange} ref={fileInputRef} accept="image/*" />
        {isInvalid && <div className="invalid-feedback">{message}</div>}
      </div>
    </div>
  );
};

export const InputNamaComponent = ({ handleNamaChange, nama, label, placeholder, password, isInvalid = false, message }) => {
  return (
    <div className="row mb-3">
      <div className="col-3 d-flex align-items-center">
        <span className="fw-bold">{label}</span>
      </div>
      <div className="col-7">
        <input type={password ? "password" : "text"} placeholder={placeholder} className={`form-control ${isInvalid ? "is-invalid" : ""}`} value={nama} onChange={handleNamaChange} autoFocus />
        {isInvalid && <div className="invalid-feedback">{message}</div>}
      </div>
    </div>
  );
};

export const InputDescriptionComponent = ({ handleDescChange, desc, isInvalid = false, message }) => {
  return (
    <div className="row mb-3">
      <div className="col-3 d-flex align-items-center">
        <span className="fw-bold">Deskripsi Kategori</span>
      </div>
      <div className="col-7">
        <JoditEditor value={desc} onChange={handleDescChange} />
        {isInvalid && <div className="text-danger">{message}</div>}
        {/* <textarea type="text" placeholder="Deskripsi Kategori" className="form-control" style={{ height: 230 }} onChange={handleDescChange} value={desc} required /> */}
      </div>
    </div>
  );
};

export const ButtonKategoriComponent = ({ handleResetClick, loading }) => {
  return (
    <div className="row">
      <div className="col-6">
        <button type="reset" className="btn bg-red d-flex align-items-center" onClick={handleResetClick}>
          <i className="bx bx-reset"></i> &nbsp; Reset
        </button>
      </div>
      <div className="col-6 d-flex justify-content-end">
        {loading ? (
          <LoadingComponent />
        ) : (
          <button type="submit" className="btn bg-purple d-flex align-items-center">
            <i className="bx bx-send"></i> &nbsp; Submit
          </button>
        )}
      </div>
    </div>
  );
};

export const InputSelectComponent = ({ label, kategori, handleSelectedChange, error, selected, isInvalid = false, message }) => {
  return (
    <div className="row mb-3">
      <div className="col-3 d-flex align-items-center">
        <span className="fw-bold">{label}</span>
      </div>
      <div className="col-7">
        <select className={`form-select ${error && "is-invalid"}`} aria-label="Default select example" onChange={handleSelectedChange} value={selected}>
          <option value={0}>Pilih {label}</option>
          {kategori.map((item, index) => (
            <option key={index} value={item.id}>
              {item.nama_kategori}
            </option>
          ))}
        </select>
        {isInvalid && <div className="invalid-feedback">{message}</div>}
        {/* <div className="invalid-feedback">Pilih Kategori Terlebih Dahulu</div> */}
      </div>
    </div>
  );
};

export const InputNumberComponent = ({ label, handleNumberChange, harga, isInvalid = false, message }) => {
  return (
    <div className="row mb-3">
      <div className="col-3 d-flex align-items-center">
        <span className="fw-bold">{label}</span>
      </div>
      <div className="col-7">
        <input type="number" className={`form-control ${isInvalid ? "is-invalid" : ""}`} onChange={handleNumberChange} value={harga} />
        {isInvalid && <div className="invalid-feedback">{message}</div>}
      </div>
    </div>
  );
};

export const FloatingLabelsComponent = (props) => {
  return (
    <div className="form-floating mb-3">
      <input type={props.type} class="form-control" id="floatingInput" onChange={props.onChange} autoFocus={props.autofocus} />
      <label htmlFor="floatingInput">{props.label}</label>
    </div>
  );
};
