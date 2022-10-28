
import * as osc from "outscale-api";
import { getConfig } from '../cloud/cloud';
import { Profile } from "../flat/node";


export function getAccounts(profile: Profile): Promise<Array<osc.Account> | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadAccountsOperationRequest = {
        readAccountsRequest: {}
    };

    const api = new osc.AccountApi(config);
    return api.readAccounts(readParameters)
        .then((res: osc.ReadAccountsResponse | string) => {
            if (typeof res === "string") {
                return res;
            }
            if (res.accounts === undefined || res.accounts.length === 0) {
                return "Listing suceeded but it seems you have no Keypairs";
            }
            return res.accounts;
        }, (err_: any) => {
            return err_;
        });
}

export function getAccount(profile: Profile, _: string): Promise<osc.Account | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadAccountsOperationRequest = {
        readAccountsRequest: {}
    };

    const api = new osc.AccountApi(config);
    return api.readAccounts(readParameters)
        .then((res: osc.ReadAccountsResponse | string) => {
            if (typeof res === "string") {
                return res;
            }
            if (res.accounts === undefined || res.accounts.length === 0) {
                return "Listing suceeded but it seems you have no Keypairs";
            }
            return res.accounts[0];
        }, (err_: any) => {
            return err_;
        });
}
