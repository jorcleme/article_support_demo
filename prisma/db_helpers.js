// Create a helper function that takes a string like this "16 x Gigabit Ethernet" and returns the number of ports. The number of ports will always be the first numbers in the string
/**
 *
 * @param {String} str
 * @returns
 */
export const getNumDownlinkPorts = (str) => {
    // const numPorts = str.match(/\b\d+\b(?!G)/g);
    const numPorts = str.match(/\b(\d+)\b/);
    if (numPorts !== null) {
        const ports = numPorts[1];
        return +ports;
    } else {
        return 0;
    }
};

/**
 *
 * @param {string} str
 * @returns the sum of the parsed strings
 */
export const getNumUplinkPorts = (str) => {
    // const regex = /\b(\d+)\b/g;
    // let sum = 0;
    // let match;

    // while ((match = regex.exec(str)) !== null) {
    //     console.log(match);
    //     const numberOfPorts = parseInt(match[1]);
    //     sum += numberOfPorts;
    // }
    // return sum;
    const regex = /^\d+/g;
    let match = str.match(regex);
    if (match) {
        return +match[0];
    } else {
        return 0;
    }
    // const strngsplit = str.split(/combo +/).map((str) => str.replace(/^\+/, '').trim());
    // console.log(strngsplit);
    // const numberUplinks = strngsplit
    //     .map((str) => str.match(/^\d+/g)[0])
    //     .map(Number)
    //     .reduce((acc, curr) => acc + curr, 0);
    // console.log(numberUplinks);
    // return numberUplinks;
};

// Create a helper function that takes a string like "4 x SFP+" or like "2 SFP/ RJ-45 combo". If there is a plus sign at the end of SFP, return true, else return false
/**
 *
 * @param {String} str
 * @returns
 */
export const getPlugType = (str) => {
    const regex = /\bSFP\+\b/;
    const secondRegex = /(SFP\+)/;
    return regex.test(str) || secondRegex.test(str);
};


/**
 *
 * @param {string} str
 * @returns The downlink port speed
 */
export const getDownlinkPortSpeed = (str) => {
    return str.includes('10G')
        ? '10G'
        : str.includes('5G')
        ? '5G'
        : str.includes('2.5G')
        ? '2.5G'
        : '1G';
};

export const getUplinkPortSpeed = (str) => {
    return str.includes('SFP+') ? '10G' : str.includes('10G') ? '10G' : '1G';
};


// A helper function to replace newlines, tabs, and multiple spaces with a single space
/**
 *
 * @param {string} str
 * @returns string
 */
export const replaceWhiteSpace = (str) => {
    const regex = /([\n\t])|(\.\s+)/g;
    const result = str.replace(regex, (match, newline, periodSpace) => {
        if (newline) {
            return ' ';
        } else if (periodSpace) {
            return periodSpace;
        } else {
            return match;
        }
    });
    return result;
};
