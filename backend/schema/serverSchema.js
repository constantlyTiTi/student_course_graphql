const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLInt } = require('graphql');

const bcrypt = require("bcryptjs")
var CourseModel = require('../models/course');
var StudentModel = require('../models/student')
const jwt = require("jsonwebtoken");

const courseType = require('./courseType')
const studentType = require('./studentType')
const authType = require('./authType')

const query = new GraphQLObjectType({
    name: 'query',
    fields: () => ({
        getCourseList: {
            type: new GraphQLList(courseType),
            resolve: function () {
                const courses = CourseModel.find().exec()
                return courses
            }
        },
        getCourse: {
            type: courseType,
            args: {
                course_id: {
                    name: "_id",
                    type: GraphQLString
                }
            },
            resolve: function (root, params) {
                const course = CourseModel.findById(params.course_id).exec()
                if (!course) {
                    throw new Error('Error')
                }
                return course
            }
        },
        getCourseByCode: {
            type: new GraphQLList(courseType),
            args: {
                course_code: {
                    name: 'course_code',
                    type: GraphQLString
                }
            },
            resolve: function (root, params) {
                const results = CourseModel.find({ course_code: params.course_code }).then(
                    items => {
                        if (!items.length) {
                            return new Error('Course not found')
                        }
                        console.log(items.length)
                        return items
                    }
                ).catch(
                    err => console.log(err)
                )
                return results
            }
        },
        student: {
            type: studentType,
            args: {
                student_id: {
                    name: '_id',
                    type: GraphQLString
                }
            },
            resolve: (root, params) => {
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
                if (!isMatch) {
                    return new Error('Invalid credentials')
                }
                try {
                    const payload = {
                        student_number: params.student_number
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
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addNewCourse: {
            type: courseType,
            args: {
                course_code: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                course_name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                section: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                semester: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: function (root, params) {
                const course = new CourseModel(params);
                const newCourse = course.save();
                if (!newCourse) {
                    throw new Error('Error');
                }
                return newCourse
            }
        },
        addStudentToCourse: {
            type: courseType,
            args: {
                student_id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                course_id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, params) => {
                const { course_id, student_id } = params
                let course = await CourseModel.findById(course_id).exec()
                // if (course.students.some(i => i._id === student_id)) {
                //     return res.status(400).json({ success: false, message: 'already exist' })
                // }
                let student = course?.students?.find(i => i._id.toString() === student_id)
                if (!student?._id) {
                    const newStudent = await StudentModel.findById(student_id).exec()
                    course.students.push(newStudent)
                    return await course.save()
                }
                // return course
            }
        },
        deleteCourse: {
            type: courseType,
            args: {
                student_id: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                course_id: {
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, params) => {
                const { course_id, student_id } = params
                const c1 = await CourseModel.findOne({ _id: course_id, "students._id": student_id }).exec()
                let index = c1.students.findIndex(i => i._id.toString() === student_id)
                console.log(c1, index, c1.students)
                if (index > -1) {
                    console.log(course_id, student_id, index)
                    c1.students.splice(index, 1);
                    return await c1.save()
                }
                return c1
            }
        },
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
    })

})

module.exports = new GraphQLSchema({ query: query, mutation: mutation });