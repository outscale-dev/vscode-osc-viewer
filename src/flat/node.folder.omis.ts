import * as vscode from 'vscode';
import * as osc from "outscale-api";
import { ExplorerNode, ExplorerFolderNode, Profile } from './node';
import { FolderNode } from './node.folder';
import { ResourceNode } from './node.resources';
import { getOMIs } from '../cloud/omis';
import { getAccounts } from '../cloud/account';

export class OMIsFolderNode extends FolderNode implements ExplorerFolderNode {
    constructor(readonly profile: Profile) {
		super(profile, "OMIs");
    }

	getChildren(): Thenable<ExplorerNode[]> {
		return getAccounts(this.profile).then((account: Array<osc.Account> | string) => {
			if (typeof account === "string") {
				vscode.window.showInformationMessage(account);
				return Promise.resolve([]);
			}

			if (account.length === 0 || typeof account[0].accountId === 'undefined') {
				return Promise.resolve([]);
			}
			return getOMIs(this.profile, {accountIds: [account[0].accountId]}).then(result => {
				if (typeof result === "string") {
					vscode.window.showInformationMessage(result);
					return Promise.resolve([]);
				}
				let resources = [];
				for (const image of result) {
					if (typeof image.imageId === 'undefined' || typeof image.imageName === 'undefined') {
						continue;
					}
					resources.push(new ResourceNode(this.profile, image.imageName, image.imageId, "omis"));
				}
				return Promise.resolve(resources);
			});
		});
		
    }
}