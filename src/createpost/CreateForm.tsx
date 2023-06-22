import * as yup from 'yup'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import {useAuthState} from 'react-firebase-hooks/auth'
import { db,auth ,storage} from '../config/firebase'
import {addDoc,collection} from 'firebase/firestore'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {useNavigate} from 'react-router-dom'
import { useId, useState, ChangeEvent } from 'react'



interface PostData{
    description:string;
    imageUrl?: string;
    profilePic? : string;
}
export const CreateForm=()=>{
    const [imageUpload,setImageUpload] = useState<File | null>(null);
    const postUId = useId();
    
    const schema = yup.object().shape({
        description : yup.string().required("Post description is required")
        
    })

    const {register,handleSubmit, formState:{errors}} = useForm<PostData>({
        resolver : yupResolver(schema)
    });
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const postRef = collection(db,"posts");

    const submitForm=async(data : PostData)=>{
        if (imageUpload) {
            const imageRef = ref(storage,`${postUId}${user?.uid}`);
            await uploadBytes(imageRef, imageUpload);
            const downloadURL = await getDownloadURL(imageRef);
            data.imageUrl = downloadURL;
          }
        await addDoc(postRef,{
            ...data,
            userName : user?.displayName,
            userId : user?.uid,
            profilePic : user?.photoURL
        });
        navigate('/')

    }
    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <textarea placeholder="Description" {...register("description")}/>
            <p style={{color:"red"}}>{errors.description?.message}</p>
            <input type="file" onChange={(event : ChangeEvent<HTMLInputElement>)=>{
                const file = event.target.files?.[0] || null;
                setImageUpload(file);
            }} />
            <input type="submit" className='sub'/>
        </form>
    )
}



