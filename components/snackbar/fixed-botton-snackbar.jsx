import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const Alert = dynamic(() => import('@material-ui/lab/Alert'));
import React from 'react'
import useProfileData from '../../hooks/useProfileData';
import { StickySnackbarClose } from '../../lib/rxSubject'
import { getCookie } from '../../lib/session';

export default function FixedBottonSnackbar() {
    const [open, setOpen] = React.useState(getCookie('nonVarifiedProfile'));
    const [data, setData] = React.useState({ message: "", type: 'warning' })
    const [profile] = useProfileData();
    const router = useRouter();
    // StickySnackbar.subscribe((...params) => show_alert(...params));
    StickySnackbarClose.subscribe(() => setOpen(false))

    const show_alert = (data) => {
        setData(data)
        setOpen(true)
    }

        return (
            !(router.asPath.includes('chat') || router.asPath.includes('message')) && profile.statusCode === 5 ? <Alert style={{ borderRadius: 0 }} variant="filled" severity={data?.type || "warning"}>
                {data.message || 'Your profile is inactive. We are verifying your identity.'}
            </Alert>
                : profile.statusCode === 6 ? <Alert style={{ borderRadius: 0 }} variant="filled" className='bg-danger' severity={data?.type || "warning"}>
                    {'Your Documents have been rejected, please go to the Edit Profile Section and re-upload your documents.'}
                </Alert> : ""
        )
    return <div></div>
}
