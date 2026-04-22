export default {
	registration: async (payload) => useRequest('/register',
		{
			method: 'POST',
			body: payload
		}
	),

	login: async (payload) => useRequest('/login',
		{
			method: 'POST',
			body: payload
		}
	)
}