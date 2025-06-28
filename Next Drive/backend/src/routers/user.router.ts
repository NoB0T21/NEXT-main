import express from "express";
import {getuser, getuserbyid, login, register} from "../controller/user.controller";
import middleware from "../middleware/user.middleware";
const router = express.Router();

router.post('/signup',register)
router.post('/signin',login)
router.get('/getuser/:id',middleware,getuserbyid)
router.post('/getshareUSer',middleware,getuser)

export default router;