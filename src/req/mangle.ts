/**
 * Mark a symbol as being mangleable. All reference to this symbol will be mangled in the output JS.
 * The mangling is not type safe and no deeper analysis is performed. May therefore break unrelated code.
 *
 * @export
 * @param {*} target
 * @param {*} [key]
 * @returns
 */
export function Mangle(target : any,key? : any)
{
    return target;
}