import {cssRule} from 'typestyle';

import {tableCell} from "./tableCell";
import { color } from 'csx';

//cssRule("table",tableCell);

//cssRule("td",tableCell,{padding : "5px"});

//cssRule("th",tableCell,{padding : "5px"});

cssRule("body",{
    backgroundColor : `${color("#ffffff")}`
});
