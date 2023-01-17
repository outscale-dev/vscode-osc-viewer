import * as osc from "outscale-api";
import * as vscode from 'vscode';
import { deleteSecurityGroup, getSecurityGroup, removeRule, ruleToString } from "../../cloud/securitygroups";
import { Profile } from '../node';
import { ResourceNode } from './node.resources';
import { SubResourceNode } from "./types/node.resources.subresource";


export class SecurityGroupResourceNode extends ResourceNode implements SubResourceNode {

    constructor(readonly profile: Profile, readonly resourceName: string, readonly resourceId: string) {
        super(profile, resourceName, resourceId, "securitygroups", deleteSecurityGroup);
    }

    getContextValue(): string {
        return "securitygroupresourcenode;subresourcenode";
    }

    async removeSubresource(): Promise<string | undefined> {
        const sg = await getSecurityGroup(this.profile, this.resourceId);
        if (typeof sg === "string") {
            return sg;
        }

        // Ask inbound or outbound rules
        const pickItems: any[] = [];
        if (typeof sg.inboundRules !== 'undefined' && sg.inboundRules.length > 0) {
            pickItems.push({
                label: "Inbound",
                description: '',
                item: sg.inboundRules
            });
        }

        if (typeof sg.outboundRules !== 'undefined' && sg.outboundRules.length > 0) {
            pickItems.push({
                label: "Outbound",
                description: '',
                item: sg.outboundRules
            });
        }

        let rules: osc.SecurityGroupRule[];
        let flow: string;
        if (pickItems.length > 1) {
            const value = await vscode.window.showQuickPick(pickItems, { title: "Choose the rule category to remove" });
            if (!value) {
                return Promise.resolve("Deletion of security group rules cancelled");
            }
            rules = value.item;
            flow = value.label;
        } else {
            rules = pickItems[0].item;
            flow = pickItems[0].label;
        }

        let rule: osc.SecurityGroupRule;
        if (rules.length > 1) {
            const pickItems = rules.map((element) => {
                return {
                    label: `${ruleToString(flow, element)}`,
                    description: '',
                    item: element
                };
            });

            const value = await vscode.window.showQuickPick(pickItems);

            if (!value) {
                return Promise.resolve("Deletion of rule cancelled");
            }
            rule = value.item;
        } else {
            rule = rules[0];
        }

        if (typeof rule === "undefined") {
            return Promise.resolve("The rule is undefined");
        }

        return removeRule(this.profile, this.resourceId, flow, rule);
    }



}