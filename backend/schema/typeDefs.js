const { modelName } = require("../models/course")
const{gql} = require('apollo-server-express')

const typeDefs = gql`

type StudentType{
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
}

type Query{
    hello:String

    getStudents:[]
}

`
module.exports = typeDefs