import React, { useEffect, useState } from 'react'
import { Form, Button, FloatingLabel } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {register} from '../redux/auth-redux'
import {Student} from '../models/student'

const SignUp = (props) => {
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const[userState, setState] = useState(Student)

    const setStudentNumber =(studentNumber)=>{
        setState({...userState, student_number:studentNumber})
    }

    const setFirstname =(input)=>{
        setState({...userState, first_name:input})
    }

    const setLastname =(input)=>{
        setState({...userState, last_name:input})
    }


    const setPassword = (passwordInput)=>{
        setState({...userState, password:passwordInput})
        console.log(userState)
    }

    const setAddress = (input)=>{
        setState({...userState, address:input})
        console.log(userState)
    }
    const setCity = (input)=>{
        setState({...userState, city:input})
        console.log(userState)
    }
    const setPhoneNumber = (input)=>{
        setState({...userState, phone_number:input})
        console.log(userState)
    }
    const setProgram = (input)=>{
        setState({...userState, program:input})
        console.log(userState)
    }

    const setEmail = (input)=>{
        setState({...userState, email:input})
        console.log(userState)
    }
    const formSubmit =(e)=>{
        e.preventDefault()
        dispatch(register(userState))
        navigate("/")
    }

    return(
        <Form onSubmit={e => formSubmit(e)}>


                    <FloatingLabel label="Student number" className="mb-3" controlId="studentNumber">
                        <Form.Control type="text" placeholder="student number"  onChange={e => setStudentNumber(e.target.value)} />
                    </FloatingLabel>

                    <FloatingLabel label="Password" className="mb-3"controlId="password">
                        <Form.Control type="text" placeholder="password"  onChange={e => setPassword(e.target.value)} />
                    </FloatingLabel>
                    <FloatingLabel label="First name" className="mb-3" controlId="firstname">
                        <Form.Control type="text" placeholder="first name"  onChange={e => setFirstname(e.target.value)} />
                    </FloatingLabel>
                    <FloatingLabel label="Last name" className="mb-3" controlId="lastname">
                        <Form.Control type="text" placeholder="last name"  onChange={e => setLastname(e.target.value)} />
                    </FloatingLabel>

                    <FloatingLabel label="Address" className="mb-3" controlId="address">
                        <Form.Control type="text" placeholder="address"  onChange={e => setAddress(e.target.value)} />
                    </FloatingLabel>

                    <FloatingLabel label="City" className="mb-3" controlId="city">
                        <Form.Control type="text" placeholder="city"  onChange={e => setCity(e.target.value)} />
                    </FloatingLabel>
                    
                    <FloatingLabel label="Phone number" className="mb-3" controlId="phoneNumber">
                        <Form.Control type="number" placeholder="000 000 0000"  onChange={e => setPhoneNumber(e.target.value)} />
                    </FloatingLabel>
                    
                    <FloatingLabel label="Email" className="mb-3" controlId="email">
                        <Form.Control type="email" placeholder="email"  onChange={e => setEmail(e.target.value)} />
                    </FloatingLabel>
                    
                    <FloatingLabel label="Program" className="mb-3" controlId="program">
                        <Form.Control type="text" placeholder="program"  onChange={e => setProgram(e.target.value)} />
                    </FloatingLabel>


                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
    )
}

export default SignUp