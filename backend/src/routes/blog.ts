import { Hono } from "hono";
import { decode, verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createBlogInput , updateBlogInput } from "@alias1623/medium-common";

export const blogRouter = new Hono<{
    Bindings : {
      DATABASE_URL : string,
      JWT_SECRET : string
    },
    Variables : {
        userId : string;
    }
}>()

blogRouter.use('/*', async (c,next)=>{
    // get the header
    //verify the header
    // if the header is correct , we can proceed
    // if not , we reutrn the user 403 status code

    //extract the user id
    // and pass it down to the route handler
    const header = c.req.header('authorization') || "";
    if(!header){
      c.status(401);
      return c.json({error : "unauthorized"})
    }
    const token = header.split(" ")[1];

    const response = await verify(token,c.env.JWT_SECRET);
    console.log(response.id);
    if(response.id){
        const userId = String(response.id);
        c.set('userId',userId)
        await next();
    }else{
      c.status(403);
      return c.json({error : "unauthorized"})
    }
})

blogRouter.post('/',async (c)=>{
    
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message : "Inupts are incorrect"
        })
    }
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.create({
        data : {
            title : body.title,
            content : body.content,
            authorId : authorId
        }
    })


    return c.json({
        id : post.id
    })
})

blogRouter.put('/', async (c)=>{

    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411)
        return c.json({
            message : "Inputs are incorrect"
        })
    }
    console.log(body.id);
    console.log(body.title);
    console.log(body.content);  
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const post = await prisma.post.update({
            where : {
                id : body.id
            },
            data : {
                title : body.title,
                content : body.content
            }
        })
        return c.json({
            id : post.id
        })
    }catch(e){
        c.status(411);
        return c.json({
            message : "Error while fetchinr blog post"
        })
    }
})
//Todo : add pagination
blogRouter.get('/bulk' , async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post =  await prisma.post.findMany({
        select : {
            content : true,
            title : true,
            id : true,
            author : {
                select :{
                    name : true
                }
            }
        }
    });

    return c.json({
        post
    })

})

blogRouter.get('/:id', async (c)=>{
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const post = await prisma.post.findFirst({
            where : {
                id : id
            },
            select : {
                title : true,
                content : true,
                author : {
                    select :{
                        name : true
                    }
                }
            }
        })
        return c.json({
            id : post
        })
    }catch(e){
        c.status(411);
        return c.json({
            message : "Error while fetchinr blog post"
        })
    }
})



