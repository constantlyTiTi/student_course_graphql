var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');

export const studentType = new GraphQLObjectType({
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
            courses: [courseType]

        }
    }
});

export const courseType = new GraphQLObjectType({
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
            students: [studentType]
        }
    }
});