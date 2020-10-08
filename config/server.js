module.exports = ({ env }) => ({
	baseURL: env('BASE_URL', 'http://localhost:1337'),
	host: env('HOST', '0.0.0.0'),
	port: env.int('PORT', 1337),
	admin: {
	    auth: {
	      secret: env('ADMIN_JWT_SECRET'),
	    },
	},
});