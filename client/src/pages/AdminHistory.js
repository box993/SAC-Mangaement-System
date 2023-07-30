import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../components/Headers/AdminHeader";
import HistoryTable from "../components/Table/HistoryTable";
import Axios from "axios";

export default function AdminHistory(props) {
  let navigate = useNavigate();
  const { room } = useParams();

  const dummyData = [
    {
      fName: "John",
      lName: "Doe",
      bitsID: "f20200000",
      room: "Gym",
      checkIn: "11:34 AM Wednesday, April 18, 2022",
      checkOut: "12:40 AM Wednesday, April 18, 2022",
    },
    {
      fName: "Jane",
      lName: "Doe",
      bitsID: "f20200000",
      room: "Badminton",
      checkIn: "1:12 AM Wednesday, April 17, 2022",
      checkOut: "2:00 AM Wednesday, April 17, 2022",
    },
    {
      fName: "lul",
      lName: "aao",
      bitsID: "f20200420",
      room: "VM322",
      checkIn: "12:12 AM Wednesday, April 18, 2022",
      checkOut: "2:00 AM Wednesday, April 18, 2022",
    },
  ];

  const [history, setHistory] = useState(dummyData);

  useEffect(() => {
    Axios.get("http://localhost:2000/api/adminhistory", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      if (response.data.error) {
        console.log(response.data.error);
        // alert(response.data.error); // Why doesn't this give me the error which I set in middleware
        alert("Please log in");
        navigate("../login");
      } else {
        // console.log(response.data);
        setHistory(response.data);
      }
    });
  }, []);

  const styles = {
    textAlign: "center",
    marginTop: "1%",
  };

  return (
    <div>
      <AdminHeader room={room} />
      <h2 style={styles}>History</h2>
      <HistoryTable historyList={history} />;
    </div>
  );
}
