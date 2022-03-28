const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Student = require('./student').schema;

const Course = new Schema(
    {
        id: String,
        course_code: { type: String, required: true },
        course_name: { type: String, required: true },
        section: { type: String, required: true },
        semester: { type: String, required: true },
        // students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
        students: { type: [Student], default: [] }
    },
    { timestamps: true },
)

module.exports = mongoose.model('course', Course)