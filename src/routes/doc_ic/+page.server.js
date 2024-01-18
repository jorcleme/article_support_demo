export async function load({ fetch }) {
	const response = await fetch('/api/article', { method: 'GET' });
	const { article } = await response.json();
	return { article };
}
