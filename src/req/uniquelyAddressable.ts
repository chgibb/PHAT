export interface UniquelyAddressable
{
    uuid : string;
}

/**
 * Retrieve a single object reference from a collection of objects, given a unique handle
 *
 * @export
 * @template T
 * @param {(Array<T> | undefined)} arr
 * @param {(string | undefined)} uuid
 * @returns {(T | undefined)}
 */
export function getReferenceFromUuid<T extends UniquelyAddressable>(
    arr : Array<T> | undefined,
    uuid : string | undefined
) : T | undefined 
{
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


/**
 * Retrieve a collection of object references from a collection of objects given a collection of unique handles
 *
 * @export
 * @template T
 * @param {(Array<T> | undefined)} arr
 * @param {(Array<string> | undefined)} uuids
 * @returns {(Array<T> | undefined)}
 */
export function getReferencesFromUuids<T extends UniquelyAddressable>(
    arr : Array<T> | undefined,
    uuids : Array<string> | undefined
) : Array<T> | undefined 
{
    if(!arr)
        return undefined;
    if(!uuids)
        return undefined;

    let res = new Array<T>();

    uuids.map((uuid) => 
    {
        res.push(arr.find((el) => 
        {
            return el.uuid == uuid;
        }));
    });

    if(res.length)
        return res;
    return undefined;
}


/**
 * Retrive a collection of object properties from a collection of objects given a collection of their uniquq handles
 *
 * @export
 * @template T
 * @template K
 * @param {Array<T>} arr
 * @param {Array<string>} uuids
 * @param {K} prop
 * @returns {(Array<T[K]> | undefined)}
 */
export function getPropertiesOfReferencesFromUuids<T extends UniquelyAddressable,K extends keyof T>(
    arr : Array<T>,
    uuids : Array<string>,
    prop : K
) : Array<T[K]> | undefined 
{
    if(!arr)
        return undefined;
    if(!uuids)
        return undefined;
    if(!prop)
        return undefined;
        
    let res = new Array<T[K]>();

    uuids.map((uuid) => 
    {
        res.push(arr.find((el) => 
        {
            return el.uuid == uuid;
        })[prop]);
    });

    if(res.length)
        return res;
    return undefined;
}
