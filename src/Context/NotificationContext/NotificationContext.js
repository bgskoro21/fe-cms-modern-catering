import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifAmount, setNotifAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token_admin")) {
      getNotifikasi();
      const interval = setInterval(getNotifikasi, 10000);
      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line
  }, [localStorage.getItem("token_admin")]);
  const getNotifikasi = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/notifikasi-amount", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token_admin")}`,
      },
    });
    const result = await response.json();
    if (result.status) {
      setNotifAmount(result.amount);
    } else {
      navigate("/login");
      localStorage.removeItem("token_admin");
    }
  };

  return <NotificationContext.Provider value={{ notifAmount }}>{children}</NotificationContext.Provider>;
};
