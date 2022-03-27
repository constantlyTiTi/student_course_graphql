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
var studentSchema = require('./studentSchema')
const jwt = require("jsonwebtoken");

const courseType = new GraphQLObjectType({
    name: 'course',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            course_code: {
                type: GraphQLString
            },
            course_name: {
                type: GraphQLString
            },
            section: {
                type: GraphQLString
            },
            semester: {
                type: GraphQLString
            },
            students:{
                type: GraphQLList(studentSchema)
            }
        }
    }
});

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
                    CourseModel.find({ course_code: req.params.course_code }).then(
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
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    course_id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    try {
                        var token = req.headers.authorization.split(' ')[1];
                        jwt.verify(token, process.env.JWT_SECRET)
                    } catch (e) {
                        if (e instanceof jwt.JsonWebTokenError) {
                            return res.status(401).end()
                        }
                        return res.status(400).end()
                    }
                    let course = CourseModel.findById(params.course_id).exec()
                    if (course.students.some(i => i._id === student_id)) {
                        return res.status(400).json({ success: false, message: 'already exist' })
                    }
                    course.students.push(student_id)
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
                }
            },
            deleteCourse: {
                type: courseType,
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
                resolve(root,params) {
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
                        let course = CourseModel.findOne({ _id: req.params.course_id })
                
                        if (!course) {
                            return res.status(500).json({ error: "course not find" })
                        }
                
                        let index = course.students.indexOf(req.params.student_id);
                        if (index > -1) {
                            course.students.splice(index, 1);
                        }
                
                         course.save()
                
                        let std = StudentModel.findOne({ _id: req.params.student_id })
                
                        let indexS = std.courses.indexOf(req.params.course_id)
                        console.log(indexS)
                        if (indexS > -1) {
                            std.courses.splice(indexS, 1)
                        }
                     std.save()
                        return res.status(200).json({ success: true })
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
