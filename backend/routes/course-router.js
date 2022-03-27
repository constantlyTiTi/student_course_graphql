const express = require('express')

const courseCtrl = require('../controllers/course-ctrl')

const router = express.Router()

router.post('/post', courseCtrl.createCourse)
router.put('/post', courseCtrl.updateCourse)
router.delete('/:course_id/student/:student_id', courseCtrl.deleteCourse)
router.get('/:course_id', courseCtrl.getCourse)
router.get('/course_code/:course_code', courseCtrl.getCourseByCode)
router.get('/courses/all', courseCtrl.getCourseList)
router.put('/:course_id/student_id/:student_id', courseCtrl.addStudentToCourse)
module.exports = router