import React, { useEffect, useState } from "react";
import StudentHeader from "../components/Headers/StudentHeader";
import HistoryTable from "../components/Table/HistoryTable";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentHistory(props) {
  let navigate = useNavigate();

  const dummyData = [
    {
      fName: "John",
      lName: "Doe",
      bitsID: "f20200000",
      room: "Gym",
      checkIn: "11:34 AM Wednesday, April 18, 2022",
      checkOut: "12:40 AM Wednesday, April 18, 2022",
    },
  ];

  const [history, setHistory] = useState(dummyData);

  useEffect(() => {
    Axios.get("http://localhost:2000/api/studenthistory", {
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
      <StudentHeader />
      <h2 style={styles}>History</h2>
      <HistoryTable historyList={history} />;
    </div>
  );
}
