require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');
var express_graphql = require('express-graphql');
var courseSchema = require('./schema/courseSchema')
var studentSchema = require('./schema/studentSchema')

const app = express()

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error',(error) => console.error(error))
db.once('open',()=> console.log('Connect to database'))

// app.use(express.json())
app.use('/graphql/course',express_graphql.graphqlHTTP({
    schema: courseSchema,
    rootValue: root,
    graphiql:true
}))
app.use('/graphql/auth',express_graphql.graphqlHTTP({
    schema: studentSchema,
    rootValue: root,
    graphiql:true
}))
app.use('/graphql/student',express_graphql.graphqlHTTP({
    schema: studentSchema,
    rootValue: root,
    graphiql:true
}))
// const authenRouter = require('./routes/authen-router')
// app.use('/authen',authenRouter )

// const courseRouter = require('./routes/course-router')
// app.use('/course',courseRouter )

// const studentRouter = require('./routes/student-router')
// app.use('/student',studentRouter )

app.listen(5000,()=> console.log('Server Started'))