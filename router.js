const router = require('express').Router()

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

const { authLogIn, registereUser } = require('./handlers/authHandler')
const { authMiddleware } = require('./handlers/authMiddleware')

const {
  addEnrollmentToCourse,
  getEnrollmentsByStudentsId,
} = require('./handlers/enrollmentHandler')

const {
  getCourses,
  getCourseById,
  postCourses,
  putCourses,
  deleteCourses,
  getCoursesByInstructor,
  getStudentForCourse,
} = require('./handlers/coursesHandlers')

const {
  getDivingLog,
  getDivingLogById,
  postDivingLog,
  putDivingLog,
  deleteDivingLog,
} = require('./handlers/logBookHandlers')

const {
  getInstructors,
  postInstructor,
  getInstructorById,
  putInstructor,
} = require('./handlers/instructorsHandlers')

const { getUsers, getUsersById } = require('./handlers/usersHandlers')

// Course catalog endpoints
//------------------------------------
router.get('/api/courses', getCourses)
router.get('/api/course/:id', getCourseById)
router.get('/api/studentsForCourse/:id', getStudentForCourse)
router.get('/api/courses/:instructorId', getCoursesByInstructor)
router.post('/api/courses', upload.single('file'), postCourses)
router.patch('/api/courses/:id', upload.single('file'), putCourses)
router.delete('/api/courses/:id', deleteCourses)

// Enrollment endpoints
//------------------------------------
router.post('/api/enroll', addEnrollmentToCourse)
router.get('/api/enrollmentsByStudent/:id', getEnrollmentsByStudentsId)

// Instructor endpoints
//------------------------------------
router.get('/api/instructors', getInstructors)
router.post('/api/instructors', postInstructor)
router.get('/api/instructors/:id', getInstructorById)
router.post('/api/instructors/:id', upload.single('file'), putInstructor)
// router.delete('/api/instructors/:id', deleteInstructor) - Not used. for After the course

// Diving logbook endpoints
//------------------------------------
router.get('/api/logs', getDivingLog)
router.get('/api/logs/:id', getDivingLogById)
router.post('/api/logs', postDivingLog)
router.put('/api/logs/:id', putDivingLog)
router.delete('/api/logs/:id', deleteDivingLog)

// user management endpoints
//------------------------------------
router.get('/api/users', getUsers)
router.get('/api/users/:id', getUsersById)
// router.put('/api/users/:id', putUser)  - Not used. for After the course
// router.delete('/api/users/:id', deleteUser) - Not used. for After the course

// jwt login & Auth
//------------------------------------
router.post('/api/auth/login', authLogIn)
router.post('/api/auth/register', registereUser)
// Protected routs
router.get('/api/students', authMiddleware, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden.')
  }

  // Return student data
  res.status(200).json({ name: 'John Doe', roll: '123456' })
})

router.get('/api/instructors', authMiddleware, (req, res) => {
  console.log('000000000000000000000000000000')

  if (req.user.role !== 'instructor') {
    return res.status(403).send('Forbidden.')
  }

  // Return instructor data
  res.status(200).json({ name: 'Hammad', courses: [''] })
})
module.exports = router
