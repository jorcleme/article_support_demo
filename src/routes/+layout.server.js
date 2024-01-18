/** @type { import('./$types').LayoutServerLoad } */

export const load = async ({ fetch }) => {
    const req = await fetch('https://cdn.appdynamics.com/adrum/adrum-22.6.0.3859.js');
    const appDynamics = await req.text();
    return { appDynamics }
};