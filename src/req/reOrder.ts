/**
 * Move the item at startIndex to endIndex
 *
 * @export
 * @template T
 * @param {Array<T>} list - Collection to operate on
 * @param {number} startIndex - Index of object to move
 * @param {number} endIndex - Index to move object to
 * @returns {Array<T>}
 */
export function reOrder<T>(list : Array<T>, startIndex : number, endIndex : number) : Array<T>
{
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
}
  