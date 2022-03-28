const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const studentType = require('./studentType');

const courseType = new GraphQLObjectType({
    name: 'course',
    fields: () => ({
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
            type: new GraphQLList(studentType)
        }
    })
});
module.exports = courseType