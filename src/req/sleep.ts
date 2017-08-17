
export function sleep(seconds : number) : void
{
	let stop = new Date(new Date().getTime() + seconds * 1000);
	while(stop > new Date()){}
}
