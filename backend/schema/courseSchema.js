const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull, GraphQLInt } = require('graphql');
var CourseModel = require('../models/course');
var StudentModel = require('../models/student')
var studentSchema = require('./studentSchema')
const jwt = require("jsonwebtoken");

const courseType = require('./courseType')
const queryType = new GraphQLObjectType({

    name: 'Query',
    fields: function () {
        return {
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
            }
        }
    }


})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
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
                    // try {
                    //     var token = req.headers.authorization.split(' ')[1];
                    //     jwt.verify(token, process.env.JWT_SECRET)
                    // } catch (e) {
                    //     if (e instanceof jwt.JsonWebTokenError) {
                    //         return res.status(401).end()
                    //     }
                    //     return res.status(400).end()
                    // }
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
                resolve: async(root, params)=> {
                    const {course_id,student_id}=params
                    const c1 = await CourseModel.findOne({_id:course_id,"students._id":student_id}).exec()
                    let index = c1.students.findIndex(i => i._id.toString() === student_id)
                    console.log(c1, index, c1.students)
                    if (index > -1) {
                        console.log(course_id, student_id, index)
                        c1.students.splice(index, 1);
                        return await c1.save()
                    }
                    return c1
                    // try {
                    //     var token = req.headers.authorization.split(' ')[1];
                    //     jwt.verify(token, process.env.JWT_SECRET)
                    // } catch (e) {
                    //     if (e instanceof jwt.JsonWebTokenError) {
                    //         return res.status(401).end()
                    //     }
                    //     return res.status(400).json({ error: e.message })
                    // }
                    try {
                        let course = CourseModel.findOne({ _id: req.params.course_id })

                        if (!course) {
                            return res.status(500).json({ error: "course not find" })
                        }

                        let index = course.students.indexOf(req.params.student_id);
                        if (index > -1) {
                            course.students.splice(index, 1);
                        }

                        return await course.save()

                        // let std = StudentModel.findOne({ _id: req.params.student_id })

                        // let indexS = std.courses.indexOf(req.params.course_id)
                        // console.log(indexS)
                        // if (indexS > -1) {
                        //     std.courses.splice(indexS, 1)
                        // }
                        // std.save()
                        // return res.status(200).json({ success: true })
                    }
                    catch (e) {
                        return res.status(400).json({ error: e.message })
                    }
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
