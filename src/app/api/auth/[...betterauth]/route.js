const AUTH_BACKEND_URL =
	process.env.AUTH_BACKEND_URL ||
	process.env.NEXT_PUBLIC_AUTH_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"http://localhost:5000";

async function proxyAuth(request, paramsPromise) {
	const params = await paramsPromise;
	const pathParts = params?.betterauth || [];
	const search = new URL(request.url).search;

	// Defensive base handling: avoid duplicating `/api/auth` if the env var already includes it
	const base = AUTH_BACKEND_URL.replace(/\/$/, "");
	let targetUrl;
	if (base.endsWith("/api/auth")) {
		targetUrl = `${base}${pathParts.length ? '/' + pathParts.join('/') : ''}${search}`;
	} else {
		targetUrl = `${base}/api/auth${pathParts.length ? '/' + pathParts.join('/') : ''}${search}`;
	}

	// Helpful debugging when proxying in dev — logs show incoming and outgoing targets
	try {
		// eslint-disable-next-line no-console
		console.debug('[proxyAuth] incoming:', request.method, request.url);
		// eslint-disable-next-line no-console
		console.debug('[proxyAuth] params.betterauth:', pathParts);
		// eslint-disable-next-line no-console
		console.debug('[proxyAuth] auth backend base:', base);
		// eslint-disable-next-line no-console
		console.debug('[proxyAuth] forwarding to:', targetUrl);
	} catch (e) {
		// ignore logging errors
	}

	const headers = new Headers(request.headers);
	headers.delete("host");

	const method = request.method.toUpperCase();
	const hasBody = method !== "GET" && method !== "HEAD";

	const response = await fetch(targetUrl, {
		method,
		headers,
		body: hasBody ? request.body : undefined,
		duplex: hasBody ? "half" : undefined,
		redirect: "manual",
	});

	const outboundHeaders = new Headers(response.headers);
	outboundHeaders.delete("content-encoding");
	outboundHeaders.delete("content-length");
	outboundHeaders.delete("transfer-encoding");
	outboundHeaders.delete("connection");
	outboundHeaders.delete("keep-alive");
	outboundHeaders.delete("proxy-authenticate");
	outboundHeaders.delete("proxy-authorization");
	outboundHeaders.delete("te");
	outboundHeaders.delete("trailer");
	outboundHeaders.delete("upgrade");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: outboundHeaders,
	});
}

export async function GET(request, context) {
	return proxyAuth(request, context.params);
}

export async function POST(request, context) {
	return proxyAuth(request, context.params);
}

export async function PUT(request, context) {
	return proxyAuth(request, context.params);
}

export async function PATCH(request, context) {
	return proxyAuth(request, context.params);
}

export async function DELETE(request, context) {
	return proxyAuth(request, context.params);
}

export async function OPTIONS(request, context) {
	return proxyAuth(request, context.params);
}
