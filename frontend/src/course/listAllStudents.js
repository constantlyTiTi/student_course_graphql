import React, { useEffect, useState } from 'react'
import { Table, Button, FloatingLabel, Spinner } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import {listAllStudentsRedux} from '../redux/student-redux'

const ListAllstudent=()=>{
  const dispatch = useDispatch()
const {students} = useSelector((state) => state.student)
const loading = useSelector((state) => state.student.loading)
useEffect(()=>{
  dispatch(listAllStudentsRedux())
  console.log(students)
},[])


if(!students || loading){
  return <Spinner animation="border" role="status" />
}

return(
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Student name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>email</th>
          <th>City</th>
          <th>StudentNo</th>
        </tr>
      </thead>
      <tbody>
        {students&&students.map((s) => (
          <tr>
            <td>{`${s.first_name} ${s.last_name}`}</td>
            <td>{s.address}</td>
            <td>{s.phone_number}</td>
            <td>{s.email}</td>
            <td>{s.city}</td>
            <td>{s.student_number}</td>
          </tr>
        ))}
      </tbody>
    </Table>
)

}

export default ListAllstudent