import { configureStore } from '@reduxjs/toolkit'
import  {userReducer}  from '../redux/auth-redux'
import  {courseReducer}  from '../redux/course-redux'
import  {studentReducer}  from '../redux/student-redux'
import{combineReducers} from 'redux'

export default configureStore({
    reducer: combineReducers({
        user:userReducer,
        course:courseReducer,
        student:studentReducer
    })
})