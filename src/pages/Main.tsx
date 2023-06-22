import {getDocs,collection} from 'firebase/firestore'
import { db } from '../config/firebase'
import { useEffect, useState } from 'react'
import { Twitter } from '../Twitter';
import { auth } from '../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth'
export interface Post{
    description : string;
    imageUrl?: string;
    postId : string;
    userId : string;
    userName : string;
    profilePic? : string;
    id:string;
}
const MainAuthenticated = ()=>{
    const [postList,setPostList] = useState<Post[] | null>(null);
        const postRef = collection(db,"posts");

        const getPosts = async()=>{
            const data = await getDocs(postRef);
            setPostList(
                data.docs.map((doc)=>({...doc.data(), id:doc.id})) as Post[]
            );
        }
        useEffect(()=>{
            getPosts();
        },[]);

        return <div>{postList?.map((post)=>(
            <Twitter post={post}/>
        ))}</div>
}

export const Main = ()=>{
    const [user] = useAuthState(auth);

  return user ? <MainAuthenticated /> : <h2>Welcome to PostStuffff.........</h2>;
   

        
        
    
}