// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'build'
		}),
		// csp: {
		//     mode: 'auto',
		//     directives: {
		//         'script-src': [
		//             'self',
		//             'https://*.cisco.com',
		//             'http://cdn.appdynamics.com',
		//             '*.eum-appdynamics.com',
		//             'localhost:*'
		//         ],
		//         'child-src': [
		//             'self',
		//             'https://*.cisco.com',
		//             'https://www.youtube.com',
		//             'http://cdn.appdynamics.com'
		//         ],
		//         'style-src': [
		//             'self',
		//             'https://*.cisco.com',
		//             'unsafe-inline',
		//             'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
		//         ],
		//         'frame-src': ['self', 'https://*.cisco.com', 'https://www.youtube.com'],
		//         'object-src': ['none'],
		//         'manifest-src': ['self']
		//     }
		// },
		files: {
			assets: './static',
			serviceWorker: 'src/service-worker.js'
		},
		version: {
			name: '1.0.0',
			pollInterval: 3600
		},
		prerender: {
			concurrency: 2,
			crawl: true
		},
		serviceWorker: {
			register: false
		},
		env: {
			dir: '.',
			publicPrefix: 'PUBLIC_'
		}
	},
	vitePlugin: {
		experimental: {
			useVitePreprocess: true
		}
	}
};

export default config;
