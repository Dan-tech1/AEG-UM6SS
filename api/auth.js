export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = process.env.REDIRECT_URI || `${proto}://${host}/api/callback`;

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=repo,user`;

  res.redirect(307, authUrl);
}
