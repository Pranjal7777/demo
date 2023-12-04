import React from 'react'
import { getCookie } from '../lib/session'

const AuthProvider = () => {

    React.useEffect(()=>{
        const token = getCookie('token');
        if(window !== undefined){
            if(window.location.pathname !== '/' && !token){
                return window.location = '/'
            }
        }
    },[])

    return (
        <div>
            
        </div>
    )
}


export default AuthProvider