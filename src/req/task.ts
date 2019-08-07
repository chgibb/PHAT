import * as fs from "fs";

export abstract class Task<I,M>
{
    public dependsOn? : Array<Task<any,any>>;
    public results? : Array<Task<any,any>>;
    public abstract name : string;
    public abstract execStrings : Array<string>;
    public input : I;
    public modifiers : M;

    public constructor(inputs : I, modifiers : M,dependsOn? : Array<Task<any,any>>)
    {
        this.dependsOn = dependsOn;
        this.input = inputs;
        this.modifiers = modifiers;
    }

    public abstract artifacts() : Array<string>;
    public abstract run(onStdout? : () => string,onStdErr? : () => string) : Promise<boolean>;

    public execute() : Promise<boolean>
    {
        return new Promise<boolean>(async (resolve : (value : boolean) => void) => 
        {
            if(!this.results || (this.results && missingResults(this.results)))
            {
                if(missingArtifacts(this))
                {
                    if(this.dependsOn)
                    {
                        for(let i = 0; i != this.dependsOn.length; ++i)
                        {
                            await this.dependsOn[i].execute();
                        }
                    }

                    if(this.results)
                    {
                        for(let i = 0; i != this.results.length; ++i)
                        {
                            await this.results[i].execute();
                        }
                    }
            
                    for(let i = 0; i != this.execStrings.length; ++i)
                    {
                        console.log(this.execStrings[i]);
                    }

                    await this.run();
                }
            }
            resolve(missingArtifacts(this));
        });
    }
}

export function missingResults(arr : Array<Task<any,any>>) : boolean
{
    for(let i = 0; i != arr.length; ++i)
    {
        if(missingArtifacts(arr[i]))
            return true;
    }
    return false;
}

export function missingArtifacts(task : Task<any,any>) : boolean
{
    let artifacts = task.artifacts();
    if(artifacts.length == 0)
        return true;

    for(let i = 0; i != artifacts.length; ++i)
    {
        if(!fs.existsSync(artifacts[i]))
        {
            return true;
        }
    }

    return false;
}
