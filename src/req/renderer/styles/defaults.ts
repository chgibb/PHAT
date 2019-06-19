import {cssRule} from 'typestyle';

import {tableCell} from "./tableCell";
import { color } from 'csx';

cssRule("table",tableCell);

cssRule("td",tableCell);

cssRule("th",tableCell);

cssRule("body",{
    backgroundColor : `${color("#ffffff")}`
});
