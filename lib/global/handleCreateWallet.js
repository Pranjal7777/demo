import { createWallet } from "../../services/payments";
import { getCookie } from "../session";

export const handleCreateWallet = async (authToken) => {
    let userId = getCookie("uid");
    let userType = "user";
    let token = authToken ? authToken : getCookie("token");
    let defaultCurrency = getCookie("defaultCurrency");

    try {
        await createWallet({
            userId: userId,
            userType: userType,
            currency: defaultCurrency != "undefined" ? defaultCurrency : "USD",
        },
            token
        );
    } catch (e) {
        console.error("create wallet error", e, e.response);
    }
};