import { useSelector } from "react-redux";
import useProfileData from "../hooks/useProfileData";
import { getCookie } from "../lib/session";
import Error from "../pages/_error";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { authenticate } from "../lib/global/routeAuth";

/**
 * @description Page protection wrapper that prevents unauthorized access to pages.
 * @author Ajay Nagotha
 * @param props{
 *  forLogin: boolean - if true then page will be accessible to logged in users only
 *
 *  forUser: boolean - if true then page is only acessile for USERS
 * 
 *  forCreator: boolean - if true then page is only acessile for CREATORS
 *
 *  forAgency: boolean - if true then page is only acessile for AGENCY ADMIN/EMPLOYEE
 * }
 *
 */

const RouterContext = ({ forLogin = false, isLoggedIn = false, forUser = false, forCreator = false, forAgency = false, ...props }) => {
    const router = useRouter()
    const auth = isLoggedIn || getCookie('auth');
    const profileData = props?.userProfile || (getCookie('profileData')  ? JSON.parse(getCookie('profileData')) : null);

    useEffect(() => {
        if(forLogin && !auth) {
            authenticate(router?.asPath)
        }
    }, [forLogin, auth])

    if(forLogin && !auth) {
        return <div></div>
    }
    if(Number(profileData?.userTypeCode) === 2 && !forCreator) {
        return <Error />
    }
    if(Number(profileData?.userTypeCode) === 1 && !forUser) {
        return <Error />
    }
    if(Number(profileData?.userTypeCode) === 3 && !forAgency) {
        return <Error />
    }
    return (
        props.children
    );
};

export default RouterContext;