<script>
	export let size = '2.5em';
	export let color = '#0d274d';
</script>

<div class="lds-ripple" style="--size: {size}; --color: {color}">
	<div></div>
	<div></div>
</div>

<style>
	.lds-ripple {
		display: inline-block;
		position: relative;
		width: 2rem;
		height: calc(var(--size) * 2);
	}
	.lds-ripple div {
		position: absolute;
		border: calc(var(--size) * 0.16) solid var(--color);
		opacity: 1;
		border-radius: 50%;
		animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}
	.lds-ripple div:nth-child(2) {
		animation-delay: -0.5s;
	}
	@keyframes lds-ripple {
		0% {
			top: calc(var(--size) * 0.5);
			left: calc(var(--size) * 0.5);
			width: 0;
			height: 0;
			opacity: 1;
		}
		100% {
			top: calc(var(--size) * -0.5);
			left: calc(var(--size) * -0.5);
			width: calc(var(--size) * 2);
			height: calc(var(--size) * 2);
			opacity: 0;
		}
	}
</style>
