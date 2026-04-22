<script setup>
	defineProps(
		{
			type:
			{
				type: String,
				default: 'text'
			},
			placeholder: String
		}
	);

	const model = defineModel('');
</script>

<template>
	<input
		class="ui-input"
		:type
		:placeholder
		v-model="model"
	/>
</template>

<style lang='scss' scoped>
	.ui-input
	{
		text-align: center;
		border-bottom: 1px solid $white50;

		@include tr(.3, border-color);

		&::placeholder { text-align: center; }
		&:focus { border-color: $white; }
	}
</style>