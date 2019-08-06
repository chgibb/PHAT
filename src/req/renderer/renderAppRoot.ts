import {render} from "react-dom";

export function renderAppRoot(component : () => JSX.Element,div : HTMLDivElement) : void
{
    render(component(),div);
}
