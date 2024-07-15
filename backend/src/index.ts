import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { jwt, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';

import z from 'zod'

const signupInput = z.object({
  username : z.string().email(),
  password : z.string().min(6),
  name : z.string().optional()
})

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.use('/api/v1/blog/*', async (c,next)=>{
  // get the header
  //verify the header
  // if the header is correct , we can proceed
  // if not , we reutrn the user 403 status code
  const header = c.req.header('authorization') || "";
  if(!header){
    c.status(401);
    return c.json({error : "unauthorized"})
  }
  const token = header.split(" ")[1];


  const response = await verify(token,c.env.JWT_SECRET);
  if(response.id){
    await next();
  }else{
    c.status(403);
    return c.json({error : "unauthorized"})
  }
})


app.get('/', (c)=>{

  return c.json({
    msg : "Jinda hu bhai"
  })
})

app.post('/api/v1/singup',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();
  const hashedPassword = await bcrypt.hash(body.password,5);

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

app.post('/api/v1/singin', async (c) => {
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



app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  console.log(id);
  return c.text('get blog route')
})

export default app
