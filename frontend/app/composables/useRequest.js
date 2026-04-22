export const useRequest = (request, opts = {}) =>
{
	const config    = useRuntimeConfig();

	const options =
	{
		baseURL: config.public.api,
		...opts,
	};

	return $fetch(request, options);
};