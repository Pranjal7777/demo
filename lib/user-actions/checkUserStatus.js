
// usertype :1 - retailer ,2 - distributer 3 -guest 4 - storemanager

// status: 0 - active , 1 -pending -  , 2 - rejected  ,3-ban ,4-deleted,5-guest

// cart status 0- active /1- abandoned /2- cleared /3- checked Out

// userTypeTxt -1 retailer /2 distributor /3 promoter /4 dataPreneur

// cart type 1-single 2-multi

// store type  status 1-approved 0-pending
//         storeType : 1-Food 2-Grocerym 3-Fashion 4-send package 5-Laundry 6-Pharmacy 7-E-commerce Affiliate 8-E-commerce Partner

// document status 1-approved 0-pending


export const isUserActive = (status) => {
    return status === 1;
}