import { getReadable } from '../../../getAppPath';

export const tabInfo : {
    [index : string] : {
        refName : string;
        imgURI : () => string;
    }
} = {
    "Input": {
        refName : "input",
        imgURI : () => getReadable("img/input.png"),
    },
    "QC": {
        refName : "QC",
        imgURI : () => getReadable("img/qc.png"),
    },
    "Align": {
        refName : "align",
        imgURI : () => getReadable("img/align.png"),
    },
    "Output": {
        refName : "Output",
        imgURI : () => getReadable("img/output.png"),
    },
    "Genome Builder": {
        refName : "circularGenomeBuilder",
        imgURI : () => getReadable("img/genomeBuilder.png"),
    }
};
