import { Router } from "express";//Express se Router ko import karta hai taaki hum alag-alag routes ko modular tareeke se define kar sakein.

import * as userController from '../controllers/user.controller.js'
import * as authMiddleware from '../middleware/user.middleware.js'
import { body } from "express-validator"; // ye check karta hai email or password sahi hai ya nhi 
//body = Express Validator ka function, jo POST request ke body ke specific fields (email, password, etc.) ko check / validate karta hai.
const router = Router()


router.post('/register',

    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 chracter long'),
    //agar koi bhi error aati hai toh vo kha pakad me aaigi creteUserController me validationResult me 
    userController.createUserController)


router.post('/login',

    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 chracter long'),

    userController.loginUserController)

router.get("/profile", authMiddleware.authUser, userController.profileController)

router.get("/logout", authMiddleware.authUser, userController.logoutUserController)

router.get("/all", authMiddleware.authUser, userController.getAllUserController)


export default router