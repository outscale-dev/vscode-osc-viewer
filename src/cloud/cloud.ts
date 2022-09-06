import * as osc from "outscale-api";
import * as vscode from 'vscode';
import * as fetch from "cross-fetch";
import * as crypto from "crypto";
import { Profile } from "../flat/node";

global.Headers = fetch.Headers;
global.crypto = crypto.webcrypto;

function getVersion(): string {
    const extensionContext = vscode.extensions.getExtension('outscale.osc-viewer');
    if (typeof extensionContext === "undefined") {
        return "dev";
    }
    return extensionContext.packageJSON.version;
}

function getUserAgent(): string {
    return "vscode-osc-viewer/" + getVersion();
}

export function getConfig(profile: Profile): osc.Configuration {
    const protocol = ((profile.https) ? 'https' : 'http');
    return new osc.Configuration({
        basePath: protocol + "://api." + profile.region + "." +  profile.host + "/api/v1",
        awsV4SignParameters: {
            accessKeyId: profile.accessKey,
            secretAccessKey: profile.secretKey,
            service: "api",
            region: profile.region,
        },
        fetchApi: fetch.default,
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "User-Agent": getUserAgent()
        },
    });
}

export function getCloudUnauthenticatedConfig(): osc.Configuration {
    const region = "eu-west-2";
    return new osc.Configuration({
        basePath: "https://api." + region + ".outscale.com/api/v1",
        fetchApi: fetch.default,
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "User-Agent": getUserAgent()
        },
    });
}

