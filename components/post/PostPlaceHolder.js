import * as React from 'react';
import { PlusIcon } from './PlusIcon';
import useLang from '../../hooks/language';
// import Image from 'next/image';
import isMobile from '../../hooks/isMobile';
import { CROSS_ICON_POSTSLIDER, NEXT_ARROW_POSTSLIDER, PREV_ARROW_POSTSLIDER, videoPlay_icon } from '../../lib/config';
import Icon from '../image/icon';
import { useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from '../image/image';


const SortableItem = ({ handleRemoveFile, file, id, isEdit, showThumb = false }) => {
    const [lang] = useLang()
    const [mobileView] = isMobile()
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleFileRemove = (e, id) => {
        e.stopPropagation()
        handleRemoveFile(id)
    }

    return (
        <div className="m-2 fileItem item" ref={setNodeRef} style={style} {...attributes} {...listeners} >
            {
                file.type === 'VIDEO' ? <div className='position-relative w-100 h-100 video_section'>
                    <div className='video_play_icon'>
                        <Icon
                            icon={videoPlay_icon + "#videoPlayIcon"}
                            width={50}
                            height={50}
                            viewBox="0 0 70.311 70.313"
                        />
                    </div>
                    <Image
                        src={(file.mediaContentId || file.thumb) ? s3ImageLinkGen(S3_IMG_LINK, file.preview, 70, 120, 120) : file.preview}
                        width="120"
                        height='120'
                        objectFit='cover'
                        style={{ objectFit: "cover", filter: "brightness(0.8)" }}
                    />
                </div> : <Image objectFit='cover' src={file.mediaContentId ? s3ImageLinkGen(S3_IMG_LINK, file.preview, 70, 120, 120) : showThumb ? s3ImageLinkGen(S3_IMG_LINK, file.thumb, 70, 120, 120) : file.preview} width={mobileView ? 80 : 120} height={mobileView ? 80 : 120} />
            }
            {
                isEdit ? <div className='removeFile' onClick={(e) => handleFileRemove(e, file.id)}>

                    <Icon
                        icon={`${CROSS_ICON_POSTSLIDER}#Group_133516`}
                        class="cursorPtr handleCross"
                        color="#000000"
                        size={mobileView ? 20 : 25}
                        style={{ opacity: 0.8 }}
                        viewBox="0 0 35 35"
                    />
                </div> : ""
            }


        </div>
    )
}

export const PostPlaceHolder = ({ isSingle, isEdit, onClick = () => { }, setFiles, handleRemoveFile = () => { }, files = [], showTitle = true, showThumb = false }) => {
    const [lang] = useLang()
    const [mobileView] = isMobile()
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const newFiles = [...files]
    const scrollRef = React.useRef()
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    // if (isEdit) {
    //     SortableItem = sortable(SortableItem)
    // }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFiles((items) => {
                const oldIndex = items.findIndex(f => f.id === active.id);
                const newIndex = items.findIndex(f => f.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    const handleSortItems = (items) => {
        const nItems = items.map((item, idx) => {
            return ({
                ...item,
                seqId: idx + 1
            })
        })
        setFiles(nItems)
    }

    function sideScroll(element, direction, speed, distance, step) {
        let scrollAmount = 0;
        var slideTimer = setInterval(function () {
            if (direction == 'left') {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }



    return (
        <div className='add_media_wrap'>
            <div className='add_media position-relative pb-4' id='uploadPostFile'>
                {showTitle ? <label className='text-app'>{lang.addContent} *</label> : ""}
                <div className="selectedFiles d-flex overflow-auto mb-1 align-items-center" ref={scrollRef}>
                    <DndContext
                        sensors={sensors}
                        modifiers={[restrictToHorizontalAxis]}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={files}
                            strategy={horizontalListSortingStrategy}
                        >
                            {
                                (isEdit && !isSingle) || (isSingle && !files.length) ? <PlusIcon handleOnClick={onClick} /> : ""
                            }

                            {
                                newFiles.map((file, i) => {
                                    return <SortableItem isEdit={isEdit} key={file?.id} id={file?.id} file={file} handleRemoveFile={handleRemoveFile} showThumb={showThumb} />
                                })
                            }
                        </SortableContext>
                    </DndContext>
                </div>
                {
                    files.length > 3 ? <div>
                        <div className='prevArrow cursorPtr' onClick={() => sideScroll(scrollRef.current, 'left', 20, 100, 12)}>
                            <Icon
                                icon={`${PREV_ARROW_POSTSLIDER}#vuesax_bold_arrow-right`}
                                width={20}
                                height={20}
                                alt="prev-icon"
                                viewBox="0 0 50 50"
                            />
                        </div>
                        <div className='nextArrow cursorPtr' onClick={() => sideScroll(scrollRef.current, 'right', 20, 100, 12)}>
                            <Icon
                                icon={`${NEXT_ARROW_POSTSLIDER}#vuesax_bold_arrow-right`}
                                width={20}
                                height={20}
                                alt="prev-icon"
                                viewBox="0 0 50 50"
                            />
                        </div>
                    </div> : ""
                }
            </div>
            <style jsx>
                {
                    `.postLabel {
                        color: var(--l_light_app_text)
                    }
                    :global(.selectedFiles) {
                        position:relative;
                    }
                    :global(.selectedFiles .fileItem) {
                        border-radius: 12px;
                        overflow: hidden;
                        width: ${mobileView ? '90px' : '120px'};
                        height:${mobileView ? '90px' : '120px'};
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      }
                      :global(.dragged) {
                        background-color: rgb(37, 37, 197);
                      }
                      :global(.video_play_icon){
                        position: absolute;
                        top: calc(50% - 25px);
                        left: calc(50% - 25px);
                        z-index: 1;
                    }
                    :global(.fileItem .removeFile) {
                        position: absolute;
                        bottom: ${mobileView ? '6px' : '12px'};
                        right: ${mobileView ? '6px' : '12px'};
                        z-index: 2;
                    }
                    :global(.fileItem) {
                        cursor: grab;
                        flex: 0 0 auto;
                    }
                    :global(.fileItem > span) {
                        width: 100% !important;
                        height: 100% !important;
                    }
                    .prevArrow {
                        position: absolute;
                        left: 0;
                        bottom: 0px;
                    }
                    .nextArrow {
                        position: absolute;
                        right: 0;
                        bottom: 0px;
                    }
                    `
                }
            </style>
        </div>
    );
};