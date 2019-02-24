import {style} from "typestyle";

import {bgColour,borderColour} from "./colours";
import { NestedCSSProperties } from 'typestyle/lib/types';

export const tableCell : NestedCSSProperties = {
    border : `1px solid ${borderColour}`,
    backgroundColor : `${bgColour}`,
    borderCollapse : "collapse"
};
