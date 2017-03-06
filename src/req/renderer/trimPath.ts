export default function trimPath(str : string) : string
{
	let rev : string = "";
	let res : string = "";
	for(let i : number = str.length - 1; i >= 0; --i)
	{
		if(str[i] != "\\" && str[i] != "/")
			rev += str[i];
		if(str[i] == "\\" || str[i] == "/")
			break;
	}
	for(let i : number = rev.length - 1; i >= 0; --i)
	{
		res += rev[i];
	}
	return res;
}