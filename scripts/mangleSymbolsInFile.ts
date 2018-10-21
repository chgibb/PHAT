const acorn = require("acorn");
const falafel = require("falafel");

import {symbolWithMangleableLinkageExists,getSymbolWithMangleableLinkage} from "./mangleSymbols";

function mangleProp(propName : string,src : string) : string
{
    let regex = new RegExp(`\.(${propName})`,"");
    return src.replace(regex,`.${getSymbolWithMangleableLinkage(propName,"ClassProperty")}`);
}

function mangleMethodDefinition(methodName : string,src : string) : string
{
    let regex = new RegExp(`\(${methodName})`,"");
    return src.replace(regex,`${getSymbolWithMangleableLinkage(methodName,"ClassMethod")}`);
}

function mangleObjectExpressionKey(keyName : string,src : string) : string
{
    //{key :value}
    let regex = new RegExp(`\(${keyName}.:)`,"");
    if(regex.test(src))
        return src.replace(regex,`${getSymbolWithMangleableLinkage(keyName,"ClassProperty")}:`);
    //{key:value}
    regex = new RegExp(`\(${keyName}:)`,"");
    return src.replace(regex,`${getSymbolWithMangleableLinkage(keyName,"ClassProperty")}:`);
}

export function mangleSymbolsInFile(fileContents : string) : Promise<{res : string,num : number}>
{
    return new Promise<{res : string,num : number}>((resolve : (value : {res : string,num : number}) => void) => {
        let num = 0;
        let res = falafel(fileContents,{parser : acorn,sourceType : "module"},(node : any) => {
            if(node.type == "MemberExpression")
            {
                if(symbolWithMangleableLinkageExists(node.property.name,"ClassProperty"))
                {
                    let src = mangleProp(node.property.name,node.parent.source())
                    node.update(mangleProp(node.property.name,node.source()));
                    num++;
                    //console.log(`${node.parent.source()} -> ${src}`);
                }
            }
    
            else if(node.type == "MethodDefinition")
            {
                if(symbolWithMangleableLinkageExists(node.key.name,"ClassMethod"))
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
                        if(symbolWithMangleableLinkageExists(node.properties[i].key.name,"ClassProperty"))
                        {
                            node.update(mangleObjectExpressionKey(node.properties[i].key.name,node.source()));
                            num++;
                        }
                    }
                }
            }

            else if(node.type == "CallExpression")
            {
                if(node.callee && node.callee.type == "MemberExpression")
                {
                    if(symbolWithMangleableLinkageExists(node.callee.property.name,"ClassMethod"))
                    {
                        node.update(mangleMethodDefinition(node.callee.property.name,node.source()));
                        num++;
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