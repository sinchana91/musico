import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';


const register= async (req, res) => {
    const{name,email,password}=req.body;
    try{
        let user =await prisma.user.findUnique({where:{email}});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        });
        const payload={user:{id:user.id}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:360000},(err,token)=>{
            if(err) throw err;
            res.status(200).json({token});
        });


    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}


const login= async (req, res) => {
    const{email,password}=req.body;
    try{
        const user=await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const payload={user:{id:user.id}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:360000},(err,token)=>{
            if(err) throw err;
            res.status(200).json({token});
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message:error.message});
    }
}

export {register,login};

