import { Plasmid } from '../../../ngplasmid/lib/plasmid';
import { CircularFigure, buildBaseFigureTemplate, assembleCompilableTemplates, assembleCompilableCoverageTrack } from '../../circularFigure/circularFigure';
import {Node, loadFromString } from '../../../ngplasmid/lib/html';

export interface CachedPlasmid
{
    uuid : string;
    plasmid : Plasmid
}

let plasmidCache = new Array<CachedPlasmid>();

export async function loadPlasmid(target : string,figure : CircularFigure) : Promise<CachedPlasmid| undefined>
    {
        let scope = {genome : figure};
        if(target == figure.uuid)
        {
            console.log("Loading base figure");
            console.log(figure.name);
            
            let plasmid : Plasmid = new Plasmid();
            plasmid.$scope = scope;

            let nodes : Array<Node> = await loadFromString(
                assembleCompilableTemplates(figure,
                    buildBaseFigureTemplate(figure)
                )
            );

            for(let i = 0; i != nodes.length; ++i)
            {
                if(nodes[i].name == "div")
                {
                    for(let k = 0; k != nodes[i].children.length; ++k)
                    {
                        if(nodes[i].children[k].name == "plasmid")
                        {
                            plasmid.fromNode(nodes[i].children[k]);
                            return {
                                uuid : figure.uuid,
                                plasmid : plasmid
                            };
                        }
                    }
                }
            }
        }

        else
        {
            let coverageTrack = figure.renderedCoverageTracks.find((x) => x.uuid == target);
            if(coverageTrack)
            {
                let plasmid : Plasmid = new Plasmid();
                plasmid.$scope = scope;

                let nodes : Array<Node> = await loadFromString(assembleCompilableCoverageTrack(figure,coverageTrack));

                for(let i = 0; i != nodes.length; ++i)
                {
                    if(nodes[i].name == "div")
                    {
                        for(let k = 0; k != nodes[i].children.length; ++k)
                        {
                            if(nodes[i].children[k].name == "plasmid")
                            {
                                plasmid.fromNode(nodes[i].children[k]);
                                plasmidCache = [
                                    ...plasmidCache,
                                    {
                                        uuid : target,
                                        plasmid : plasmid
                                    }
                                ];

                                return {uuid:target,plasmid:plasmid};
                            }
                        }
                    }
                }
            }
        }

        return undefined;
    }