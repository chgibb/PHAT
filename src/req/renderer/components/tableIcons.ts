import * as React from "react";

import { Search } from './icons/search';
import { Icons } from 'material-table';
import { AddBox } from './icons/addBox';
import { Check } from './icons/check';
import { DeleteOutline } from './icons/deleteOutline';
import { ChevronRight } from './icons/chevronRight';
import { Edit } from './icons/edit';
import { SaveAlt } from './icons/saveAlt';
import { FilterList } from './icons/filterList';
import { FirstPage } from './icons/firstPage';
import { LastPage } from './icons/lastPage';
import { ChevronLeft } from './icons/chevronLeft';
import { ArrowUpward } from './icons/arrowUpward';
import { Remove } from './icons/remove';
import { ViewColumn } from './icons/viewColumn';
import { Clear } from './icons/clear';

export const tableIcons : Icons = {
    Add: AddBox as any,
    Check: Check as any,
    Clear: Clear as any,
    Delete: DeleteOutline as any,
    DetailPanel: ChevronRight as any,
    Edit: Edit as any,
    Export: SaveAlt as any,
    Filter: FilterList as any,
    FirstPage: FirstPage as any,
    LastPage: LastPage as any,
    NextPage: ChevronRight as any,
    PreviousPage: ChevronLeft as any,
    ResetSearch: Clear as any,
    Search: Search as any,
    SortArrow: ArrowUpward as any,
    ThirdStateCheck: Remove as any,
    ViewColumn: ViewColumn as any
};
