import React, { useEffect, useState } from 'react'
import { Form, Button, FloatingLabel } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom';
// import { login } from '../redux/auth-redux'
import { Student } from '../models/student'
import { useAuth } from '../auth/useAuth'
import { gql, useQuery , useMutation} from "@apollo/client";

const LOGIN = gql`
login(student_number: $student_number, password: $password){
    student {     _id
     first_name
     last_name
     student_number
     address
     city
     phone_number
     email
     password
     program}
   token
   message
   success
 }
 `
const Login = (props) => {
    // const user = useSelector((state) => state.user.user)
    // const token = useSelector((state) => state.user.token)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    // let auth = useAuth()

    const [userState, setState] = useState(Student)
    const [login, { data, loading, error }] = useMutation(LOGIN);
    const token = data?.token;
    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token])

    const setStudentNumber = (studentNumber) => {
        setState({ ...userState, student_number: studentNumber })
    }

    const setPassword = (passwordInput) => {
        setState({ ...userState, password: passwordInput })
    }
    let from = location.state?.from?.pathname || "/";
    const formSubmit = (e) => {
        e.preventDefault()

        login({ varizbles: { userState } });
        // console.log(data)
        // dispatch(login(userState))
        // navigate("/course")
    }

    console.log(data)
    return (
        <Form onSubmit={e => formSubmit(e)}>


            <FloatingLabel label="Student number" className="mb-3" controlId="studentNumber">
                <Form.Control type="text" placeholder="student number" onChange={e => setStudentNumber(e.target.value)} />
            </FloatingLabel>

            <FloatingLabel label="Password" className="mb-3" controlId="password">
                <Form.Control type="text" placeholder="password" onChange={e => setPassword(e.target.value)} />
            </FloatingLabel>


            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default Login