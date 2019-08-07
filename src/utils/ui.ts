import { Side } from "../domain/order";
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
    switch (id) {
        case "light":
            jQuery("body").removeClass("dark");
            jQuery(".ui").removeClass("inverted");
            break;
        case "dark":
            jQuery("body").addClass("dark");
            jQuery(".ui").addClass("inverted");
            break;
    }
}