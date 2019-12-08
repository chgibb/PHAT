import * as React from "react";

import {Contig} from "../circularFigure/circularFigure";
import {TreeItem} from "../components/treeItem";

export interface ContigTreeProps {
    contigs: Array<Contig>;
    label: string;
    onClick: (contig: Contig) => void;
    children? : JSX.Element;
}

export function ContigTree(props: ContigTreeProps): JSX.Element 
{
    return (
        
        <TreeItem nodeId={props.label} label={props.label}>
            {
                props.contigs.length ? props.contigs.map((contig,i) => 
                {
                    return (
                        <TreeItem
                            nodeId={`${props.label}-${i}`}
                            label={contig.name}
                            onClick={() => 
                            {
                                props.onClick(contig);
                            }}
                        />
                    );
                }) : <TreeItem nodeId="-1" />
            }
            {
                props.children ? props.children : <TreeItem nodeId="-1" />
            }
        </TreeItem>
    );
}
