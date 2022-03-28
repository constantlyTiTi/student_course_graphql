const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLInt } = require('graphql');

var StudentModel = require('../models/student')
var CourseModel = require('../models/course');
const jwt = require("jsonwebtoken");
const { GraphQLInputObjectType } = require('graphql');
const student = require('../models/student');
const bcrypt = require("bcryptjs")

const studentType = require('./studentType')
const authType = require('./authType')


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
                resolve(root, params) {
                    // try {
                    //     var token = req.headers.authorization.split(' ')[1];
                    //     jwt.verify(token, process.env.JWT_SECRET)
                    // } catch (e) {
                    //     if (e instanceof jwt.JsonWebTokenError) {
                    //         return res.status(401).end()
                    //     }
                    //     return res.status(400).end()
                    // }
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
                resolve: async (root, params) => {
                    let course = await CourseModel.findById(params.course_id).exec()
                    return course.students
                }
            },
            login: {
                type: authType,
                args: {
                    student_number: {
                        name: 'student_number',
                        type: GraphQLString
                    },
                    password: {
                        name: 'password',
                        type: GraphQLString
                    }
                },
                resolve: async (root, params) => {
                    if (!params.student_number) {
                        return new Error('please provide the username')
                    }
                    if (!params.password) {
                        return new Error('please provide the password')
                    }

                    const studentExist = await StudentModel.findOne({ student_number: params.student_number }).exec()
                    if (!studentExist) {
                        return new Error('not exist')
                    }
                    const isMatch = await bcrypt.compare(params.password, studentExist.password)
                    // if (!isMatch) {
                    //     return new Error('Invalid credentials')
                    // }
                    try {
                        const payload = {
                            student_number: student.student_number
                        }
                        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
                            expiresIn: 360000
                        })
                        console.log({ student: studentExist, token })

                        return { student: studentExist, token, success: true, message: 'login successfully', }
                    } catch (e) {
                        console.log(e)
                        return new Error('Token not generated')
                    }
                    // .then(studentExist => {
                    //     // return i
                    //     console.log("isMatch", isMatch)
                    // }).catch(
                    //     e => { return null }
                    // )
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
                        name: '_id',
                        type: GraphQLNonNull(GraphQLString)
                    },
                    course_id: {
                        name: 'id',
                        type: GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    // try {
                    //     var token = req.headers.authorization.split(' ')[1];
                    //     jwt.verify(token, process.env.JWT_SECRET)
                    // } catch (e) {
                    //     if (e instanceof jwt.JsonWebTokenError) {
                    //         return res.status(401).end()
                    //     }
                    //     return res.status(400).json({ error: e.message })
                    // }

                    let student = StudentModel.findOne({ _id: params.student_id })

                    if (student.courses.includes(req.params.course_id)) {
                        return new Error('Course already exist')
                    }

                    student.courses.push(params.course_id)

                    try {
                        student.save()
                    }
                    catch {
                        return new Error('student cannot be saved')
                    }

                    return student
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
                        return new Error('already exist')
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

                        return {
                            success: true,
                            student: newStudent,
                            message: 'sign up successfully',
                            token: token
                        }
                    } catch (e) {
                        console.log(e)
                        return new Error('Token not generated')
                    }
                }
            }
        }
    }
})
module.exports = new GraphQLSchema({ query: queryType });