import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv16Ref from "./hpv16Ref";
let hpv16Figure : CircularFigure;

export function init() : void
{
    hpv16Figure = new CircularFigure(
        "HPV16 Figure",
        hpv16Ref.get().uuid,
        hpv16Ref.get().contigs
    );
}

export function get() : CircularFigure
{
    return hpv16Figure;
}

export function set(figure : CircularFigure) : void
{
    hpv16Figure = figure;
}