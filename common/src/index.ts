import z from "zod";

export const signupInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})

export const siginInput = z.object({
    email : z.string().email(),
    password : z.string().min(6)
})

export const createBlogInput = z.object({
    title : z.string(),
    content : z.string()
})

export const updateBlogInput = z.object({
    id : z.string(),
    title : z.string(),
    content : z.string()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof siginInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>