import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import Login from './auth/login'
import SignUp from './auth/signup'
import Course from './course/course'
import CourseList from './course/courseList'
import ListAllStudents from './course/listAllStudents'
import { Container, Navbar, Nav, Brand } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import SelectedCourses from './course/selectedCourses';
function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* <Route index element={<Items />} /> */}

            <Route path="/" element={<CourseList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/selectedcourses" element={<SelectedCourses />} />
            <Route path="/course/:course_code" element={<Course />} />
            {/* <Route path="/course-list" element={<CourseList/>}/> */}
            <Route path="/students" element={<ListAllStudents />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

function Layout() {
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  if (token) {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand>
              <Link to="/selectedcourses">{user.first_name} {user.last_name}
              </Link>
            </Navbar.Brand>
            <Navbar.Brand>
              <Link to="/">Home
              </Link>
            </Navbar.Brand>
            <Navbar.Brand href="/">log out</Navbar.Brand>
            <Nav path="course-list" element={<CourseList />} />
            <Nav className="me-auto">
            </Nav>
          </Container>
        </Navbar>
        <Container className='mt-3 col-5'>
          {/* <h1>child</h1> */}
          <Outlet />
        </Container>

      </>
    );
  }
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/login">
              Login</Link></Navbar.Brand>
          <Navbar.Brand>
            <Link to="/signup">
              Sign up</Link></Navbar.Brand>
          <Navbar.Brand>
            <Link to="/students">All Students
            </Link>
          </Navbar.Brand>
          <Nav path="course-list" element={<CourseList />} />
          <Nav className="me-auto">
          </Nav>
        </Container>
      </Navbar>
      <Container className='mt-3 col-5'>
        {/* <h1>child</h1> */}
        <Outlet />
      </Container>

    </>
  );
}

export default App;
