import * as React from 'react';
import { FOLDER_SHOW, MEDIA_ALBUM } from '../../lib/config/vault';
import Icon from '../image/icon';
import Image from '../image/image';
import useLang from '../../hooks/language';

export const NoFolders = ({ handleCreate, height, title }) => {
    const [lang] = useLang()
    return (
        <div className='noVaultFolder'>
            <div className='d-flex flex-column w-100 align-items-center justify-content-center' style={{ height: height || '80vh' }}>
                <div className=''>
                    <Image
                        src={FOLDER_SHOW}
                        width="40"
                        height="40"
                    />
                </div>
                <div className='px-2 fntSz24'>
                    {title || lang?.noFolders}
                </div>
            </div>
        </div>
    );
};