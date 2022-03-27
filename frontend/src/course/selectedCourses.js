import React, { useEffect, useState } from "react";
import { Table, Button, FloatingLabel, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { Course } from "../models/course";
import { getStudentCourses, deleteCourse,addCourseToStudent, addStudentToCourse  } from '../redux/course-redux'

const SelectedCourses = () => {

  const courses = useSelector((state) => state.course.selectedCourses)
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const loading = useSelector((state) => state.course.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  console.log(token, loading)
  useEffect(() => {

    dispatch(getStudentCourses({ student_id: user._id, token: token }))

  }, [])

  const dropCourse = async(courseId) => {
    await dispatch(deleteCourse({ "course_id": courseId, "student_id": user._id, "token": token }))
    await dispatch(getStudentCourses({ student_id: user._id, token: token }))
  }

  if (!courses || loading) {
    return <Spinner animation="border" role="status" />
  }

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Section</th>
          <th>Semester</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((c) => (
          <tr>
            <td>{c.course_code}</td>
            <td>{c.course_name}</td>
            <td>{c.section}</td>
            <td><Button className="btn btn-danger" onClick={() => dropCourse(c._id)}>Drop</Button></td>
            <td>
            {
                  token?(<td><NavLink to={`/course/${c.course_code}`}>Edit</NavLink></td>):(<td>{c.course_code}</td>)
                }
                </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SelectedCourses;
