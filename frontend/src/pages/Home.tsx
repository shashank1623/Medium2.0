import { Appbar } from "../components/Appbar"



export const Home = () => {

  return <div>
    <Appbar/>

    <div className="flex justify-center">
      <div>
        <h1 className="text-3xl font-bold">Welcome to the Blog App</h1>
        <p className="mt-4">This is a blog app where you can share your thoughts and ideas with the world. You can also read blogs shared by other people.</p>
      </div>
    </div>

  </div>
}