
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
// const courseType = require('./courseType');

const studentType = new GraphQLObjectType({
    name: 'student',
    fields: () => ({
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
        // courses: {
        //     type: new GraphQLList(courseType)
        // }

    })
});
module.exports = studentType