import {style} from "typestyle";

export const activeHover = style({
    cursor : "pointer",
    boxShadow : "0 0 10px #000",
    transform : "translateY(-0.01em)"
});

export const activeHoverButton = style({
    borderRadius : "30%"
});
