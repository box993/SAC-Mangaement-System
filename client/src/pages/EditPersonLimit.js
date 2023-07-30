import React from "react";
import { useParams } from "react-router-dom";
import AdminHeader from "../components/Headers/AdminHeader";
import EditPersonLimitForm from "../components/CheckInForm/EditPersonLimitForm";

export default function EditPersonLimit() {
  const { room } = useParams();

  return (
    <div>
      <AdminHeader room={room} />
      <EditPersonLimitForm room={room} />
    </div>
  );
}
