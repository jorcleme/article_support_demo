export function normalizeSeries(seriesPrefix) {
    switch (seriesPrefix) {
        case /SF200/.test(seriesPrefix) || /SG200/.test(seriesPrefix):
            return 'Cisco Small Business 200 Series Smart Switches';
        case /SF220/.test(seriesPrefix) || /SG220[A-Za-z]*/i.test(seriesPrefix):
            return 'Cisco 220 Series Smart Switches';
        case /SF250/.test(seriesPrefix) || /SG250[A-Za-z]*/i.test(seriesPrefix):
            return 'Cisco 250 Series Smart Switches';
        case /SF30(\d)+/.test(seriesPrefix) || /SG300/.test(seriesPrefix):
            return 'Cisco 300 Series Managed Switches';
        case /CBS110/.test(seriesPrefix):
            return 'Cisco Business 110 Series Unmanaged Switches';
        case /CBS220/.test(seriesPrefix):
            return 'Cisco Business 220 Series Smart Switches';
        case /CBS250/.test(seriesPrefix):
            return 'Cisco Business 250 Series Smart Switches';
        case /CBS350/.test(seriesPrefix):
            return 'Cisco Business 350 Series Managed Switches';
        case /C1000/.test(seriesPrefix):
            return 'Cisco Catalyst 1000 Series Switches';
        case 'C1200':
            return 'Cisco Catalyst 1200 Series Switches';
        case 'C1300':
            return 'Cisco Catalyst 1300 Series Switches';
        default:
            return 'Cisco Catalyst 1000 Series Switches';
    }
}
