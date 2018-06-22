/// <reference path="./../../node_modules/@chgibb/unmappedcigarfragments/lib/lib" />
import {SAMRead} from "@chgibb/unmappedcigarfragments/lib/lib";

import {ReadWithFragments} from "./readWithFragments";

function replaceAll(target : string,search : RegExp,replace : string) : string
{
    return target.replace(search,replace);
}

/**
 * Transforms JSON-invalid identifiers in BLAST XML given in xml into JSON-valid identifiers.
 * 
 * @export
 * @param {string} xml 
 * @returns {string} 
 */
export function cleanBLASTXML(xml : string) : string
{
    let res = xml;

    res = replaceAll(res,new RegExp("BlastOutput_query-ID","g"),"BlastOutput_query_ID");
    res = replaceAll(res,new RegExp("BlastOutput_query-def","g"),"BlastOutput_query_def");
    res = replaceAll(res,new RegExp("BlastOutput_query-len","g"),"BlastOutput_query_len");

    res = replaceAll(res,new RegExp("Parameters_sc-match","g"),"Parameters_sc_match");
    res = replaceAll(res,new RegExp("Parameters_sc-mismatch","g"),"Parameters_sc_mismatch");
    res = replaceAll(res,new RegExp("Parameters_gap-open","g"),"Parameters_gap_open");
    res = replaceAll(res,new RegExp("Parameters_gap-extend","g"),"Parameters_gap_extend");

    res = replaceAll(res,new RegExp("Iteration_iter-num","g"),"Iteration_iter_num");
    res = replaceAll(res,new RegExp("Iteration_query-ID","g"),"Iteration_query_ID");
    res = replaceAll(res,new RegExp("Iteration_query-def","g"),"Iteration_query_def");
    res = replaceAll(res,new RegExp("Iteration_query-len","g"),"Iteration_query_len");

    res = replaceAll(res,new RegExp("Hsp_bit-score","g"),"Hsp_bit_score");
    res = replaceAll(res,new RegExp("Hsp_query-from","g"),"Hsp_query_from");
    res = replaceAll(res,new RegExp("Hsp_query-to","g"),"Hsp_query_to");
    res = replaceAll(res,new RegExp("Hsp_hit-from","g"),"Hsp_hit_from");
    res = replaceAll(res,new RegExp("Hsp_hit-to","g"),"Hsp_hit_to");
    res = replaceAll(res,new RegExp("Hsp_query-frame","g"),"Hsp_query_frame");
    res = replaceAll(res,new RegExp("Hsp_hit-frame","g"),"Hsp_hit_frame");
    res = replaceAll(res,new RegExp("Hsp_align-len","g"),"Hsp_align_len");

    res = replaceAll(res,new RegExp("Statistics_db-num","g"),"Statistics_db_num");
    res = replaceAll(res,new RegExp("Statistics_db-len","g"),"Statistics_db_len");
    res = replaceAll(res,new RegExp("Statistics_hsp-len","g"),"Statistics_hsp_len");
    res = replaceAll(res,new RegExp("Statistics_eff-space","g"),"Statistics_eff_space");

    return res;
}

/**
 * The expected shape of BLAST XML response transformed to JSON
 * 
 * @export
 * @interface BlastOutputRawJSON
 */
export interface BLASTOutputRawJSON
{
    noHits : boolean;
    BlastOutput : {
        BlastOutput_program : Array<string>;
        BlastOutput_version : Array<string>;
        BlastOutput_reference : Array<string>;
        BlastOutput_db : Array<string>;
        BlastOutput_query_ID : Array<string>;
        BlastOutput_query_def : Array<string>;
        BlastOutput_query_len : Array<string>;
        BlastOutput_param : Array<{
            Parameters : Array<{
                Parameters_expect : Array<string>;
                Parameters_sc_match : Array<string>;
                Parameters_sc_mismatch : Array<string>;
                Parameters_gap_open : Array<string>;
                Parameters_gap_extend : Array<string>;
                Parameters_filter : Array<string>;
            }>;
        }>;
        BlastOutput_iterations : Array<{
            Iteration : Array<{
                Iteration_iter_num : Array<string>;
                Iteration_query_ID : Array<string>;
                Iteration_query_def : Array<string>;
                Iteration_query_len : Array<string>;
                Iteration_hits : Array<{
                    Hit : Array<{
                        Hit_num : Array<string>;
                        Hit_id : Array<string>;
                        Hit_def : Array<string>;
                        Hit_accession : Array<string>;
                        Hit_len : Array<string>;
                        Hit_hsps : Array<{
                            Hsp : Array<{
                                Hsp_num : Array<string>;
                                Hsp_bit_score : Array<string>;
                                Hsp_score : Array<string>;
                                Hsp_evalue : Array<string>;
                                Hsp_query_from : Array<string>;
                                Hsp_query_to : Array<string>;
                                Hsp_hit_from : Array<string>;
                                Hsp_hit_to : Array<string>;
                                Hsp_query_frame : Array<string>;
                                Hsp_hit_frame : Array<string>;
                                Hsp_identity : Array<string>;
                                Hsp_positive : Array<string>;
                                Hsp_gaps : Array<string>;
                                Hsp_align_len : Array<string>;
                                Hsp_qseq : Array<string>;
                                Hsp_hseq : Array<string>;
                                Hsp_midline : Array<string>;
                            }>;
                        }>;
                    }>;
                }>;
                Iteration_stat : Array<{
                    Statistics : Array<{
                        Statistics_db_num : Array<string>;
                        Statistics_db_len : Array<string>;
                        Statistics_hsp_len : Array<string>;
                        Statistics_eff_space : Array<string>;
                        Statistics_kappa : Array<string>;
                        Statistics_lambda : Array<string>;
                        Statistics_entropy : Array<string>;
                    }>;
                }>;
            }>;
        }>;
    }
};

function throwOnUndefined(obj : any) : void
{
    if(obj === undefined)
        throw new Error("");
    if(Array.isArray(obj))
    {
        for(let i = 0; i != obj.length; ++i)
        {
            if(obj[i] === undefined)
                throw new Error("");
            else if(Array.isArray(obj[i]))
            {
                throwOnUndefined(obj[i]);
            }
        }
    }
}

/**
 * Validate the given BLAST output. Returns true if valid, false otherwise.
 * 
 * @export
 * @param {BLASTOutputRawJSON} obj 
 * @returns {boolean} 
 */
export function validateRawBlastOutput(obj : BLASTOutputRawJSON) : boolean
{
    try
    {
        throwOnUndefined(obj);
        throwOnUndefined(obj.BlastOutput);
        throwOnUndefined(obj.BlastOutput.BlastOutput_program);
        throwOnUndefined(obj.BlastOutput.BlastOutput_version);
        throwOnUndefined(obj.BlastOutput.BlastOutput_reference);
        throwOnUndefined(obj.BlastOutput.BlastOutput_db);
        throwOnUndefined(obj.BlastOutput.BlastOutput_query_ID);
        throwOnUndefined(obj.BlastOutput.BlastOutput_query_def);
        throwOnUndefined(obj.BlastOutput.BlastOutput_query_len);
        throwOnUndefined(obj.BlastOutput.BlastOutput_param);
        throwOnUndefined(obj.BlastOutput.BlastOutput_iterations);
    }
    catch(err)
    {
        return false;
    }
    return true;
}