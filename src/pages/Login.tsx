import { auth,provider } from "../config/firebase"
import { signInWithPopup } from "firebase/auth"
import {useNavigate} from 'react-router-dom'
export const Login = ()=>{
    const navigate = useNavigate();
    const signIn = async() =>{
        const result = await signInWithPopup(auth,provider);
        navigate('/');
    }
    return (<div className="login">
        <div style={{fontSize:"25px",padding:"25px"}}>
            Sign in with Google</div>
        <button style={{fontSize:"20px"}}onClick={signIn}>Sign In</button>
    </div>)
}