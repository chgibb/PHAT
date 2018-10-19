const acorn = require("acorn");
const falafel = require("falafel");

import {getMangledSymbol,symbolExists} from "./mangleSymbols";

function mangleProp(propName : string,src : string) : string
{
    let regex = new RegExp(`\.(${propName})`,"");
    return src.replace(regex,`.${getMangledSymbol(propName)}`);
}

function mangleMethodDefinition(methodName : string,src : string) : string
{
    let regex = new RegExp(`\(${methodName})`,"");
    return src.replace(regex,`${getMangledSymbol(methodName)}`);
}

function mangleObjectExpressionKey(keyName : string,src : string) : string
{
    //{key :value}
    let regex = new RegExp(`\(${keyName}.:)`,"");
    if(regex.test(src))
        return src.replace(regex,`${getMangledSymbol(keyName)}:`);
    //{key:value}
    regex = new RegExp(`\(${keyName}:)`,"");
    return src.replace(regex,`${getMangledSymbol(keyName)}:`);
}

export function mangleSymbolsInFile(fileContents : string) : Promise<{res : string,num : number}>
{
    return new Promise<{res : string,num : number}>((resolve : (value : {res : string,num : number}) => void) => {
        let num = 0;
        let res = falafel(fileContents,{parser : acorn,sourceType : "module"},(node : any) => {
            if(node.type == "MemberExpression")
            {
                if(symbolExists(node.property.name))
                {
                    let src = mangleProp(node.property.name,node.parent.source())
                    node.update(mangleProp(node.property.name,node.source()));
                    num++;
                    //console.log(`${node.parent.source()} -> ${src}`);
                }
            }
    
            else if(node.type == "MethodDefinition")
            {
                if(symbolExists(node.key.name))
                {
                    let src = mangleMethodDefinition(node.key.name,node.parent.source());
                    node.update(mangleMethodDefinition(node.key.name,node.source()));
                    num++;
                    //console.log(`${node.parent.source()} -> ${src}`);
                }
            }

            else if(node.type == "ObjectExpression")
            {
                if(node.properties)
                {
                    for(let i = 0; i != node.properties.length; ++i)
                    {
                        if(symbolExists(node.properties[i].key.name))
                        {
                            node.update(mangleObjectExpressionKey(node.properties[i].key.name,node.source()));
                            num++;
                        }
                    }
                }
            }

            else if(node.type == "ExpressionStatement")
            {
                if(node.expression && node.expression.type == "CallExpression")
                {
                    if(node.expression.callee && node.expression.callee.type == "MemberExpression")
                    {
                        if(node.expression.callee.property.type == "Identifier" && node.expression.callee.property.name == "__decorate")
                        {
                            node.update("");
                        }

                    }
                }
            }
        });
        return resolve({res : res,num : num});
});
}