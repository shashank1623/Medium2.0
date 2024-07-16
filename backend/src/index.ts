import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
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

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);

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







export default app
