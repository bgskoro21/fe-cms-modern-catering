import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const locales = {
  id: id,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const KalenderComponent = ({ event = [] }) => {
  const navigate = useNavigate();
  const events = event.map((event) => {
    const dateParts = event.tanggal_acara.split("-");
    const timeParts = event.waktu_acara.split(":");
    const endTimeParts = event.waktu_selesai_acara.split(":");

    return {
      id: event.id,
      title: event.nama_pemesan,
      start: new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1]),
      end: new Date(dateParts[0], dateParts[1] - 1, dateParts[2], endTimeParts[0], endTimeParts[1]),
    };
  });

  //   handling on click select event
  const handleEventClick = (event) => {
    // Navigasi ke halaman detail transaksi dengan mengirim ID acara
    navigate("/data-transaksi/detail/" + event.id);
  };

  return (
    <div className="bg-white rounded mt-4 p-4 overflow-x-auto">
      <h1 className="mb-3">Kalender Event</h1>
      <div style={{ height: "500px" }}>
        <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" onSelectEvent={handleEventClick} />
      </div>
    </div>
  );
};

export default KalenderComponent;
