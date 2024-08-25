const cookieParser = require('cookie-parser');
const express=require('express');
const bcrypt=require('bcrypt');
const jwt= require ("jsonwebtoken");
const userModel=require("./models/user");//user model is come into this


const app=express();
const path=require('path');


app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());




app.get("/",function(req,res){
    res.render("index");
})

app.post("/create",async(req,res)=>{
   let {username,email,password,age}=req.body;

   bcrypt.genSalt(10, (err, salt)=> {
     bcrypt.hash(password, salt, async(err, hash)=> {
        let createdUser= await userModel.create({
            username,
            email,
            password:hash,
            age
           })
           let token= jwt.sign({email},"sdgs");
           res.cookie("token",token);
           res.send(createdUser);
    })
})
});
app.get("/login",function(req,res){
    res.render('login');
})

//check korchi user ache ki nai  password ar email dia usser login ache nki
app.post("/login",async(req,res)=>{
    
    let user= await userModel.findOne({email:req.body.email});
    if(!user) return res.send("something went wrong");
    
   bcrypt.compare(req.body.password,user.password,function(err,result){
         if(result) {
            let token= jwt.sign({email:user.email},"sdgs");
            res.cookie("token",token);
            res.send(`Welcome`);
         }
         else{
            res.send("Something spicy is cooking");
         }
   
   })
});

app.get("/logout",function(req,res){
    res.cookie("token","");
    res.redirect("/");
})
app.listen(3000);