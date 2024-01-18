/**
 *
 * @param {{ currentModel: string, devices: Array<{}>}} param0
 */
export default function parseData({ currentModel, devices }) {
    console.log('current model is: ', currentModel);
    console.log('current devices to parse are: ', devices);

    const activeModel = devices.find((device) => device.pid === currentModel);
    const activeModelFeatures = Object.assign({}, activeModel);
    let comparableDeviceFound = false;
    let comparableDevice;

    for (const device of devices) {
        if (device.pid === currentModel) {
            continue;
        }
        if (device.Switch.downlink_ports === activeModelFeatures.Switch.downlink_ports) {
            if (activeModelFeatures.Switch.poe_support === device.Switch.poe_support) {
                const { pid } = device;
                const pidFeatures = pid.split('-')[1].match(/[A-Z]/gi)[0];
                comparableDeviceFound = true;
                comparableDevice = Object.assign({}, device, {
                    portCount: device.Switch.downlink_ports,
                    portSpeed: '10/100/1000',
                    portOption: pidFeatures
                });
            }
            console.log(comparableDevice);
        }
        if (comparableDeviceFound) {
            break;
        }
    }
}
