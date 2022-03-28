import React, { useEffect, useState } from 'react'
import { Table, Button, FloatingLabel, Spinner } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate ,Link, NavLink} from 'react-router-dom';
import {getCourses} from '../redux/course-redux'
import {gql, useQuery} from "@apollo/client";
const GET_COURSES = gql`
{
  getCourseList {
    _id
    course_code
    course_name
    section
    semester
    students {
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
}
`;
const CourseList =()=> {
    // const courses = useSelector((state) => state.course.courses)
    // const loading = useSelector((state) => state.course.loading)
    const token = useSelector((state) => state.user.token)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, data , refetch } = useQuery(GET_COURSES);
    const courses = data?.getCourseList
    console.log(courses, loading)
    // useEffect (()=>{
    //   if(courses?.length === 0){
    //     dispatch(getCourses()) 
    //   }
       
    // }, [])

    if(!data?.getCourseList || loading){
      return <Spinner animation="border" role="status" />
    }

    return(
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Semester</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr>
                {
                  token?(<td><NavLink to={`course/${c.course_code}`}>{c.course_code}</NavLink></td>):(<td>{c.course_code}</td>)
                }
                <td>{c?.course_name}</td>
                <td>{c?.semester}</td>
                {/* <td>{c?.section?.join(' / ')}</td> */}
                <td>{c?.section}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    )

}

export default CourseList