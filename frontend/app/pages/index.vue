<script setup>
	const { common } = useApi();

	const registrationData = ref(
		{
			login           : '',
			password        : '',
			confirmPassword : ''
		}
	);

	const isLoading = ref(false);

	const register = async () =>
	{
		isLoading.value = true;

		try
		{
			const response = await common.registration(registrationData.value);

			if (response?.message)
				navigateTo('/auth');
		}
		catch (err) { console.error(err) }
		finally { isLoading.value = false; }
	}
</script>

<template>
	<div class="registration-page">
		<div class="registration">
			<div class="title">Регистрация</div>
			<div class="inputs">
				<UiInput
					placeholder="Введите логин"
					v-model="registrationData.login"
					@keydown.enter="register"
				/>
				<UiInput
					type="password"
					placeholder="Введите пароль"
					v-model="registrationData.password"
					@keydown.enter="register"
				/>
				<UiInput
					type="password"
					placeholder="Подтвердите пароль"
					v-model="registrationData.confirmPassword"
					@keydown.enter="register"
				/>
			</div>
			<UiButton
				class="register-button"
				:disabled="isLoading"
				@click="register"
			>
				Создать
			</UiButton>
			<div class="have-account-link-wr">
				<NuxtLink to="/auth">У меня уже есть аккаунт</NuxtLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.registration-page
	{
		min-height: calc(100vh - 40px);

		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.registration
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

	.register-button
	{
		margin-bottom: 20px;
		text-transform: uppercase;
	}

	.have-account-link-wr
	{
		display: flex;
		justify-content: center;

		a
		{
			color: $white25;
			font-size: 12px;

			@include tr(.3, color);

			&:hover { color: $white; }
		}
	}
</style>