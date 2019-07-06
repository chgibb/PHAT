import {cssRule} from "typestyle";
import {color} from "csx";

import {tableCell} from "./tableCell";

cssRule("table",tableCell);

cssRule("td",tableCell);

cssRule("th",tableCell);

cssRule("body",{
    backgroundColor : `${color("#ffffff")}`
});
