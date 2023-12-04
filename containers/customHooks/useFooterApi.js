import React from 'react'
import { getCookie } from '../../lib/session';
import { getPrivacyAndConditions } from '../../services/auth';

/**
 * @description footer api and function handle with custom hook
 * @author Kashinath
 * @date 13 Jun 2023
 * @param type: number
 */

const useFooterApi = () => {

    const [content, setContent] = React.useState("");

    const getLegalContentApi = async (type) => {
        const list = {
            type: type,
            lan: getCookie("lan") || "en",
        };
        try {
            const res = await getPrivacyAndConditions(list)
            if (res && res?.data && res?.data?.data) {
                setContent(res?.data?.data?.pageContent);
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        [content, getLegalContentApi]
    )
}

export default useFooterApi;