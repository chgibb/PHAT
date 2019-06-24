export interface UniquelyAddressable
{
    uuid : string;
}

export function getReferenceFromUuid<T extends UniquelyAddressable>(
    arr : Array<T> | undefined,
    uuid : string | undefined
) : T | undefined {
    if(!arr)
        return undefined;
    if(!uuid)
        return undefined;

    for(let i = 0; i != arr.length; ++i)
    {
        if(arr[i].uuid == uuid)
            return arr[i];
    }

    return undefined;
}

export function getReferencesFromUuids<T extends UniquelyAddressable>(
    arr : Array<T> | undefined,
    uuids : Array<string> | undefined
) : Array<T> | undefined {
    if(!arr)
        return undefined;
    if(!uuids)
        return undefined;

    let res = new Array<T>();

    uuids.map((uuid) => {
        res.push(arr.find((el) => {
            return el.uuid == uuid
        }));
    });

    if(res.length)
        return res;
    return undefined;
}

export function getPropertiesOfReferencesFromUuids<T extends UniquelyAddressable,K extends keyof T>(
    arr : Array<T>,
    uuids : Array<string>,
    prop : K
) : Array<T[K]> | undefined {
    if(!arr)
        return undefined;
    if(!uuids)
        return undefined;
    if(!prop)
        return undefined;
        
    let res = new Array<T[K]>();

    uuids.map((uuid) => {
        res.push(arr.find((el) => {
            return el.uuid == uuid
        })[prop]);
    });

    if(res.length)
        return res;
    return undefined;
}
