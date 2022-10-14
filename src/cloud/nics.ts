
import * as osc from "outscale-api";
import { FiltersNic } from "outscale-api";
import { getConfig } from '../cloud/cloud';
import { Profile } from "../flat/node";


// Retrieve all items of the resource Nic
export function getNics(profile: Profile, filters?: FiltersNic): Promise<Array<osc.Nic> | string> {
    const config = getConfig(profile);
    const readParameters : osc.ReadNicsOperationRequest = {
        readNicsRequest: {
            filters: filters
        }
    };

    const api = new osc.NicApi(config);
    return api.readNics(readParameters)
    .then((res: osc.ReadNicsResponse | string) => {
        if (typeof res === "string") {
            return res;
        }
        if (res.nics === undefined || res.nics.length === 0) {
            return "Listing suceeded but it seems you have no Nic";
        }
        return res.nics;
    }, (err_: any) => {
        return err_;
    });
}

// Retrieve a specific item of the resource Nic
export function getNic(profile: Profile, resourceId: string): Promise<osc.Nic | string> {
    const config = getConfig(profile);
    const readParameters : osc.ReadNicsOperationRequest = {
        readNicsRequest: {
            filters: {
                nicIds: [resourceId]
            }
        }
    };

    const api = new osc.NicApi(config);
    return api.readNics(readParameters)
    .then((res: osc.ReadNicsResponse | string) => {
        if (typeof res === "string") {
            return res;
        }
        if (res.nics === undefined || res.nics.length === 0) {
            return "Listing suceeded but it seems you have no Nic";
        }
        return res.nics[0];
    }, (err_: any) => {
        return err_;
    });
}

// Delete a specific item the resource Nic
export function deleteNic(profile: Profile, resourceId: string): Promise<string | undefined> {
    const config = getConfig(profile);
    const deleteParameters : osc.DeleteNicOperationRequest = {
        deleteNicRequest: {
            nicId: resourceId
        }
    };

    const api = new osc.NicApi(config);
    return api.deleteNic(deleteParameters)
    .then((res: osc.DeleteNicResponse | string) => {
        if (typeof res === "string") {
            return res;
        }
        return undefined;
    }, (err_: any) => {
        return err_;
    });
}