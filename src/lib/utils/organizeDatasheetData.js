/** @param {String} str */
const getFirstPrefix = (str) => str.split('-')[0];

/** @param {String} str */
const getSecondPrefix = (str) => str.split('-')[1];

/** @param {String} str */
const getThirdPrefix = (str) => str.split('-')[2];

/** @param {String} str */
const getLastPrefix = (str) => {
    const arr = str.split('-');
    return arr[arr.length - 1];
};

const parseSimilarSeriesDownlinks = (model, similarSeries) => {
    const similar = {};
    const downlinks = getSecondPrefix(model).match(/\d+/g)[0];
    const features = getSecondPrefix(model).match(/[A-Z]+$/g)[0];

    for (const key in similarSeries) {
        const numOfTargetDownlinks = getSecondPrefix(key).match(/\d+/g)[0];
        const featuresTargetDownlinks = getSecondPrefix(key).match(/[A-Z]+$/gi)[0];

        if (`${downlinks}${features}` === `${numOfTargetDownlinks}${featuresTargetDownlinks}`) {
            similar['portCount'] = parseInt(numOfTargetDownlinks);
            similar['portOption'] = featuresTargetDownlinks;
            similar['portSpeed'] = '10/100/1000';
            break;
        }
    }
    return similar;
};

const parseSimilarSeriesUplinks = (model, similarSeries) => {
    const similar = {};
    const activeModel = getLastPrefix(model);
    const uplinks = activeModel.match(/\d+/g)[0] ?? getLastPrefix(model).match(/^\d+/g)[0];
    const features = activeModel.match(/[A-Za-z]+$/g)[0];

    const similarModelKeysOnly = Object.keys(similarSeries).filter((key) => {
        return key.startsWith(key.match(/C1000|C1300/));
    });
    console.log('from parseSimilarSeriesUplinks similarModelKeys are: ', similarModelKeysOnly);
    for (const key of similarModelKeysOnly) {
        let similarModel = getLastPrefix(key);
        if (!/\d/.test(similarModel)) {
            similarModel = getThirdPrefix(key);
        }
        console.log('similarModel is: ', similarModel);
        const numOfTargetUplinks = similarModel.match(/^\d+/g) || [0];
        const featuresTargetUplinks = similarModel.match(/[A-Z]+$/gi);

        if (`${uplinks}${features}` === `${numOfTargetUplinks[0]}${featuresTargetUplinks[0]}`) {
            let portSpeeds = similarSeries[key]['uplink_ports'].match(/^\d+ (.)+/g);
            if (portSpeeds[0].includes('SFP+')) {
                portSpeeds[0] = '10 Gigabit';
            } else {
                portSpeeds[0] = '1 Gigabit';
            }
            similar['portCount'] = parseInt(numOfTargetUplinks[0]);
            similar['portOption'] = featuresTargetUplinks[0];
            similar['portSpeed'] = portSpeeds[0];
            break;
        }
    }
    // for (const key in similarSeries) {
    //     if (Object.hasOwn(similarSeries, key)) {
    //         const targetModel = getLastPrefix(key);
    //         const numOfTargetUplinks = targetModel.match(/^\d+/g) || [0];
    //         const featuresTargetUplinks = targetModel.match(/[A-Z]+$/gi);
    //         console.log('targetModel: ', targetModel);
    //         console.log(
    //             'numOfTargetUplinks',
    //             numOfTargetUplinks + '\n' + 'featuresTargetUplinks: ' + featuresTargetUplinks
    //         );

    //         if (`${uplinks}${features}` === `${numOfTargetUplinks[0]}${featuresTargetUplinks[0]}`) {
    //             let portSpeeds = similarSeries[key]['uplink_ports'].match(/^\d+ (.)+/g);
    //             if (portSpeeds[0].includes('SFP+')) {
    //                 portSpeeds[0] = '10 Gigabit';
    //             } else {
    //                 portSpeeds[0] = '1 Gigabit';
    //             }
    //             similar['portCount'] = parseInt(numOfTargetUplinks);
    //             similar['portOption'] = featuresTargetUplinks;
    //             similar['portSpeed'] = portSpeeds[0];
    //             break;
    //         }
    //     }
    // }
    return similar;
};

const parseActiveModelDownlinks = (model) => {
    const prefix = getSecondPrefix(model);
    const downlinks = prefix.match(/^\d+/g)[0];
    const features = prefix.match(/[A-Z]+$/gi)[0];

    return {
        portCount: parseInt(downlinks),
        portOption: features,
        portSpeed: '10/100/1000'
    };
};

const parseActiveModelUplinks = (model, obj) => {
    let prefix = getLastPrefix(model);
    let uplinks = prefix.match(/^\d+/g)[0];
    let features;
    let speeds = obj['uplink_ports'].match(/^\d+ (.)+/g);

    if (speeds[0].includes('SFP+')) {
        speeds[0] = '10 Gigabit';
    } else {
        speeds[0] = '1 Gigabit';
    }
    if (!uplinks) {
        prefix = getThirdPrefix(model);
        uplinks = prefix.match(/^\d+/g)[0];
        features = prefix.match(/[A-Z]+$/gi)[0];
    }

    if (speeds[0] === '10 Gigabit') {
        features = 'SFP+';
    } else {
        features = 'G';
    }

    return {
        portCount: parseInt(uplinks),
        portOption: features,
        portSpeed: speeds[0]
    };
};

const parseSimilarModelDownlinks = (model, key, obj) => {
    const activeModel = parseActiveModelDownlinks(model);
    // const modelKeys = Object.keys(datasheet).filter((key) => key.startsWith(getFirstPrefix(model)));

    const similarModel = {};

    const downlinks = parseInt(obj['rj-45_ports'].match(/^\d+/g)[0]);
    const features = getSecondPrefix(key).match(/[A-Z]+$/g)[0];

    if (downlinks === activeModel['portCount']) {
        similarModel['portCount'] = parseInt(downlinks);
        similarModel['portOption'] = features;
        similarModel['portSpeed'] = '10/100/1000';
    }

    return similarModel;
};

const parseSimilarModelUplinks = (model, key, obj) => {
    const activeModel = parseActiveModelUplinks(model, obj);
    console.log('activeModel Stats: ', activeModel);
    let similarModel = {};

    const prefix = getLastPrefix(key);
    const uplinks = parseInt(prefix.match(/^\d+/g)[0]);

    if (uplinks === activeModel['portCount']) {
        similarModel = parseActiveModelUplinks(key, obj);
    }
    console.log('similarModel Stats: ', similarModel);
    return similarModel;
};

/**
 *
 * @param {Record<keyof any, any>} data - The Datasheet Data
 * @param {string} model - The active App model
 * @param {"downlink"|"uplink"} componentType - Either "downlink" || "uplink"
 * @returns An array of organized data resolving to modelsMap, modelKeyInstances, genericsMap, optionsInclude
 */
export function transformData({ datasheet, model, componentType, similarSeries }) {
    const modelKeysOnly = Object.keys(datasheet).filter((key) =>
        key.startsWith(getFirstPrefix(model))
    );

    console.log('model Keys Only: ', modelKeysOnly);
    const genericKeysOnly = Object.keys(datasheet).filter(
        (key) => !key.startsWith(getFirstPrefix(model))
    );
    const targetDownlinks = getSecondPrefix(model).match(/\d+/g)[0];
    const targetUplinks = getLastPrefix(model).match(/^\d+/g)[0];
    const generics = {};
    const models = {};

    let similarModelUI;
    let similarModelDownlinkFound = false;
    let similarModelUplinkFound = false;
    let similarSeriesUI;
    let activeModelUI;

    for (const key of modelKeysOnly) {
        models[key] = datasheet[key];

        if (/downlink/.test(componentType)) {
            activeModelUI = parseActiveModelDownlinks(model);
            similarSeriesUI = parseSimilarSeriesDownlinks(model, similarSeries);
            const numOfModelDownlinks = getSecondPrefix(key).match(/\d+/g)[0];
            if (!similarModelDownlinkFound && targetDownlinks === numOfModelDownlinks) {
                similarModelUI = parseSimilarModelDownlinks(model, key, datasheet[key]);
                similarModelDownlinkFound = true;
            }
        }

        if (/uplink/.test(componentType)) {
            activeModelUI = parseActiveModelUplinks(model, datasheet[model]);
            similarSeriesUI = parseSimilarSeriesUplinks(model, similarSeries);
            const numOfModelUplinks = getLastPrefix(key).match(/\d+/g) || [0];
            if (!similarModelUplinkFound && targetUplinks === numOfModelUplinks[0]) {
                similarModelUI = parseSimilarModelUplinks(model, key, datasheet[key]);
                similarModelUplinkFound = true;
            }
        }
    }

    for (const key of genericKeysOnly) {
        generics[key] = datasheet[key];
    }

    const [modelsMap, modelKeyInstances, genericsMap] = organizeData([models, generics]);

    return [
        modelsMap,
        modelKeyInstances,
        genericsMap,
        activeModelUI,
        similarSeriesUI,
        similarModelUI
    ];
}

function captializePropsForUI(word) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}

/**
 *
 * @param {Array<{}>} arr
 */
function organizeData(arr) {
    const [models, generics] = arr;

    const modelsMap = Object.entries(models).map(([model, obj]) => {
        const ret = {};
        for (let key of Object.keys(obj)) {
            // const matches = obj[key].match(/\d+(?=\s\d+\/)/g)
            // console.log(matches)
            const value = obj[key];
            if (key === 'rj-45_ports') {
                key = 'Downlink Ports';
                ret[key] = value;
            } else if (/(poe)/gi.test(key)) {
                key = key.replace(/(poe)/gi, 'PoE');
                key = key.split('_').map(captializePropsForUI).join(' ');
                ret[key] = value;
            } else {
                key = key.split('_').map(captializePropsForUI).join(' ');
                ret[key] = value;
            }
        }
        return [model, ret];
    });

    const modelKeyInstances = modelsMap.reduce((acc, curr) => {
        for (const key of Object.keys(curr[1])) {
            if (key in acc) {
                acc[key] += 1;
            } else {
                acc[key] = 1;
            }
        }
        return acc;
    }, {});
    const genericsMap = Object.entries(generics).map(([key, value]) => {
        let refineKey = key.split('_').map(captializePropsForUI).join(' ');

        if (refineKey.includes('Mac')) {
            refineKey = refineKey.replace(/(Mac)/g, 'MAC');
        }

        if (refineKey.includes('Vlan')) {
            refineKey = refineKey.replace(/(Vlan)|(Vlans)/g, 'VLAN');
        }
        if (refineKey.includes('Leds')) {
            refineKey = refineKey.replace(/(Leds)/g, 'LEDs');
        }
        if (refineKey.includes('Poe')) {
            refineKey = refineKey.replace(/(Poe)/g, 'PoE');
        }
        if (refineKey.includes('Acls')) {
            refineKey = refineKey.replace(/(Acls)/g, 'ACLs');
        }
        if (refineKey.includes('Acl')) {
            refineKey = refineKey.replace(/(Acl)/g, 'ACL');
        }
        if (refineKey.includes('Ieee')) {
            refineKey = refineKey.replace(/(Ieee)/g, 'IEEE');
        }
        if (refineKey.includes('Igmp')) {
            refineKey = refineKey.replace(/(Igmp)/g, 'IGMP');
        }
        if (refineKey.includes('Ipv6')) {
            refineKey = refineKey.replace(/(Ipv6)/g, 'IPv6');
        }
        if (refineKey.includes('Qos')) {
            refineKey = refineKey.replace(/(Qos)/g, 'QOS');
        }
        if (refineKey.includes('Snmp')) {
            refineKey = refineKey.replace(/(Snmp)/g, 'SNMP');
        }
        if (refineKey.includes('Cpu')) {
            refineKey = refineKey.replace(/(Cpu)/g, 'CPU');
        }
        if (refineKey.includes('Ipv4')) {
            refineKey = refineKey.replace(/(Ipv4)/g, 'IPv4');
        }
        if (refineKey.includes('Lldp-med')) {
            refineKey = refineKey.replace(/(Lldp-med)/g, 'LLDP-MED');
        }
        if (refineKey.includes('Qinq')) {
            refineKey = refineKey.replace(/(Qinq)/g, 'QinQ');
        }
        return [refineKey, value];
    });

    return [modelsMap, modelKeyInstances, genericsMap];
}
