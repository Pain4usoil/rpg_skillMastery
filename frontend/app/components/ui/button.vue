<script setup>
	defineProps({ disabled: Boolean });
</script>

<template>
	<button
		:disabled
		class="ui-button"
	>
		<slot />
	</button>
</template>

<style lang='scss' scoped>
	.ui-button
	{
		border: 1px solid $green;
		padding: 5px 20px;
		font-size: 16px;
		font-weight: medium;
		border-radius: 10px;
		background-color: $green30;

		@include tr(.3, background-color, opacity);

		&:hover { background-color: $green; }

		&:disabled
		{
			opacity: 0.5;
			pointer-events: none;
		}
	}
</style>