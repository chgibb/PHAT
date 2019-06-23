export function reOrder<T>(list : Array<T>, startIndex : number, endIndex : number) : Array<T>
{
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}
  