import { getCookie, getCookiees, isBrowser } from '../session';

const UAParser = require('ua-parser-js');

export const detectDevice = (ctx) => {
    const userAgent = ctx.req ? ctx.req.headers['user-agent'] : navigator.userAgent;
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type;
    return deviceType === 'mobile'
}

export const detectTablet = (ctx = {}) => {
    const userAgent = ctx.req ? ctx.req.headers["user-agent"]?.toLowerCase() : navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    return isTablet;
}

export const getDeviceId = (req) => {
    if (isBrowser()) {
        return window?.deviceId || getCookie("deviceId")
    }
    if (req) {
        return getCookiees("deviceId", req) || 'web_app'
    }
    return false
}