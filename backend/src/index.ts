import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.post('/api/v1/singup',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  try{
    const user = await prisma.user.create({
      data : {
        email : body.email,
        password : body.password
      },
    });

    const token = await sign({id : user.id},c.env.JWT_SECRET);
    return c.json({token});
  }catch(e){
    c.status(403);
    return c.json({
      error : "Error while signing up"
    })
  }
  
})

app.post('/api/v1/singin', (c) => {
  return c.text('signin route')
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
