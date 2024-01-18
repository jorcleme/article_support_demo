<script>
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	const units = [
		{ unit: 'years', symbol: 'Y' },
		{ unit: 'months', symbol: 'M' },
		{ unit: 'weeks', symbol: 'W' },
		{ unit: 'days', symbol: 'D' },
		{ unit: 'hours', symbol: 'H' },
		{ unit: 'minutes', symbol: 'M' },
		{ unit: 'seconds', symbol: 'S' }
	];

	const executor = (name, unit) => `((?<${name}>-?\\d*[\\.,]?\\d+)${unit})?`;

	const regex = new RegExp(
		[
			'(?<negative>-)?P',
			executor('years', 'Y'),
			executor('months', 'M'),
			executor('weeks', 'W'),
			executor('days', 'D'),
			'(T',
			executor('hours', 'H'),
			executor('minutes', 'M'),
			executor('seconds', 'S'),
			')?' // end optional time
		].join('')
	);

	function parseNum(str) {
		if (str === '' || str === undefined || str === null) {
			return undefined;
		}
		return parseFloat(str.replace(',', '.'));
	}

	function parse(str) {
		const match = regex.exec(str);
		if (!match || !match.groups) {
			// Set a default here if the original string cannot be parsed. Still need to implement
			return str;
		}
		let isEmpty = true;
		const values = Object.create(null);
		for (const { unit } of units) {
			if (match.groups[unit]) {
				isEmpty = false;
				values[unit] = parseNum(match.groups[unit]);
			}
		}

		if (isEmpty) return;
		const duration = values;
		if (match.groups.negative) {
			duration.negative = true;
		}
		return duration;
	}

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	export let media;
	$: time = parse(media.duration);
</script>

<div class="video-card">
	<div class="video-wrapper">
		<iframe
			loading="lazy"
			class="vid-card-iframe"
			src={media.embed_url}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
	</div>

	<div class="video-card-details">
		<div>
			<h3 class="video-card-title">{media.title}</h3>
		</div>
		<div class="vid-meta-details">
			<div class="stopwatch">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g id="icon_time" clip-path="url(#clip0_1663_855)">
						<path
							id="Vector"
							d="M19.5556 9.77778C19.5556 7.84392 18.9821 5.95349 17.9077 4.34554C16.8333 2.73759 15.3062 1.48435 13.5196 0.744294C11.7329 0.00423715 9.76693 -0.189396 7.87023 0.187881C5.97353 0.565159 4.2313 1.4964 2.86385 2.86385C1.4964 4.2313 0.565159 5.97353 0.187881 7.87023C-0.189396 9.76693 0.00423715 11.7329 0.744294 13.5196C1.48435 15.3062 2.73759 16.8333 4.34554 17.9077C5.95349 18.9821 7.84392 19.5556 9.77778 19.5556C12.3701 19.5526 14.8554 18.5215 16.6884 16.6884C18.5215 14.8554 19.5526 12.3701 19.5556 9.77778ZM0.875626 9.77778C0.875626 8.0171 1.39773 6.29596 2.37591 4.83201C3.35409 3.36806 4.74442 2.22705 6.37107 1.55326C7.99773 0.879479 9.78766 0.703187 11.5145 1.04668C13.2414 1.39017 14.8276 2.23802 16.0726 3.48301C17.3175 4.728 18.1654 6.31421 18.5089 8.04106C18.8524 9.7679 18.6761 11.5578 18.0023 13.1845C17.3285 14.8111 16.1875 16.2015 14.7236 17.1797C13.2596 18.1578 11.5385 18.6799 9.77778 18.6799C7.41761 18.6772 5.15489 17.7385 3.48599 16.0696C1.8171 14.4007 0.878332 12.1379 0.875626 9.77778Z"
							fill="#495057"
						/>
						<path
							id="Vector_2"
							d="M12.4447 11.8165L9.89921 9.58041V2.66602H8.88916V9.7641C8.8892 9.88175 8.94242 9.99457 9.03712 10.0778L11.7306 12.4438L12.4447 11.8165Z"
							fill="#495057"
						/>
					</g>
					<defs>
						<clipPath id="clip0_1663_855">
							<rect width="20" height="20" fill="white" />
						</clipPath>
					</defs>
				</svg>
			</div>
			<p style="padding-left:1em;color: var(--font-gray);margin:0;">
				{`${time.minutes}:${
					'seconds' in time
						? time.seconds.toString().length === 1
							? '0' + time.seconds
							: time.seconds
						: '00'
				}`}
			</p>
		</div>
	</div>
</div>

<style>
	.stopwatch svg {
		display: inline-block;
		vertical-align: middle;
	}
	.vid-meta-details {
		display: flex;
		align-items: center;
		padding: 0;
		font-size: var(--font-size-sm);
	}

	.video-wrapper {
		position: relative;
		padding-top: 56.25%;
		overflow: hidden;
	}

	.video-card {
		width: clamp(200px, 310px, 400px);
		background-color: var(--white);
		display: inline-block;
		position: relative;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--btn-gray-1);
		transition: all 0.5s ease-in-out;
		scroll-snap-align: start;
		min-height: 320px;
		cursor: pointer;
	}
	.vid-card-iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 168px; */
		height: 100%;
	}

	.video-card-title {
		padding: 0;
		color: var(--cisco-dark-blue);
		margin: 0;
		font-weight: 700;
	}

	.video-card-details {
		display: grid;
		grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
		grid-auto-flow: row;
		padding: 0.8em;
	}

	/* Hover section */
	.video-card:hover {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
		transition: all 0.5s ease-in-out;
	}
</style>
