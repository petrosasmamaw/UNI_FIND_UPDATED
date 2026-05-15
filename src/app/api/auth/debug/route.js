export async function GET(req) {
  const headers = req.headers;
  const originHeader = headers.get('origin') || headers.get('host') || '';
  const origin = originHeader.startsWith('http') ? originHeader : `http://${originHeader}`;

  const backendBase =
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000';

  const backendCallback = `${backendBase.replace(/\/$/, '')}/api/auth/callback/google`;
  const frontendCallback = `${origin.replace(/\/$/, '')}/api/auth/callback/google`;

  return new Response(
    JSON.stringify({ backendCallback, frontendCallback, origin, backendBase }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
