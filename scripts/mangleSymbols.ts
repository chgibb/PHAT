import * as ts from "typescript";

export interface MangledSymbol
{
    symbol : string;
    mangled : string;
}

export let symbolsToMangle = new Array<MangledSymbol>();

//adapted from https://github.com/mishoo/UglifyJS/blob/master/lib/process.js
export function getNextMangledSymbol()
{
    let num = symbolsToMangle.length;
    //let digits = "etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984";
    let digits = "abcdefghijklmnopqrstuvqwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$0516372984"
    let res = "";

    do
    {
        res += digits.charAt(num % 54);
        num = Math.floor(num / 54);

    }
    while(num > 0)
    return res;
}

export function symbolExists(symbol : string) : boolean
{
    for(let i = 0; i != symbolsToMangle.length; ++i)
    {
        if(symbolsToMangle[i].symbol == symbol)
            return true;
    }
    return false;
}

export function getMangledSymbol(symbol : string) : string
{
    for(let i = 0; i != symbolsToMangle.length; ++i)
    {
        if(symbolsToMangle[i].symbol == symbol)
        {
            return symbolsToMangle[i].mangled;
        }
    }
    return "";
}

export function mangleProp(propName : string,src : string) : string
{
    let regex = new RegExp(`\.(${propName})`,"");
    return src.replace(regex,`.${getMangledSymbol(propName)}`);
}

export function mangleMethodDefinition(methodName : string,src : string) : string
{
    let regex = new RegExp(`\(${methodName})`,"");
    return src.replace(regex,`${getMangledSymbol(methodName)}`);
}

export function buildSymbolList(sourceFile : ts.SourceFile) : Promise<number>
{
    let found = 0;
    return new Promise<number>((resolve : (value : number) => void) => {
        ts.forEachChild(sourceFile,(node : ts.Node) => {
            switch(node.kind)
            {
                case ts.SyntaxKind.ClassDeclaration:
                    for(let i = 0; i != (node as any).members.length; ++i)
                    {
                        if((node as any).members[i].kind == ts.SyntaxKind.PropertyDeclaration || (node as any).members[i].kind == ts.SyntaxKind.MethodDeclaration)
                        {
                            if((node as any).members[i].decorators)
                            {
                                for(let k = 0; k != (node as any).members[i].decorators.length; ++k)
                                {
                                    if((node as any).members[i].decorators[k].expression.escapedText == "Mangle")
                                    {
                                        if(!symbolExists((node as any).members[i].name.escapedText))
                                        {
                                            found++;
                                            symbolsToMangle.push({symbol : (node as any).members[i].name.escapedText,mangled : getNextMangledSymbol()});
                                        }
                                    }
                                }
                            }
                        }
                    }
                break;
            }
        });
        return resolve(found);
    });
}