const { buildSchema } = require('graphql');

const Authen = require('../models/student')
const Course = require('../models/course')
const student = require('../models/student');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = buildSchema(`
${Authen.student}
${Course.Course}
${student.student}
`)
