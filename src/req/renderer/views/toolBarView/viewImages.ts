import { getReadable } from '../../../getAppPath';

export const viewImages : {
    [index : string] : () => string;
} = {
    "Input": () => getReadable("img/input.png"),
    "QC": () => getReadable("img/qc.png"),
    "Align": () => getReadable("img/align.png"),
    "Output": () => getReadable("img/output.png"),
    "Genome Builder": () => getReadable("img/genomeBuilder.png"),
};
