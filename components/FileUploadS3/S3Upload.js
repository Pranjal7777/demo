import * as React from 'react';
import useS3Upload from './useS3Upload';
import { createPortal } from 'react-dom';
import { Dialog, DialogActions, Drawer, ThemeProvider, createTheme } from '@mui/material';
import Button from '../button/button';
import CustomDataLoader from '../loader/custom-data-loading';
import { StatusBar } from '@uppy/react';
import isMobile from '../../hooks/isMobile';

const S3Upload = ({ successCallback, isTransForm = true, limit, fileTypes, removeFile, onAddFiles = () => { }, folder, open, handleClose, targetId, quality, theme = 'dark', beforeUpload = () => true, showUploadButton, autoProceed, watermark = true, autoOpenFileEditor = false }) => {
    const {
        handleUpload,
        showButton,
        uploadRef,
        generateThumb,
        applyWatermark
    } = useS3Upload({
        isTransForm: isTransForm,
        limit: limit,
        fileTypes: fileTypes,
        onUploadComplete: successCallback,
        folder: folder,
        target: targetId,
        quality: quality,
        open: open,
        beforeUpload: beforeUpload,
        watermark: watermark,
        autoOpenFileEditor: autoOpenFileEditor
    })
    const themeObj = createTheme({
        palette: {
            mode: theme,
        },
    });

    const [mobileView] = isMobile();

    React.useEffect(() => {
        if (uploadRef && removeFile)
            if (removeFile && uploadRef) {
                if (uploadRef.getFiles().find(fr => fr.id === removeFile)) {
                    uploadRef.removeFile(removeFile)
                }
            }
    }, [uploadRef, removeFile])
    React.useEffect(() => {
        if (autoProceed) {
            handleUpload()
        }
    }, [autoProceed])

    let DynamicDialog = mobileView ? Drawer : Dialog;

    return createPortal(
        <>
            <ThemeProvider theme={themeObj}>
                <DynamicDialog
                    maxWidth='md'
                    open={open}
                    handleClose={handleClose}
                    onClose={handleClose}
                    className='mu-dialog s3Dialog'
                    keepMounted
                    disableEnforceFocus
                    anchor="bottom" // Adjust the anchor as per your requirement
                >
                    {generateThumb &&
                        <div className='p-3 d-flex align-items-center specific_section_bg sticky-bottom'>
                            <CustomDataLoader type="ClipLoader" loading='true' size={15} />
                            <div className='ml-3'>Generating Thumbnails, Please wait...</div>
                        </div>}
                    {applyWatermark &&
                        <div className='p-3 d-flex align-items-center specific_section_bg sticky-bottom'>
                            <CustomDataLoader type="ClipLoader" loading='true' size={15} />
                            <div className='ml-3'>Adding Watermark</div>
                        </div>}
                    <div style={{ zIndex: autoProceed ? -2 : 5555, position: 'relative', display: autoProceed ? "none" : "block" }} id={targetId}></div>
                    {
                        autoProceed ? <div className='progressBar py-3 px-2 my-3' style={{ maxWidth: mobileView ? "" : '600px', minWidth: mobileView ? "" : "500px", minWidth: mobileView ? "" : "450px", width: '100%', margin: 'auto' }}>
                            <h5 className='px-2 mb-4 w-100 text-center dv_appTxtClr'>Uploading please wait...</h5>
                            <StatusBar uppy={uploadRef} />
                        </div> : ""
                    }
                    {!generateThumb && showButton && <DialogActions className='mb-2'>
                        <Button
                            type="button"
                            fclassname='gradient_bg w-auto rounded-pill py-3 d-flex align-items-center justify-content-center text-white'
                            btnSpanClass='text-white'
                            btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                            onClick={handleClose}
                            children={'Close'}
                        />
                        <Button
                            type="button"
                            fclassname='gradient_bg w-auto rounded-pill py-3 d-flex align-items-center justify-content-center text-white'
                            btnSpanClass='text-white'
                            btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                            onClick={() => uploadRef.cancelAll()}
                            children={'Reset'}
                        />
                        {
                            showButton && showUploadButton ?
                                <Button
                                    type="button"
                                    fclassname='gradient_bg w-auto rounded-pill py-3 mt-1 d-flex align-items-center justify-content-center text-white'
                                    btnSpanClass='text-white text-nowrap'
                                    btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                                    onClick={handleUpload}
                                    children={'Upload Files'}
                                />
                                : <>{
                                    !autoProceed && !showUploadButton ? <Button
                                        type="button"
                                        fclassname='gradient_bg w-auto rounded-pill py-3 mt-1 d-flex align-items-center justify-content-center text-white'
                                        btnSpanClass='text-white'
                                        btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                                        onClick={() => { onAddFiles(uploadRef.getFiles()); handleClose() }}
                                        children={'Add Files'}
                                    /> : ""
                                }</>}

                    </DialogActions>
                    }

                </DynamicDialog>
            </ThemeProvider >
            <style jsx>
                {`
             :global(.uppy-Dashboard-inner) {
                border: none;
                background: var(--l_app_bg) !important;
                max-height: 77vh
             }
             :global(.mu-dialog .MuiPaper-root,) {
                background: var(--l_app_bg) !important;
             }
             :global(.s3Dialog.mu-dialog .MuiPaper-root) {
                overflow-y: auto !important;
             }
             :global(.uppy-DashboardContent-bar) { 
                background-color: var(--l_app_bg) !important;
             }
             :global(.uppy-StatusBar) { 
                background-color: var(--l_app_bg) !important;
                width: 95% !important;
                margin: auto !important;
                height: 24px !important;
             }
             :global(.uppy-StatusBar-actions) {
                display: none !important
             }
            :global(.uppy-StatusBar *) {
                color: var(--l_app_text) !important;
                font-size: 16px !important;
             }
             :global(.uppy-DashboardContent-bar *) {
                color: var(--l_app_text) !important;
             }
             :global(.uppy-StatusBar-actionCircleBtn) {
                display: ${autoProceed ? 'none !important' : 'block'}
             }
             :global(.uppy-StatusBar::before) {
                background-color: var(--l_app_bg2) !important;
                height: 24px !important;
                border-radius: 24px;
            }
            :global(.uppy-StatusBar-progress) {
                background-color: var(--l_base) !important;
                height: 24px !important;
                border-radius: 24px;
            }
            :global(.uppy-StatusBar-status) {
                position: absolute;
                top: 0;
                left: 5px;
                width: 100%;
                justify-content: center;
                height: 100%;
            }
            :global(.uppy-StatusBar.is-waiting) {
                height: 0 !important;
            }
            :global(.uppy-StatusBar.is-complete) {
                display: none !important;
            }
            :global(.uppy-StatusBar) {
                border: none !important;
            }
            :global(.s3Dialog)  {
                z-index: 9999999999999;
            }
            `}
            </style>
        </>
        , document.body)
};

export default React.memo(S3Upload)