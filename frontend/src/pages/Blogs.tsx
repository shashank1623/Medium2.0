import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";

export const Blogs = () => {

  // store it in state
  
  const {loading , blogs} = useBlogs();
  if(loading){
    return <div>
        Loading....
    </div>
  }
  return <div>
  <Appbar />
  <div  className="flex justify-center">
      <div>
          {blogs.map(blog => <BlogCard
              id={blog.id}
              authorName={blog.author.name || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={"2nd Feb 2024"}
          />)}
      </div>
  </div>
</div>
};
