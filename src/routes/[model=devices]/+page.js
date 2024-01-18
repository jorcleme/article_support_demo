import { redirect } from '@sveltejs/kit';

/** @type {import ('./$types').PageLoad} */

export async function load({ params }) {
	throw redirect(302, `/${params.model}/jump-to-all`);
}
