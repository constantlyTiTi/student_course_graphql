
import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCoursesByCode, addCourseToStudent, addStudentToCourse, deleteCourse, getCourseStudentList } from "../redux/course-redux";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

const GET_COURSE_BY_CODE = gql`
query getCourseByCode($course_code: String!) {
  getCourseByCode(course_code: $course_code) {
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
const ADD_STUDENT_TO_COURSE = gql`
mutation addStudentToCourse($course_id: String!,
  $student_id: String!) {
  addStudentToCourse(course_id:$course_id,student_id:$student_id) {
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
`
const Course = (props) => {
  const selectedCourses = useSelector((state) => state.course.selectedCourses)
  const { user, token } = useSelector((state) => state.user);
  // const {students} = useSelector((state) => state.course)
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([])
  const [defaultSelectedId, setDefaultSelectedId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState(defaultSelectedId)
  const [getCourseByCode, { loading }] = useLazyQuery(GET_COURSE_BY_CODE);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteCourse] = useMutation(DELETE_COURSE)
  const [addStudentToCourse] = useMutation(ADD_STUDENT_TO_COURSE)
  const { course_code } = useParams();

  useEffect(() => {
    const getCourse = async (course_code) => {
      let resp = await getCourseByCode({ variables: { course_code: course_code } })
      const result = resp?.data?.getCourseByCode;
      setSections(result)
      const defaultID = selectedCourses.map(s => s._id).find(c => result.some(cid => cid._id === c))
      setDefaultSelectedId(defaultID);
      setSelectedSectionId(defaultID)
      // let studentList = getCourseStudentList(defaultID)
      setStudents(result.find(c => c._id === defaultID).students)
    };
    getCourse(course_code)


  }, []);

  async function addCourseStudent() {
    if (selectedSectionId) {

      if (defaultSelectedId && defaultSelectedId !== selectedSectionId) {
        await deleteCourse({ variables: { "course_id": defaultSelectedId, "student_id": user._id } })
      }
      await addStudentToCourse({ variables: { "course_id": selectedSectionId, "student_id": user._id } })
      // await dispatch(addStudentToCourse({ "course_id": selectedSectionId, "student_id": user._id, "token": token }))
      // addStudentToCourseMut({ variables: { student_id: user._id, course_id: selectedSectionId } })

      navigate("/selectedcourses")
    }
  }

  if (sections?.length === 0) return <Spinner animation="border" role="status" />
  return (
    <>
      <Card>
        <Card.Header>{sections[0].course_name}</Card.Header>
        <Card.Body>
          {/* <Card.Title>Special title treatment</Card.Title> */}
          <Card.Text>
            <Form>
              {sections.map(i =>
              (
                <Form.Check type="radio" name={i.course_code}
                  value={i._id} label={`${i.section}`}
                  checked={i._id === selectedSectionId}
                  onClick={() => { setSelectedSectionId(i._id); setStudents(sections.find(c => c._id === i._id).students); }} />
              ))
              }
            </Form>
          </Card.Text>
          <Button variant="primary" onClick={() => addCourseStudent()}>Add Course</Button>
        </Card.Body>
      </Card>
      <hr />
      {
        students?.length ?
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
            {students &&
              students.map(i =>
              (
                <tr>
                  <td>{`${i.first_name} ${i.last_name}`}</td>
                  <td>{i.address}</td>
                  <td>{i.phone_number}</td>
                  <td>{i.email}</td>
                  <td>{i.city}</td>
                  <td>{i.student_number}</td>
                </tr>
              )
              )
            }
          </Table> : <div className="d-grid gap-2">
            <Button variant="secondary" size="lg">
              No one selected
            </Button>
          </div>
      }

    </>

  );
};

export default Course;
