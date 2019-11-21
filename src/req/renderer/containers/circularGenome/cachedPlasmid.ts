import { Plasmid } from '../../../ngplasmid/lib/plasmid';
import { CircularFigure, buildBaseFigureTemplate, assembleCompilableTemplates, assembleCompilableCoverageTrack } from '../../circularFigure/circularFigure';
import { Node, loadFromString } from '../../../ngplasmid/lib/html';

export interface CachedPlasmid {
    uuid: string;
    plasmid: Plasmid | undefined;
    oldStrScope: string;
}

let plasmidCaches: { [index: string]: Array<CachedPlasmid> } = {};

export function prunePlasmidCache(figure: CircularFigure): void {
    let cache = plasmidCaches[figure.uuid];
    if (cache) {
        for (let i = cache.length - 1; i >= 0; --i) {
            let found = false;
            for (let k = 0; k != figure.visibleLayers.length; ++k) {
                if (figure.visibleLayers[k] == cache[i].uuid) {
                    found = true;
                }
            }

            if (!found) {
                cache.splice(i, 1);
            }
        }
    }
    else {
        plasmidCaches[figure.uuid] = [];
    }
}

export function findPlasmidInCache(target: string, figure: CircularFigure): CachedPlasmid | undefined {
    if (plasmidCaches[figure.uuid]) {
        return plasmidCaches[figure.uuid].find((x) => x.uuid == target);
    }

    else {
        plasmidCaches[figure.uuid] = [];
        return undefined;
    }
}

export async function loadPlasmid(target: string, figure: CircularFigure): Promise<CachedPlasmid | undefined> {

    if (plasmidCaches[figure.uuid]) {
        let scope = { genome: figure };

        let oldStrScope = JSON.stringify(scope);
        if (target == figure.uuid) {
            console.log("Loading base figure");
            console.log(figure.name);

            let plasmid: Plasmid = new Plasmid();
            plasmid.$scope = scope;

            let nodes: Array<Node> = await loadFromString(
                assembleCompilableTemplates(figure,
                    buildBaseFigureTemplate(figure)
                )
            );

            for (let i = 0; i != nodes.length; ++i) {
                if (nodes[i].name == "div") {
                    for (let k = 0; k != nodes[i].children.length; ++k) {
                        if (nodes[i].children[k].name == "plasmid") {
                            plasmid.fromNode(nodes[i].children[k]);
                            return {
                                uuid: figure.uuid,
                                plasmid: plasmid,
                                oldStrScope: oldStrScope
                            };
                        }
                    }
                }
            }
        }

        else {
            let coverageTrack = figure.renderedCoverageTracks.find((x) => x.uuid == target);
            if (coverageTrack) {
                let plasmid: Plasmid = new Plasmid();
                plasmid.$scope = scope;

                let nodes: Array<Node> = await loadFromString(assembleCompilableCoverageTrack(figure, coverageTrack));

                for (let i = 0; i != nodes.length; ++i) {
                    if (nodes[i].name == "div") {
                        for (let k = 0; k != nodes[i].children.length; ++k) {
                            if (nodes[i].children[k].name == "plasmid") {
                                plasmid.fromNode(nodes[i].children[k]);
                                plasmidCaches[figure.uuid] = [
                                    ...plasmidCaches[figure.uuid],
                                    {
                                        uuid: target,
                                        plasmid: plasmid,
                                        oldStrScope: oldStrScope
                                    }
                                ];

                                return { uuid: target, plasmid: plasmid, oldStrScope: oldStrScope };
                            }
                        }
                    }
                }
            }
        }
    }
    plasmidCaches[figure.uuid] = [];
    return undefined;
}