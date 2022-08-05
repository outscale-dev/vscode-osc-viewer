import * as vscode from 'vscode';
import { getLoadBalancers } from '../cloud/loadbalancer';
import { ExplorerNode, ExplorerFolderNode, Profile } from './node';
import { FolderNode } from './node.folder';
import { ResourceNode } from './node.resources';

export class LoadBalancerFolderNode extends FolderNode implements ExplorerFolderNode {
    constructor(readonly profile: Profile) {
		super(profile, "LoadBalancers");
    }

	getChildren(): Thenable<ExplorerNode[]> {
		return getLoadBalancers(this.profile).then(result => {
			if (typeof result === "string") {
				vscode.window.showInformationMessage(result);
				return Promise.resolve([]);
			}
			let resources = [];
			for (const lb of result) {
                if (typeof lb.loadBalancerName === 'undefined') {
                    continue;
                }
                resources.push(new ResourceNode(this.profile, "", lb.loadBalancerName, "loadbalancers"));
			}
			return Promise.resolve(resources);
		});
		
    }
}