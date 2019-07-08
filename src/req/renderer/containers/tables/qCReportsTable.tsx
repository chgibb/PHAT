import * as React from "react";

import {Fastq} from "../../../fastq";
import {Table} from "../../components/table";
import {getQCSummaryByName} from "../../../QCData";
import {AddBox} from "../../components/icons/addBox";
import {Search} from "../../components/icons/search";

export interface QCReportsTableProps
{
    shouldAllowTriggeringOps : boolean;
    onGenerateClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>,data : Fastq) => void;
    onViewReportClick : (event : React.MouseEvent<HTMLButtonElement, MouseEvent>,data : Fastq) => void;
    data : Array<Fastq>;
}

export function QCReportsTable(props : QCReportsTableProps) : JSX.Element
{
    return (
        <Table<Fastq>
            title="QC Reports"
            columns={[
                {
                    title : "Sample",
                    field : "alias",
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Per Base Sequence Quality",
                    field : "",
                    render : (row : Fastq) => 
                    {
                        return (
                            <p>{getQCSummaryByName(
                                row,
                                "Per base sequence quality"
                            )}</p>
                        );
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Per Sequence Quality Scores",
                    field : "",
                    render : (row : Fastq) => 
                    {
                        return (
                            <p>{getQCSummaryByName(
                                row,
                                "Per sequence quality scores"
                            )}</p>
                        );
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Per Sequence GC Content",
                    field : "",
                    render : (row : Fastq) => 
                    {
                        return (
                            <p>{getQCSummaryByName(
                                row,
                                "Per sequence GC content"
                            )}</p>
                        );
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Sequence Duplication Levels",
                    field : "",
                    render : (row : Fastq) => 
                    {
                        return (
                            <p>{getQCSummaryByName(
                                row,
                                "Sequence Duplication Levels"
                            )}</p>
                        );
                    },
                    searchable : true,
                    hidden : false
                },
                {
                    title : "Overrepresented Sequences",
                    field : "",
                    render : (row : Fastq) => 
                    {
                        return (
                            <p>{getQCSummaryByName(
                                row,
                                "Overrepresented sequences"
                            )}</p>
                        );
                    },
                    searchable : true,
                    hidden : false
                }
            ]}
            actions={[
                (row : Fastq) => ({
                    icon : AddBox as any,
                    tooltip : "Generate QC Report",
                    onClick : props.onGenerateClick,
                    disabled : !props.shouldAllowTriggeringOps || (row.QCData && row.QCData.reportRun)
                }),
                (row : Fastq) => ({
                    icon : Search as any,
                    tooltip : "View QC Report",
                    onClick : props.onViewReportClick,
                    disabled : (row.QCData && !row.QCData.reportRun)
                })
            ]}
            data={props.data}
        />
    );
}