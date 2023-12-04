export const handleSortConvoList = (convoList, sortType) => {
    let newConvoList = convoList ? [...convoList] : []
    newConvoList = newConvoList.filter((data) => data.lastMessageDetails?.hasOwnProperty('body') || (data.lastMessageDetails?.hasOwnProperty('action') && data.lastMessageDetails?.action !== 'conversationCreated'))
    if (!sortType) {
        newConvoList.sort((a, b) => {
            if (a.customType < b.customType) {
                return 1;
            }
            if (a.customType > b.customType) {
                return -1;
            }
            return 0;
        })
    }
    const vipList = sortType ? [] : [...newConvoList.filter(c => c.customType === 'VipChat')]
    const nonVipList = sortType ? [...newConvoList] : [...newConvoList.filter(c => c.customType !== 'VipChat')]
    vipList.sort((a, b) => sortType === 1 ? Number(a.lastMessageDetails.sentAt) - Number(b.lastMessageDetails.sentAt) : Number(b.lastMessageDetails.sentAt) - Number(a.lastMessageDetails.sentAt))
    nonVipList.sort((a, b) => sortType === 1 ? Number(a.lastMessageDetails.sentAt) - Number(b.lastMessageDetails.sentAt) : Number(b.lastMessageDetails.sentAt) - Number(a.lastMessageDetails.sentAt))
    return [...vipList, ...nonVipList];
}