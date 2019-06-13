import * as React from "react";

import { Table } from "../components/table";
import { AlignData } from '../../alignData';
import { Fasta } from '../../fasta';

export interface CompatibleRefTableProps
{

}

export function CompatibleRefTable(props : CompatibleRefTableProps) : JSX.Element
{
    return (
        <Table<Fasta>

        />
    );
}