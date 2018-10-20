import * as ts from "typescript";

export type SymbolType = "ClassProperty" | "ClassMethod";

export interface MangledSymbol
{
    symbol : string;
    mangled : string;
    type : SymbolType;
    fileName : string
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

export function addSymbolWithMangleableLinkage(symbol : string,type : SymbolType,fileName : string) : void
{
    let exists = symbolWithMangleableLinkageExists(symbol,type);
    
    if(exists)
    {
        if(exists.fileName != fileName)
            throw new Error(`Symbol "${symbol}" (${type}) was declared in ${exists.fileName} cannot redefine in ${fileName}`);
        else
            return;
    }

    else
    {
        symbolsToMangle.push({symbol : symbol,type : type,mangled : getNextMangledSymbol(),fileName : fileName});
    }
}

export function symbolWithMangleableLinkageExists(symbol : string,type : SymbolType) : MangledSymbol | undefined
{
    for(let i = 0; i != symbolsToMangle.length; ++i)
    {
        if(symbolsToMangle[i].symbol == symbol && symbolsToMangle[i].type == type)
        {
            return symbolsToMangle[i]
        }
    }
    return undefined;
}

export function getSymbolWithMangleableLinkage(symbol : string,type : SymbolType) : string
{
    for(let i = 0; i != symbolsToMangle.length; ++i)
    {
        if(symbolsToMangle[i].symbol == symbol && symbolsToMangle[i].type == type)
        {
            return symbolsToMangle[i].mangled;
        }
    }
    return "";
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
                                        let type : SymbolType;
                                        if((node as any).members[i].kind == ts.SyntaxKind.PropertyDeclaration)
                                            type = "ClassProperty";
                                        else if((node as any).members[i].kind == ts.SyntaxKind.MethodDeclaration)
                                            type = "ClassMethod";

                                            
                                        addSymbolWithMangleableLinkage((node as any).members[i].name.escapedText,type,sourceFile.fileName);
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