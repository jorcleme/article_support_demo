export default function stripHTML(text) {
	return text
		.replace(/<[^>]*>?/gm, '')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<');
}
