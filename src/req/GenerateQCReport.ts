import * as atomic from "./atomicOperations";
import Fastq from "./renderer/fastq";
export class GenerateQCReport extends atomic.AtomicOperation
{
	public generatedArtifacts : Array<string>;
	public destinationArtifacts : Array<string>;
	public fastq : Fastq;
	public data : string;
	constructor()
	{
		super();
		this.generatedArtifacts = new Array<string>();
		this.destinationArtifacts = new Array<string>();

	}
	public getGeneratedArtifacts() : Array<string>
	{
		return this.generatedArtifacts;
	}
	public setGeneratedArtifacts(artifacts : Array<string>) : void
	{
		this.generatedArtifacts = artifacts;
	}
	public getDestinationArtifacts() : Array<string>
	{
		return this.destinationArtifacts;
	}
	public setDestinationArtifacts(artifacts : Array<string>) : void
	{
		this.destinationArtifacts = artifacts
	}
	public setData(data : string) : void
	{
		this.data = data;
	}
	public run() : void
	{
		console.log(this.data);
	}
}