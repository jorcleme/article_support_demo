import DatasheetJSON from '$lib/data/datasheets.json';

export async function getDatasheet(model) {
    const series = normalizeSeries(model.split('-')[0]);
    const datasheet = DatasheetJSON[series];
    const data = Object.assign({}, datasheet);
    // Hard Coded for Demo Purposes
    /*
			The best way is to create relationships within our DB. We can do a 1:1 relationship
			based on some column header (whatever field we decide to name this relationship).

			If we wanted to perform this action without the DB, we can probably just create a dict, map or array
		*/
    const similarSeries = Object.assign({}, DatasheetJSON['Cisco Catalyst 1300 Series Switches']);
    return { datasheet: data, similarSeries };
}

function normalizeSeries(seriesPrefix) {
    switch (seriesPrefix) {
        case 'C1200':
            return 'Cisco Catalyst 1200 Series Switches';
        case 'C1300':
            return 'Cisco Catalyst 1300 Series Switches';
        default:
            return 'Cisco Catalyst 1200 Series Switches';
    }
}
