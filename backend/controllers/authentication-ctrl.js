const Authen = require('../models/student')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

signUp = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'please provide the information'
        })
    }
    const student = new Authen(body)
    const salt = await bcrypt.genSalt(10)

    student.password = await bcrypt.hash(student.password, salt)

    if (!student) {
        return res.status(400).json({ success: false, error: err })
    }

    let studentExist = await Authen.findOne({ student_number: student.student_number })

    if (studentExist) {
        return res.status(500).json({ success: false, error: 'already exist' })
    }


    const result = await student.save()

    const payload = {

        student_number: student.student_number

    }

    try {
        token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 360000
        })

        return res.status(201).json({
            success: true,
            student: result,
            message: 'sign up successfully',
            token: token
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: "Token not generated" })
    }
}


login = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'please provide the username and password'
        })
    }

    if (!body.student_number) {
        return res.status(400).json({
            success: false,
            error: 'please provide the username'
        })
    }
    if (!body.password) {
        return res.status(400).json({
            success: false,
            error: 'please provide the password'
        })
    }

    const student = new Authen(body)
    let studentExist = await Authen.findOne({ student_number: student.student_number })
    if(!studentExist){
        return res.status(500).json({ success: false, error: 'not exist' }) 
    }
    const isMatch = bcrypt.compare(student.password, studentExist.password)

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] })
        }
        const payload = {

            student_number: student.student_number

        }

        try {
            token = await jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: 360000
            })
    
            return res.json({ student: studentExist, token })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ msg: "Token not generated" })
        }

}

module.exports = {
    signUp,
    login
}