var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var CourseModel = require('../models/course');
var StudentModel = require('../models/student')
const jwt = require("jsonwebtoken");
const { GraphQLInputObjectType } = require('graphql');
const student = require('../models/student');
const courseSchema = require('./courseSchema')

const studentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            first_name: {
                type: GraphQLString
            },
            last_name: {
                type: GraphQLString
            },
            student_number: {
                type: GraphQLString
            },
            address: {
                type: GraphQLString
            },
            city: {
                type: GraphQLString
            },
            phone_number: {
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
            program: {
                type: GraphQLString
            },
            courses:{
                type: new GraphQLList(courseSchema)
            }

        }
    }
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            student: {
                type: studentType,
                args: {
                    student_id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    try {
                        var token = req.headers.authorization.split(' ')[1];
                        jwt.verify(token, process.env.JWT_SECRET)
                    } catch (e) {
                        if (e instanceof jwt.JsonWebTokenError) {
                            return res.status(401).end()
                        }
                        return res.status(400).end()
                    }
                    const studentInfo = StudentModel.findById(params.student_id).exec()
                    if (!studentInfo) {
                        throw new Error('Error')
                    }
                    return studentInfo
                }
            },
            getCourseStudentList: {
                type: new GraphQLList(studentType),
                args: {
                    course_id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {

                    try {
                        let students = StudentModel.find().exec()
                        console.log(students, req.params.course_id)
                        let filteredStudents = students.filter(s => s.courses.includes(req.params.course_id))
                        return res.status(200).send(filteredStudents)
                    }
                    catch (e) {
                        return res.status(400).send(e)
                    }
                }
            },
            login: {
                type: studentType,
                args:{
                    student_number:{
                        name:'student_number',
                        type: GraphQLString
                    },
                    password: {
                        name:'password',
                        type: GraphQLString
                    }
                },
                resolve: function(root, params) {
                    if (!params.student_number) {
                        return res.status(400).json({
                            success: false,
                            error: 'please provide the username'
                        })
                    }
                    if (!params.password) {
                        return res.status(400).json({
                            success: false,
                            error: 'please provide the password'
                        })
                    }
    
                    let studentExist = StudentModel.findOne({ student_number: params.student_number })
                    if(!studentExist){
                        return res.status(500).json({ success: false, error: 'not exist' }) 
                    }
                    const isMatch = bcrypt.compare(params.password, studentExist.password)
                
                        if (!isMatch) {
                            return res
                                .status(400)
                                .json({ errors: [{ msg: "Invalid credentials" }] })
                        }
                        const payload = {
                            student_number: student.student_number
                
                        }
                
                        try {
                            token =  jwt.sign(payload, process.env.JWT_SECRET, {
                                expiresIn: 360000
                            })
                    
                            return res.json({ student: studentExist, token })
                        } catch (e) {
                            console.log(e)
                            return res.status(500).json({ msg: "Token not generated" })
                        }
                }
            }
        }
    }

})

const mutation = new GraphQLInputObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addCourseToStudent: {
                type: studentType,
                args: {
                    student_id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    course_id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    try {
                        var token = req.headers.authorization.split(' ')[1];
                        jwt.verify(token, process.env.JWT_SECRET)
                    } catch (e) {
                        if (e instanceof jwt.JsonWebTokenError) {
                            return res.status(401).end()
                        }
                        return res.status(400).json({ error: e.message })
                    }

                    let student = StudentModel.findOne({ _id: req.params.student_id })

                    if (student.courses.includes(req.params.course_id)) {
                        return res.status(400).json({
                            message: 'Course already exist',
                        })
                    }

                    student.courses.push(req.params.course_id)

                     student.save()
                        .then((item) => {
                            res.status(200).send(item)
                        })
                        .catch((error) => {
                            res.status(400).send(error)
                        })
                }
            },
            signUp: {
                type: studentType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    first_name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    last_name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    student_number: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    address: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    city: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    phone_number: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    program: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {

                    const salt = bcrypt.genSalt(10)

                    params.password = bcrypt.hash(params.password, salt)

                    let studentExist = StudentModel.findOne({ student_number: student.student_number })

                    if (studentExist) {
                        return res.status(500).json({ success: false, error: 'already exist' })
                    }

                    const studentModel = new StudentModel(params);
                    const newStudent = studentModel.save();
                    if (!newStudent) {
                        throw new Error('Error');
                    }

                    try {
                        token = jwt.sign(payload, process.env.JWT_SECRET, {
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
            }
        }
    }
})
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });