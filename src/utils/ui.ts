import { Side } from "../domain/order";

export const themes = [
    {
        name: "Light",
        value: "light"
    },
    {
        name: "Dark",
        value: "dark"
    }
]


export const colors = {
    green: "#159f49",
    red: "#df4249"
}


export function color(side: Side) {
    return side === Side.Buy ? "green" : "red";
}

export function getBase(productId: string) {
    return productId ? productId.split("-")[0] : "";
}

export function getQuote(productId: string) {
    return productId ? productId.split("-")[1] : "";
}

export function setTheme(id: string) {
    const overlayScrollbarsSettings = {
        className: undefined as string,
        scrollbars: {
            autoHide: "leave"
        }
    };

    switch (id) {
        case "light":
            overlayScrollbarsSettings.className = "os-theme-dark";
            jQuery("body").removeClass("dark");
            jQuery(".ui").not(".dimmer").not(".button").not(".text").removeClass("inverted");
            break;
        case "dark":
            overlayScrollbarsSettings.className = "os-theme-light";
            jQuery("body").addClass("dark");
            jQuery(".ui").not(".dimmer").not(".button").not(".text").addClass("inverted");
            break;
    }

    jQuery("#trades .content").overlayScrollbars(overlayScrollbarsSettings);
    jQuery("#orderbook .content").overlayScrollbars(overlayScrollbarsSettings);
    jQuery("#orders .content").overlayScrollbars(overlayScrollbarsSettings);
}