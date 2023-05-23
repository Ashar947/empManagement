const express = require("express");
const router = express.Router();
const multer = require("multer");



let Storage = multer.diskStorage({
    destination:(req,files,cb)=>{
        cb(null,'public/files')
    },
    filename : (req,file,cb)=>{
        cb(null , file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },

});

let upload = multer({
    storage:Storage,
})
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('../db/conn');
const cookieParser = require('cookie-Parser');
router.use(cookieParser());
const authenticate = require('../middleware/authenticate');
const User = require('../models/userSchema');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });



router.get("/", (req, res) => {
    res.send("server")
})

// const cpUpload = upload.fields([{ name: 'picture', maxCount: 1 }])
router.post("/register" , async (req, res) => {
    const { name, email, phone, work, password } = req.body;
    console.log(`Name is ${name} , email ${email} phone ${phone} work ${work} pasword ${password}`)
    if ( (name.length==0)|| (email.length==0) || (phone.length==0)|| (work.length==0) || (password.length==0)  ) {
        console.log("fields cannot be left emoty");
        return res.status(204).json({ error: "fields cannot be left emoty" });
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            console.log("user already registered")
            return res.status(422).json({ error: "User already exist with this email" })
        }
        const user = new User({ name, email, phone, work, password});
        await user.save()
        res.status(201).json({ message: "User regsitered " })

    }catch (error) {
        res.send(error)
        console.log(error)
    }
}
)


router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if ((email.length==0) || (password.length==0)) {
            return res.status(204).json({ error: "fields cannot be left emoty" });
        }
        const userLogin = await User.findOne({ email: email })
        if (userLogin) {
            const passMatch = await bcrypt.compare(password, userLogin.password);
            // passMatch returns Boolean Value true or false ;
            if (passMatch) {
                console.log(`Password Match is  : ${passMatch}`);
                const token = await userLogin.generateAuthToken();
                res.cookie("jwtoken", token, {
                    httpOnly: true
                });
                res.status(201).json({ message: "User Logged In" })
            }else{
                return res.status(422).json({ error: "Password Incorrect" })
            }
        }
        else {
            return res.status(404).json({ error: "Invalid Email" })
        }
    } catch (error) {
        res.send(`error : ${error}`);
    }
})

router.get('/about',authenticate,(req,res) => {
    console.log('about page')
    console.log(req.rootUser)
    res.send(req.rootUser);
})

router.get('/logout',(req,res) => {
    console.log("Logout Page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User Logout')
})

router.get('/manageemp',authenticate,async(req,res) => {
    const emp = await User.find();
    // console.log(emp)
    res.send(emp)

})


router.delete('/deleteEmp/:id',authenticate,async(req,res)=>{
    const delid = req.params.id;
    console.log(delid)
    const delEmp = await User.deleteOne({_id:delid});
    if (delEmp){
        res.status(201).send("Emp deleted")
    }else{
        res.status(404).send("not deleted")

    }
})
router.put('/editEmp/:id',authenticate,async(req,res)=>{
    const id = req.params.id;
    const { name, email, phone, work, password } = req.body;
    console.log(id)
    const editEmp = await User.updateOne({_id:id},{
        $set : {
            name,email,phone,work
        }});
        console.log(editEmp)
    if (editEmp){
        res.status(201).send("Emp Updated")
    }else{
        res.status(404).send("not deleted")

    }
})


router.get('/editEmp/:id',authenticate,async(req,res)=>{
    const id = req.params.id;
    // console.log(id)
    const user = await User.findOne({_id:id})
    // console.log(user)
    res.status(200).send(user);
})


module.exports = router;