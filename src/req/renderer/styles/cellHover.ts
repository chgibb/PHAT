import {style} from "typestyle";

export const cellHover = style({
    $nest : {
        "&:hover" : {
            cursor : "pointer",
            backgroundColor: "#1e9cd7"
        }
    }
});
