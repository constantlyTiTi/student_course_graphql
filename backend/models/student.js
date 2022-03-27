const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Student = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        student_number: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone_number: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        program: { type: String, required: true },
        courses: [{type: mongoose.Schema.Types.ObjectId, ref:"course"}]
    },
    { timestamps: true },
)

module.exports = mongoose.model('student', Student)