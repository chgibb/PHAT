export interface UniquelyAddressable
{
    uuid : string;
}

export function getReferenceFromUuid<T extends UniquelyAddressable>(arr : Array<T>,uuid : string) : T | undefined
{
    for(let i = 0; i != arr.length; ++i)
    {
        if(arr[i].uuid == uuid)
            return arr[i];
    }

    return undefined;
}
