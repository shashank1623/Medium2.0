import { BlogCard } from "../components/BlogCard"

export const Blogs = () => {

    return <div>
        <BlogCard 
            id = 'c714f30d-6c35-4390-b306-6925003169cc'
            authorName={"John Doe"} 
            title={"Google Has Finally Dethroned ChatGPT"} 
            content={"Google has finally dethroned OpenAI's ChatGPT with their new AI model, LaMDA. LaMDA is a more advanced AI model that can understand context better than ChatGPT. This is a huge win for Google and a big loss for OpenAI."}
            publishedDate={"2nd Feb 2024"}
        />
    </div>
}