import {
    CarouselOpen,
    DialogClose,
    DialogOpen,
    DrawerClose,
    DrawerOpen,
    handleLoader,
    PagerLoader,
    ProgressLoader,
    snakbar,
    StickySnackbar,
    StickySnackbarClose,
    CustomPagerLoader,
    UpdateModelCardPostSubject,
} from "../rxSubject";

export const startLoader = () => {
    return handleLoader.next(true);
};

// stop loader
export const stopLoader = () => {
    return handleLoader.next(false);
};

// for open dialog
export const open_dialog = (...params) => {
    DialogOpen.next([...params]);
};

// for close dialog
export const close_dialog = (...params) => {
    DialogClose.next(...params);
};

// for open drawer
export const open_drawer = (...params) => {
    DrawerOpen.next([...params]);
};

// for close drawer
export const close_drawer = (...params) => {
    DrawerClose.next([...params]);
};

export const open_post_dialog = ({ data, width }) => {
    // components > model > post-carousel.jsx
    CarouselOpen.next({ data, width });
};

export const sticky_bottom_snackbar = ({ message, type }) => {
    StickySnackbar.next({ message, type });
};

export const close_sticy_bottom_snackbar = () => {
    StickySnackbarClose.next();
};

// for show toast message
export const Toast = (message, type = "success", duration = 2000) => {
    snakbar.next({
        message,
        type,
        duration,
    });
};

export const startPageLoader = () => {
    return PagerLoader.next(true);
};
export const stopPageLoader = () => {
    return PagerLoader.next(false);
};

export const CustomPageLoader = (flag) => {
    return CustomPagerLoader.next(flag);
};

export const updateModelCardPost = (postId, data) => {
    UpdateModelCardPostSubject.next({ postId, data });
};

export const open_progress = () => {
    return ProgressLoader.next(true);
};

export const close_progress = () => {
    return ProgressLoader.next(false);
};

export const drawerToast = (drawerData = {}, isMobile = true) => {
    setTimeout(() => {
        drawerData.isMobile
            ? open_drawer("drawerToaster", drawerData, "bottom")
            : open_dialog("successfullDialog", drawerData);
    }, 30);
};

// to close drawer model and redirect to sideNavMenu
export const backNavMenu = (props) => {
    props.handleCloseDrawer && props.handleCloseDrawer();
    props.onClose && props.onClose();
  };