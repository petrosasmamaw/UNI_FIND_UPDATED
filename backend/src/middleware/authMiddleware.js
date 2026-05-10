// This middleware attaches a `req.user` object when frontend provides user info.
// Since authentication is handled by Better Auth in the Next.js frontend, backend trusts
// the forwarded user info (e.g., via headers or body). Optionally, you can expand this
// to verify tokens with an auth provider.

const attachUser = (req, res, next) => {
  // Common patterns: frontend may send `x-user-id` and `x-user-email` headers,
  // or include user info in the request body. We attach minimal info to req.user.
  const userId = req.header('x-user-id') || req.body.userId || req.query.userId;
  const email = req.header('x-user-email') || req.body.email;
  if (userId) req.user = { id: userId, email };
  next();
};

module.exports = { attachUser };
