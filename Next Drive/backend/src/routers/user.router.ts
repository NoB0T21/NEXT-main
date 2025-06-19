import express from "express";
import {login, register} from "../controller/user.controller";
const router = express.Router();

router.post('/signup',register)
router.post('/signin',login)

export default router;