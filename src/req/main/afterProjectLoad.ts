let queue : Array<() => void> = new Array<() => void>();

export function add(func : () => void) : void
{
    queue.push(func);
}

export function run() : void
{
    for(let i = 0; i != queue.length; ++i)
    {
        queue[i]();
    }
}
