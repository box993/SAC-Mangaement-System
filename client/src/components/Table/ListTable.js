import React from "react";
import Table from "react-bootstrap/Table";
import "./tableStyles.css";

export default function ListTable(props) {
  return (
    <Table striped bordered responsive className="historyTable">
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>BITS ID</th>
          <th>Check-in Time</th>
          <th>Time left (hh:mm)</th>
        </tr>
      </thead>
      <tbody>
        {props.userList.map((user, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{user.fName}</td>
            <td>{user.lName}</td>
            <td>{user.bitsmail}</td>
            <td>{new Date(user.CheckIn).toLocaleString()}</td>
            <td>{user.TimeLeft}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
