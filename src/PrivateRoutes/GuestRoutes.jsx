import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export default function GuestRoute() {
  let token = localStorage.getItem("token_admin") == null ? false : true;
  return <>{!token ? <Outlet /> : <Navigate to="/" />}</>;
}
