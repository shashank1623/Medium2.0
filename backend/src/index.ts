import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
const app = new Hono<{
  Bindings : {
    DATABASE_URL : string
  }
}>()

app.post('/api/v1/singup', (c) => {

  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text('signup route')
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
