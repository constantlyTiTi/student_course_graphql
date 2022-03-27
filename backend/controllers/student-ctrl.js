const Student = require('../models/student')
const Course = require('../models/course')
const jwt = require("jsonwebtoken");
const student = require('../models/student');
studentCourseList = async (req, res) => {
    try{
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET)
    }catch(e){
        if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).end()
		}
		return res.status(400).end()
    }

    try {
        let result = await Student.findOne({ _id: req.params.student_id })
        if (!result) {
            return res.status(400).json({ success: false, error: "not found" })
        }

        let courseIds = result.courses

        let courses = await Course.find({'_id': courseIds})

        return res.status(200).json({ success: true, data: courses })
    } catch (e) {
        console.log(e)
    }

}

addCourseToStudent = async (req, res) => {
    try{
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET)
    }catch(e){
        if (e instanceof jwt.JsonWebTokenError) {
			return res.status(401).end()
		}
		return res.status(400).json({error:e.message})
    }

    let student = await Student.findOne({ _id: req.params.student_id })

    if (student.courses.includes(req.params.course_id)) {
        return res.status(400).json({
            message: 'Course already exist',
        })
    }

    student.courses.push(req.params.course_id)

    await student.save()
        .then((item) => {
            res.status(200).send(item)
        })
        .catch((error) => {
            res.status(400).send(error)
        })
}

getCourseStudentList = async (req, res) => {
    try{
        let students = await Student.find()
        console.log(students, req.params.course_id)
    let filteredStudents = students.filter(s=>s.courses.includes(req.params.course_id))
    return res.status(200).send(filteredStudents)
    }
    catch(e){
        return res.status(400).send(e)
    }

    }

    getStudentList = async(req, res) => {
        try{
            let students = await Student.find()
            return res.status(200).send(students) 
        }catch(e){
            return res.status(400).send(e)
        }
    }
    

module.exports = {
    studentCourseList,
    addCourseToStudent,
    getCourseStudentList,
    getStudentList
}