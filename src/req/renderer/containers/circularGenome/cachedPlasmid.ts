import { Plasmid } from '../../../ngplasmid/lib/plasmid';
import { CircularFigure, buildBaseFigureTemplate, assembleCompilableTemplates, assembleCompilableCoverageTrack, makeMapScope } from '../../circularFigure/circularFigure';
import { Node, loadFromString } from '../../../ngplasmid/lib/html';

export interface CachedPlasmid {
    uuid: string;
    plasmid: Plasmid | undefined;
    oldStrScope: string;
}

export class PlasmidCacheMgr {
    protected plasmidCache: Array<CachedPlasmid> = [];

    public prunePlasmidCache(figure: CircularFigure): void {

        for (let i = this.plasmidCache.length - 1; i >= 0; --i) {
            let found = false;
            for (let k = 0; k != figure.visibleLayers.length; ++k) {
                if (figure.visibleLayers[k] == this.plasmidCache[i].uuid) {
                    found = true;
                }
            }

            if (!found) {
                this.plasmidCache.splice(i, 1);
            }
        }
    }


    public findPlasmidInCache(target: string, figure: CircularFigure): CachedPlasmid | undefined {
        return this.plasmidCache.find((x) => x.uuid == target);

    }

    public setOldScope(target: string, figure: CircularFigure): void {

        let entry = this.plasmidCache.find((x) => x.uuid == target);

        if (entry) {
            entry.oldStrScope = JSON.stringify(makeMapScope(figure));
        }

    }

    public async  loadPlasmidCacheEntry(target: string, figure: CircularFigure): Promise<CachedPlasmid | undefined> {
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
            let plasmid = await this.maybeLoadPlasmid(target, figure);

            if (plasmid) {
                this.plasmidCache = [
                    ...this.plasmidCache,
                    {
                        uuid: target,
                        plasmid: plasmid,
                        oldStrScope: oldStrScope
                    }
                ];

                return { uuid: target, plasmid: plasmid, oldStrScope: oldStrScope };
            }
            return undefined;
        }
        return undefined;
    }

    protected async  maybeLoadPlasmid(target: string, figure: CircularFigure): Promise<Plasmid | undefined> {
        let scope = { genome: figure };

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

                            setTimeout(() => {
                                let cacheEntry = this.plasmidCache.find((x) => x.uuid == target);
                                if (cacheEntry) {
                                    cacheEntry.plasmid = undefined;
                                    console.log("Unloaded ", target);
                                }
                            }, 5000);

                            console.log("Loaded ", target);
                            return plasmid;
                        }
                    }
                }
            }
        }
        return undefined;
    }
}

