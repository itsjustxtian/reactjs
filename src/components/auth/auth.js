import {auth} from '../../config/firebase-config'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const Auth = () => {

        const signIn = () => {};
    return (
        <div>
            <input placeholder="Email..."/>
            <input placeholder="Password..."/>
            <button onClick={signIn}> Sign In </button>
        </div>
    )
}