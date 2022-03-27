import axios from "axios"
export const loginAPI = (userState)=>{
    return axios.post("/authen/login",userState,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}
export const signUpAPI = (userState)=>{
    return axios.post("/authen/signup",userState,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}
export const createCourseAPI= (course)=>{
    return axios.post("/course/post",course,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}
export const deleteCourseAPI= (course_id,student_id, token)=>{
    return axios.delete(`/course/${course_id}/student/${student_id}`,{
        headers:{
            "Content-Type": "Application/json",
            "Authorization":`Bearer ${token}`
        }
    })
}
export const updateCourseApi= (course)=>{
    return axios.put("/course/post",course,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}

export const getCourseApi = (course_id) => {
    return axios.get(`/course/${course_id}`,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}

export const getCourseByCodeApi = (course_code) => {
    return axios.get(`/course/course_code/${course_code}`,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}

export const getCoursesApi = () => {
    return axios.get("/course/courses/all",{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}

export const getStudentCoursesApi = (student_id, token) => {
    return axios.get(`/student/${student_id}/studentCourseList`,{
        headers:{
            "Content-Type": "Application/json",
            "Authorization":`Bearer ${token}`
        }
    })
}

export const addStudentToCourseApi = (course_id, student_id, token) => {
    return axios.put(`/course/${course_id}/student_id/${student_id}`,{},{
        headers:{
            "Content-Type": "Application/json",
            abc:"sadfasdasdfasdfasdf",
            Authorization:`Bearer ${token}`
        }
    })
}

export const addCourseToStudentApi = (course_id, student_id, token) => {
    console.log("api", token)
    return axios.put(`/student/${student_id}/course_id/${course_id}`,{},{
        headers:{
            "Content-Type": "Application/json",
            Authorization:`Bearer ${token}`
        }
    })
}

export const getCourseStudentListApi = (course_id) => {
    return axios.get(`/student/course_id/${course_id}`,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}

export const getAllStudentsAPI = ()=>{
    return axios.get(`/student/allstudents`,{
        headers:{
            "Content-Type": "Application/json"
        }
    })
}