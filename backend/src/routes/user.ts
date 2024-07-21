import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';
import {signupInput , siginInput} from '@alias1623/medium-common'

export const userRouter = new Hono<{
    Bindings : {
      DATABASE_URL : string,
      JWT_SECRET : string
    }
}>()


userRouter.post('/singup',async (c) => {

    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message : "Inputs are not Correct"
      })
    }

    const hashedPassword = await bcrypt.hash(body.password,10);
  
    try{
      const user = await prisma.user.create({
        data : {
          name : body.name,
          email : body.email,
          password : hashedPassword
        },
      });
  
      const token = await sign({id : user.id},c.env.JWT_SECRET);
      return c.json({
        jwt : token
      });
    }catch(e){
      c.status(403);
      return c.json({
        error : "Error while signing up"
      })
    }
    
  })
  
userRouter.post('/singin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message : "Inputs are not Correct"
      })
    }  
    try {

      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      });
  
      if (!user) {
        c.status(403);
        return c.json({
          error: "user not found",
        });
      }
      const isPasswordValid = await bcrypt.compare(body.password , user.password);
      if(!isPasswordValid){
        c.status(403);
        return c.json({
          error : "invalid credentials",
        })
      }
      const token = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt : token });
    } catch (e) {
      c.status(500);
      return c.json({
        error: "Internal server error"
      });
    }
})