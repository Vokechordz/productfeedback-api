const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const bodyParser= require('body-parser')
const user_route= express()
const multer= require('multer')
const path= require('path')

const storage= multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, 'public/userImages')
    },
    filename: (req,file,cb)=> {
       cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload= multer({ storage: storage })

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(express.json())

router.route('/')
    .get(usersController.getAllUsers)
    .post(upload.single('profilepic') ,usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router