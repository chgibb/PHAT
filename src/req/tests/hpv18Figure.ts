import {CircularFigure} from "./../renderer/circularFigure";
import * as hpv18Ref from "./hpv18Ref";
let hpv18Figure : CircularFigure;

export function init() : void
{
    hpv18Figure = new CircularFigure(
        "hpv18 Figure",
        hpv18Ref.get().uuid,
        hpv18Ref.get().contigs
    );
}

export function get() : CircularFigure
{
    return hpv18Figure;
}

export function set(figure : CircularFigure) : void
{
    hpv18Figure = figure;
}