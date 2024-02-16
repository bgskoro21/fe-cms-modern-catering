import React, { useState } from "react";
import { Table, Form, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./TableComponent.css";
import TableRowKategoriComponent from "../TableRow/Kategori/TableRowKategoriComponent";
import TableRowPaketComponent from "../TableRow/Paket/TableRowPaketComponent";
import { RowMenuOlahan } from "../TableRow/MenuOlahan/RowMenuOlahan";
import RowDataAdmin from "../TableRow/Admin/RowDataAdmin";
import RowPelanggan from "../TableRow/Pelanggan/RowPelanggan";
import RowOrder from "../TableRow/Order/RowOrder";
import RowTestimoni from "../TableRow/RowTestimoni/RowTestimoni";
import RowKonsultasiComponent from "../TableRow/Konsultasi/RowKonsultasiComponent";
import format from "date-fns/format";
import { id } from "date-fns/locale";

const TableComponent = ({ data, header, urlTambah, table, handleDelete, handleShow, handleEdit, openModal, showTambahButton = true, andalanClick, releaseClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDate, setFilterDate] = useState("");
  // const [sortBy, setSortBy] = useState("id");

  // const handleSort = (column) => {
  //   if (column === sortBy) {
  //     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //   } else {
  //     setSortBy(column);
  //     setSortOrder("asc");
  //   }
  // };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
    setCurrentPage(1);
  };

  let filteredData = [];
  if (table === "order") {
    filteredData = data.filter((item) => {
      const isNameMatch = item.nama_pemesan.toLowerCase().includes(searchTerm.toLowerCase());
      const isInvoiceMatch = item.no_invoice.toLowerCase().includes(searchTerm.toLowerCase());
      const isDateMatch = filterDate === "" || format(new Date(item.tanggal_pemesanan), "EEEE, dd MMMM yyyy", { locale: id }) === format(new Date(filterDate), "EEEE, dd MMMM yyyy", { locale: id });

      if (filterDate === "") {
        return isNameMatch || isInvoiceMatch;
      } else {
        return (isNameMatch && isDateMatch) || (isInvoiceMatch && isDateMatch);
      }
    });
  } else if (table === "kategori") {
    filteredData = data.filter((item) => item.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));
  } else if (table === "menu") {
    filteredData = data.filter((item) => item.menu.toLowerCase().includes(searchTerm.toLowerCase()));
  } else if (table === "submenu") {
    filteredData = data.filter((item) => item.sub_menu.toLowerCase().includes(searchTerm.toLowerCase()));
  } else if (table === "paket") {
    filteredData = data.filter((item) => item.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));
  } else if (table === "paket_menu") {
    filteredData = data.filter((item) => item.menu.toLowerCase().includes(searchTerm.toLowerCase()));
  } else if (table === "admin") {
    filteredData = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.no_hp.includes(searchTerm));
  } else if (table === "pelanggan") {
    filteredData = data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.no_hp.includes(searchTerm));
  } else if (table === "testimoni") {
    filteredData = data.filter((item) => item.message.toLowerCase().includes(searchTerm.toLowerCase()) || item.order.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  } else {
    filteredData = data.filter((item) => item.no_hp.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  // const sortedData = filteredData.sort((a, b) => {
  //   const isAscending = sortOrder === "asc" ? 1 : -1;
  //   return a[sortBy] > b[sortBy] ? -isAscending : isAscending;
  // });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="d-flex justify-content-end">
        <div className="col-md-9">
          {showTambahButton ? (
            urlTambah ? (
              <Link to={urlTambah} className="btn bg-blue">
                <div className="d-flex align-items-center">
                  <i className="bx bx-plus-circle fs-5"></i>&nbsp; Tambah Data
                </div>
              </Link>
            ) : (
              <button className="btn bg-blue" onClick={handleShow}>
                <div className="d-flex align-items-center">
                  <i className="bx bx-plus-circle fs-5"></i>&nbsp; Tambah Data
                </div>
              </button>
            )
          ) : (
            table === "order" && (
              <div className="form-tanggal d-flex justify-content-center align-items-center w-50">
                <input type="date" className="form-control" onChange={(e) => setFilterDate(e.target.value)} /> &nbsp;
              </div>
            )
          )}
        </div>
        <div className="col-md-3">
          <Form.Group controlId="formSearch" className="mb-3">
            <Form.Control type="text" placeholder="Search by Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Form.Group>
        </div>
      </div>

      <Table bordered striped hover>
        <thead>
          <tr>
            <th className={table === "order" ? "text-start" : "text-center"}>{table === "order" ? "Nomor Invoice" : "No"}</th>
            {header.map((column) => (
              <th className="text-center" key={column.id}>
                {column.header}
              </th>
            ))}
            <th className="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length !== 0 ? (
            currentItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {table === "kategori" && <TableRowKategoriComponent no={index + 1} nama_kategori={item.nama_kategori} description={item.description} id={item.id} min_order={item.min_order} handleClickDelete={() => handleDelete(item.id)} />}
                {table === "paket" && (
                  <TableRowPaketComponent
                    no={index + 1}
                    kategori={item.kategori.nama_kategori}
                    gambar={item.gambar_paket}
                    nama={item.nama_paket}
                    harga={item.harga}
                    andalan={item.is_andalan}
                    release={item.is_release}
                    satuan={item.satuan}
                    handleClickAndalan={() => andalanClick(item.id)}
                    handleClickRelease={() => releaseClick(item.id)}
                    id={item.id}
                    handleClickDelete={() => handleDelete(item.id)}
                    openModal={() => openModal(item.id)}
                  />
                )}
                {table === "menu" && <RowMenuOlahan no={index + 1} id={item.id} menu={item.menu} handleClickDelete={() => handleDelete(item.id)} handleClickEdit={() => handleEdit(item.id)} />}
                {table === "submenu" && <RowMenuOlahan no={index + 1} id={item.id} menu={item.sub_menu} handleClickDelete={() => handleDelete(item.id)} handleClickEdit={() => handleEdit(item.id)} submenu={true} />}
                {table === "paket_menu" && <RowMenuOlahan no={index + 1} id={item.id} menu={item.menu} handleClickDelete={() => handleDelete(item.id_menu)} handleClickEdit={() => handleEdit(item.id_menu)} submenu={true} />}
                {table === "admin" && <RowDataAdmin no={index + 1} id={item.id} name={item.name} alamat={item.alamat} hp={item.no_hp} email={item.email} foto={item.profile_pic} handleClickDelete={() => handleDelete(item.id)} />}
                {table === "pelanggan" && (
                  <RowPelanggan no={index + 1} id={item.id} name={item.name} alamat={item.alamat} verified={item.email_verified_at} email={item.email} foto={item.profile_picture} handleClickDelete={() => handleDelete(item.id)} />
                )}
                {table === "konsultasi" && <RowKonsultasiComponent no={index + 1} nama={item.name} status={item.status} no_hp={item.no_hp} pesan={item.pesan} handleClickReply={() => handleEdit(item.id)} />}
                {table === "order" && <RowOrder no={item.no_invoice} id={item.id} nama={item.nama_pemesan} tpemesanan={item.tanggal_pemesanan} tacara={item.tanggal_acara} total={item.total} status={item.status} />}
                {table === "testimoni" && (
                  <RowTestimoni
                    no={index + 1}
                    id={item.id}
                    nama={item.order.user.name}
                    nilai={item.nilai}
                    message={item.message}
                    status={item.status}
                    onTerima={() => handleEdit(item.id, "terima")}
                    onTolak={() => handleEdit(item.id, "tolak")}
                    onClickDelete={() => handleDelete(item.id)}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={header.length + 2} className="text-center">
                Data Tidak Ditemukan!
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Form.Group controlId="formItemsPerPage">
            <Form.Control as="select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </Form.Control>
          </Form.Group>
          &nbsp;
          <div className="mt-2">
            Menampilkan {indexOfFirstItem + 1} s/d {indexOfLastItem > filteredData.length ? filteredData.length : indexOfLastItem} dari {filteredData.length} data
          </div>
        </div>

        <div>
          <Pagination>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
            {pageNumbers.map((pageNumber) => (
              <Pagination.Item key={pageNumber} active={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
                {pageNumber}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
          </Pagination>
        </div>
      </div>
    </div>
  );
};
export default TableComponent;
