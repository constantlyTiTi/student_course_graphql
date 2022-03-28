import React, { useEffect, useState } from "react";
import { Table, Button, FloatingLabel, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { Course } from "../models/course";
import { getStudentCourses, deleteCourse, setCourseInfo } from '../redux/course-redux'
import { gql, useMutation, useQuery } from "@apollo/client";
const SELECTED_COURSES = gql`
query getCoursesByStudent($student_id: String) {
  getCoursesByStudent(student_id: $student_id) {
    _id
    course_code
    course_name
    section
    semester
    students{
      _id
      first_name
      last_name
      student_number
      address
      city
      phone_number
      email
      password
      program
    }
  }
}`

const DELETE_COURSE = gql`
mutation deleteCourse($course_id: String!,
  $student_id: String!) {
  deleteCourse(course_id:$course_id,student_id:$student_id) {
    _id
    course_code
    course_name
    section
    semester
    students {
      _id
    }
  }
}
`;
const SelectedCourses = () => {

  const user = useSelector((state) => state.user.user)
  const { loading, error, data, refetch } = useQuery(SELECTED_COURSES, { variables: { student_id: user._id }, fetchPolicy: "no-cache" });
  // const courses = useSelector((state) => state.course.selectedCourses)
  const token = useSelector((state) => state.user.token)
  // const loading = useSelector((state) => state.course.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [deleteCourse] = useMutation(DELETE_COURSE)
  useEffect(() => {
    data?.getCoursesByStudent && dispatch(setCourseInfo({ name: 'selectedCourses', value: data?.getCoursesByStudent }))
  }, [data])

  const dropCourse = async (courseId) => {
    await deleteCourse({ variables: { "course_id": courseId, "student_id": user._id } })
    navigate("/selectedcourses")
  }

  if (!data?.getCoursesByStudent || loading) {
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
        {data?.getCoursesByStudent.map((c) => (
          <tr>
            <td>{c.course_code}</td>
            <td>{c.course_name}</td>
            <td>{c.section}</td>
            <td><Button className="btn btn-danger" onClick={() => dropCourse(c._id)}>Drop</Button></td>
            <td>
              {
                token ? (<td><NavLink to={`/course/${c.course_code}`}>Edit</NavLink></td>) : (<td>{c.course_code}</td>)
              }
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SelectedCourses;
