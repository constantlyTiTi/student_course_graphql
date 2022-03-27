import React, { useEffect, useState } from "react";
import { Card, Button, Form, Spinner, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCoursesByCode, addCourseToStudent, addStudentToCourse, deleteCourse, getCourseStudentList } from "../redux/course-redux";

const Course = (props) => {
  const selectedCourses = useSelector((state) => state.course.selectedCourses)
  const { user, token } = useSelector((state) => state.user);
  const {students} = useSelector((state) => state.course)
  const [sections, setSections] = useState([]);
  const [defaultSelectedId, setDefaultSelectedId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState(defaultSelectedId)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course_code } = useParams();
  useEffect(() => {
    const getCourse = async (course_code) => {
      let resp = await dispatch(getCoursesByCode(course_code))
      const result = resp?.payload?.data;
      setSections(result)
      const defaultID = selectedCourses.map(s=>s._id).find(c => result.some(cid => cid._id === c))
      setDefaultSelectedId(defaultID);
      setSelectedSectionId(defaultID)
      await dispatch(getCourseStudentList(defaultID))
    };
    getCourse(course_code)
    

  }, []);

  function addCourseStudent() {

    const runFunc = async () => {
      if (selectedSectionId) {

        if (defaultSelectedId && defaultSelectedId !== selectedSectionId) {
          await dispatch(deleteCourse({ "course_id": defaultSelectedId, "student_id": user._id, "token": token }))
        } 
          await dispatch(addCourseToStudent({ "course_id": selectedSectionId, "student_id": user._id, "token": token }))
          await dispatch(addStudentToCourse({ "course_id": selectedSectionId, "student_id": user._id, "token": token }))

          navigate("/selectedcourses")
      }
    };

    runFunc()
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
                onClick={() => setSelectedSectionId(i._id)} />
            ))
            }
          </Form>
        </Card.Text>
        <Button variant="primary" onClick={() => addCourseStudent()}>Add Course</Button>
      </Card.Body>
    </Card>
{
  defaultSelectedId&&
  <Card>
<Card.Header>all students</Card.Header>
<Card.Body>
  {/* <Card.Title>Special title treatment</Card.Title> */}
  <Card.Text>
    <Table>
      {students &&
      students.map(i =>
      (
        <tr>
          <td>{`${i.first_name} ${i.last_name}`}</td>
        </tr>
      )
      )
      }
    </Table>
  </Card.Text>
</Card.Body>
</Card>
}
    
</>

  );
};

export default Course;
