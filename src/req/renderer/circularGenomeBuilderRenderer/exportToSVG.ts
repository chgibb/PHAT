import * as fs from "fs";
import {GenomeView} from "./genomeView";
export async function writeSVG(self : GenomeView,fileName : string,svg : string) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        (async function() : Promise<void>{
            return new Promise<void>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
                        fs.writeFileSync(fileName,svg);
                        resolve();
                    });
                });
            });
        })().then(() => {
            resolve();
        });
    });
}

export async function serializeFigure(self : GenomeView) : Promise<string>
{
    return new Promise<string>((resolve,reject) => {
        (async function() : Promise<string>{
            return new Promise<string>((resolve,reject) => {
                setImmediate(function(){
                    setImmediate(function(){
                        resolve(
                            new XMLSerializer().serializeToString(
                                document.getElementById(self.div)
                            )
                        );
                    });
                });
            });
        })().then((svg : string) => {
            resolve(svg);
        });
    });
}

export async function renderSVG(self : GenomeView) : Promise<void>
{
    return new Promise<void>((resolve,reject) => {
        (async function() : Promise<void>{
            setImmediate(function(){
                setImmediate(function(){
                    
                });
            });
        })().then(() => {
            resolve();
        });
    });
}