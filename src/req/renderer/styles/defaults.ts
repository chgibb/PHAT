import {cssRule} from 'typestyle';

import {tableCell} from "./tableCell";

cssRule("table",tableCell);

cssRule("td",tableCell,{padding : "5px"});

cssRule("th",tableCell,{padding : "5px"});
