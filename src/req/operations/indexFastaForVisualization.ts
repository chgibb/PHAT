import * as atomic from "./atomicOperations";
import { Fasta, get2BitPath } from "./../fasta";
import { getContigsFromFastaFile } from "./../fastaContigLoader";
import { getPath } from "./../file";
import { getReadable, getReadableAndWritable } from "./../getAppPath";
import { Job } from "./../main/Job";
import { faToTwoBit } from "./indexFasta/faToTwoBit";

export interface IndexFastaForVisualizationData {
    operationName: "indexFastaForVisualization";
    data: Fasta;
}

export class IndexFastaForVisualization extends atomic.AtomicOperation<IndexFastaForVisualizationData>
{
    public fasta: Fasta;
    public faToTwoBitExe: string;

    public twoBitPath: string;
    public twoBitJob: Job | undefined;
    public twoBitFlags: atomic.CompletionFlags;
    constructor(data: IndexFastaForVisualizationData) {
        super(data);
        this.twoBitFlags = new atomic.CompletionFlags();

        this.faToTwoBitExe = getReadable("faToTwoBit");

        this.fasta = data.data;
        this.twoBitPath = get2BitPath(this.fasta);
        this.destinationArtifacts.push(this.twoBitPath);
    }

    public run(): void {
        this.logRecord = atomic.openLog(this.operationName, "Index Fasta for Visualization");

        let self = this;
        (async function () {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    self.progressMessage = "Building 2bit archive";
                    self.update!();
                    await faToTwoBit(self);
                    self.setSuccess(self.twoBitFlags);

                    self.progressMessage = "Reading contigs";
                    self.update!();

                    //don't reparse contigs if we don't have to
                    //contigs are parsed during viz indexing as well
                    //if we reparse, we will clobber contig uuids and all references which point to them
                    if (!self.fasta!.contigs || self.fasta!.contigs.length == 0) {
                        self.fasta!.contigs = await getContigsFromFastaFile(getPath(self.fasta!));
                    }
                    self.fasta!.indexedForVisualization = true;
                    self.setSuccess(self.flags);
                    self.update!();
                }
                catch (err) {
                    self.abortOperationWithMessage(err);
                }
            });
        })();
    }
}