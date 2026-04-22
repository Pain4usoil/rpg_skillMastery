<script setup>
	const { common } = useApi();

	const loginData = ref({
		login    : '',
		password : ''
	})
	const isLoading = ref(false);

	const login = async () =>
	{
		isLoading.value = true;

		try
		{
			const response = await common.login(loginData.value);

			if (response?.message)
				navigateTo('/success-auth');
		}
		catch (err) { console.error(err); }
		finally { isLoading.value = false; }
	};
</script>

<template>
	<div class="login-page">
		<div class="login">
			<div class="title">Авторизация</div>
			<div class="inputs">
				<UiInput
					placeholder="Введите логин"
					v-model="loginData.login"
					@keydown.enter="login"
				/>
				<UiInput
					type="password"
					placeholder="Введите пароль"
					v-model="loginData.password"
					@keydown.enter="login"
				/>
			</div>
			<UiButton
				class="login-button"
				:disabled="isLoading"
				@click="login"
			>
				Войти
			</UiButton>
			<div class="login-links-wr">
				<NuxtLink to="/">Регистрация</NuxtLink>
				<NuxtLink to="/">Забыл пароль</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang='scss' scoped>
	.login-page
	{
		min-height: calc(100vh - 40px);

		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.login
	{
		width: 100%;
		padding: 40px 20px;
		border-radius: 30px;
		border: 1px solid $green;
		background-color: rgba(black, 0.1);

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title
	{
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}

	.inputs
	{
		row-gap: 10px;
		margin-bottom: 20px;

		display: flex;
		flex-direction: column;
		align-items: center;

		.ui-input { max-width: 150px; }
	}

	.login-button
	{
		margin-bottom: 20px;
		text-transform: uppercase;
	}

	.login-links-wr
	{
		column-gap: 20px;
		max-width: 200px;

		display: flex;
		justify-content: space-between;

		a
		{
			color: $white25;
			font-size: 12px;

			flex-grow: 1;

			@include tr(.3, color);

			&:hover { color: $white; }
		}
	}
</style>