import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

const Thankyou = (props)=>{
    const user = useSelector((state) => state.user)
    const course = useSelector((state) => state.courseEve)

    return(
        <>
        
        <h1>Thank you {user.email}</h1>

        <h3>we appreciate your comments : {course.comment}</h3>

        </>
    )
}
export default Thankyou