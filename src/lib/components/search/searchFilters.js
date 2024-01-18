import { get } from "svelte/store";
import { _ } from "svelte-i18n";

const SEGMENTED_NETWORKS = [
    'virtual local area network',
    'vlan',
    'vlans',
    'pvst',
    'per vlan spanning tree',
    "segmented networks",
    "segmented network",
    "segmented",
    "segment",
    "networks",
    "network",
    "spanning tree",
    "spanning",
    "tree",
    "stp",
    "rapid spanning tree",
];
const SECURITY = [
    'auth',
    'authentication',
    'password',
    'accounts',
    'radius',
    'active directory',
    'snmp',
    'security',
    'acl',
    'access control',
    'access control list'
];

const CLI = [
    'cli',
    'command-line',
    'command line',
    'command-line-interface',
    'command-line interface',
    'command line interface'
];

const TROUBLESHOOTING = [
    "troubleshooting",
    "troubleshoot",
    "troubleshoots",
    "failure",
    "failures",
    "fail",
    "fails",
    "error",
    "errors",
]

/**
 * @param {Array<String>} attributes
 * @returns an Array with keywords
 */
export default function searchFilter(attributes) {
    const message = get(_);
    const segmentedNetworksText = message('config_attributes_btn_1').toLowerCase();
    const securityText = message('config_attributes_btn_2').toLowerCase();
    const cliText = message('config_attributes_btn_3').toLowerCase();
    const troubleshootingText = message('config_attributes_btn_4').toLowerCase();
    console.log('attributes is', attributes);
    if (attributes.every((a) => a === '')) {
        attributes = attributes.concat(SEGMENTED_NETWORKS, SECURITY, CLI, TROUBLESHOOTING);
    }
    if (~attributes.findIndex((a) => a === segmentedNetworksText)) {
        console.log('Found Segmented Networks. Adding Segmented Networks attributes to filter');
        attributes = attributes.concat(SEGMENTED_NETWORKS);
    }
    if (~attributes.findIndex((a) => a === securityText)) {
        console.log('Found Security. Adding Security attributes to filter');
        attributes = attributes.concat(SECURITY);
    }
    if (~attributes.findIndex((a) => a === cliText)) {
        console.log('Found CLI. Adding CLI attributes to filter');
        attributes = attributes.concat(CLI);
    }
    if (~attributes.findIndex((a) => a === troubleshootingText)) {
        console.log('Found Troubleshooting. Adding Troubleshooting attributes to filter');
        attributes = attributes.concat(TROUBLESHOOTING);
    }

    return attributes;
}
