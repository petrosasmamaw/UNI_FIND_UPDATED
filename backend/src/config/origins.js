const DEFAULT_WEB_ORIGINS = [
	'http://localhost:3000',
	'https://uni-find-updated.vercel.app',
];

function getAllowedOrigins() {
	const configuredOrigins = (process.env.WEB_ORIGINS || process.env.WEB_ORIGIN || '')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);

	return [...new Set(
		[...DEFAULT_WEB_ORIGINS, ...configuredOrigins],
	)];
}

module.exports = {
	DEFAULT_WEB_ORIGINS,
	getAllowedOrigins,
};