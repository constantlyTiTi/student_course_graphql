const Course = require('../models/course')
const jwt = require("jsonwebtoken")
const Student = require('../models/student')

createCourse = async (req, res) => {

    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'please provide the information'
        })
    }

    const course = Course(body)

    if (!course) {
        return res.status(400).json({ success: false, error: err })
    }

    await course.save()
        .then((item) => {
            return res.status(201).json({
                success: true,
                id: item._id,
                message: 'Course created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Course not created!',
            })
        })
}

getCourse = async (req, res) => {
    let result = await Course.findOne({ _id: req.params.course_id })
    if (!result) {
        return res.status(400).json({ success: false, error: "not found" })
    }
    return res.status(200).json({ success: true, data: result })
}

getCourseByCode = async (req, res) => {

    Course.find({ course_code: req.params.course_code }).then(
        items => {
            if (!items.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Course not found` })
            }
            res.status(200).json({ success: true, data: items })
        }
    ).catch(
        err => console.log(err)
    )
}

addStudentToCourse = async (req, res) => {

    try {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }
    let course = await Course.findOne({ _id: req.params.course_id })

    if (!course) {
        return res.status(400).json({ success: false, error: "not found" })
    }

    let student_id = req.params.student_id

    if (course.students.some(i => i._id === student_id)) {
        return res.status(400).json({ success: false, message: 'already exist' })
    }

    course.students.push(student_id)

    await course
        .save()
        .then(() => {
            return res.status(200).json({
                success: true,
                id: course._id,
                message: 'Course updated!',
            })
        })
        .catch(error => {
            return res.status(404).json({
                error,
                message: 'Course not updated!',
            })
        })

}

getCourseList = async (req, res) => {

    Course.find().then(
        items => {
            if (!items.length) {
                return res
                    .status(404)
                    .json({ success: false, error: `Course not found` })
            }
            res.status(200).json({ success: true, data: items })
        }
    ).catch(
        err => console.log(err)
    )
}

deleteCourse = async (req, res) => {
    try {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).json({ error: e.message })
    }

    try {
        let course = await Course.findOne({ _id: req.params.course_id })

        if (!course) {
            return res.status(500).json({ error: "course not find" })
        }

        let index = course.students.indexOf(req.params.student_id);
        if (index > -1) {
            course.students.splice(index, 1);
        }

        await course.save()

        let std = await Student.findOne({ _id: req.params.student_id })

        let indexS = std.courses.indexOf(req.params.course_id)
        console.log(indexS)
        if (indexS > -1) {
            std.courses.splice(indexS, 1)
        }
        await std.save()
        return res.status(200).json({ success: true })
    }
    catch (e) {
        return res.status(400).json({ error: e.message })
    }



}

updateCourse = async (req, res) => {
    try {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Course.findOne({ _id: body.course_id }, (err, course) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Course not found!',
            })
        }
        course.course_code = body.course_code
        course.course_name = body.course_name
        course.section = body.section
        course.semester = body.semester

        course
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: course._id,
                    message: 'Course updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Course not updated!',
                })
            })
    })
}

module.exports = {
    createCourse,
    getCourse,
    getCourseList,
    deleteCourse,
    updateCourse,
    addStudentToCourse,
    getCourseByCode
}