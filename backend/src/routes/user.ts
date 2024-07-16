import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';

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
    const hashedPassword = await bcrypt.hash(body.password,10);
  
    try{
      const user = await prisma.user.create({
        data : {
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
  
    try {
      const body = await c.req.json();
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