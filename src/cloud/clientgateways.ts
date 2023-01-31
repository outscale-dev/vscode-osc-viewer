
import * as osc from "outscale-api";
import { FiltersClientGateway } from "outscale-api";
import { getConfig, handleRejection } from '../cloud/cloud';
import { Profile } from "../flat/node";


// Retrieve all items of the resource ClientGateway
export function getClientGateways(profile: Profile, filters?: FiltersClientGateway): Promise<Array<osc.ClientGateway> | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadClientGatewaysOperationRequest = {
        readClientGatewaysRequest: {
            filters: filters
        }
    };

    const api = new osc.ClientGatewayApi(config);
    return api.readClientGateways(readParameters)
        .then((res: osc.ReadClientGatewaysResponse) => {
            if (res.clientGateways === undefined || res.clientGateways.length === 0) {
                return [];
            }
            return res.clientGateways;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Retrieve a specific item of the resource ClientGateway
export function getClientGateway(profile: Profile, resourceId: string): Promise<osc.ClientGateway | undefined | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadClientGatewaysOperationRequest = {
        readClientGatewaysRequest: {
            filters: {
                clientGatewayIds: [resourceId]
            }
        }
    };

    const api = new osc.ClientGatewayApi(config);
    return api.readClientGateways(readParameters)
        .then((res: osc.ReadClientGatewaysResponse) => {
            if (res.clientGateways === undefined || res.clientGateways.length === 0) {
                return undefined;
            }
            return res.clientGateways[0];
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Delete a specific item the resource ClientGateway
export function deleteClientGateway(profile: Profile, resourceId: string): Promise<string | undefined> {
    const config = getConfig(profile);
    const deleteParameters: osc.DeleteClientGatewayOperationRequest = {
        deleteClientGatewayRequest: {
            clientGatewayId: resourceId
        }
    };

    const api = new osc.ClientGatewayApi(config);
    return api.deleteClientGateway(deleteParameters)
        .then(() => {
            return undefined;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}