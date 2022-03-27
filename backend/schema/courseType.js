var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
const studentType = require('./studentType')

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
            students: {
                type: GraphQLList(studentType)
            }
        }
    }
});
module.exports = courseType