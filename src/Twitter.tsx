import React from 'react'
import './Twitter.css'
import { RWebShare } from "react-web-share";
import { Post } from './pages/Main'
import { auth,db } from './config/firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useState,useEffect } from 'react'
import { addDoc, collection, getDocs,query,where,deleteDoc,doc } from 'firebase/firestore'

interface Props{
  post : Post;
}
interface Like{
  likeId : string;
  userId : string;
}
export const Twitter=(props: Props)=> {
  const {post} = props;
  const [user] = useAuthState(auth);
  const [likes,setLikes] = useState<Like[] | null>(null);
  
  const likesRef = collection(db,"likes");
  const likesDoc = query(likesRef,where("postId","==",post.id))

  const getLikes=async()=>{
      const data = await getDocs(likesDoc);
      setLikes(
        data.docs.map((doc)=>({userId:doc.data().userId,likeId: doc.id}))
      );
  };

  
  const addLike=async()=>{
    try{
        const newDoc = await addDoc(likesRef,{userId:user?.uid,postId:post.id});
        if(user){
          setLikes((prev)=>
          prev? [...prev,{userId : user.uid,likeId:newDoc.id}]
          :[{userId : user.uid,likeId:newDoc.id}])
        }
    }catch(error){
      console.log(error);
    }
  }
  const removeLike=async()=>{
    try{
      const likeToDeleteQuery = query(likesRef,
        where("postId","==",post.id),
        where("userId","==",user?.uid))

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db,"likes",likeId);
      await deleteDoc(likeToDelete);
      
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    }catch(error){
      console.log(error);
    }
  }
  const hasUserLiked = likes?.some((like) => like.userId === user?.uid);
  useEffect(()=>{
      getLikes();
  },[])
  return (
    <div className='wrap'> 
     <div className="tweet-wrap">
      <div className="tweet-header">
        <img
          src={post.profilePic || ""}
          className="profile-pic"
        />
        <div className="tweet-header-info">
          <div className="uname">{post.userName}<span>@{post.userName}</span></div>
          <p>
           {post.description}
          </p>
        </div>
      </div>
      <div className="tweet-img-wrap">
        <img
          src={post.imageUrl || ""}
          alt=""
          className="tweet-img"
        />
      </div>
      <div className="tweet-interaction">
        <button onClick={hasUserLiked ? removeLike : addLike}>{hasUserLiked?<>❤️</>:<>🤍</>}{likes && likes?.length}</button>
        <RWebShare
        data={{
          text: "Check out this post on PostStuff",
          url: "https://poststuff-cd9db.web.app/",
          title: "MyPost",
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <button>🚀</button>
      </RWebShare>
        
      </div>
    </div>
 
  </div>
  )
}

