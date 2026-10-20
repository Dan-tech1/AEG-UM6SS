export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Code OAuth manquant.');
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      return res.status(400).send('Impossible de récupérer le jeton GitHub: ' + JSON.stringify(data));
    }

    const script = `
      <!doctype html>
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("receiveMessage %o", e);
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify({
                    token: accessToken,
                    provider: 'github',
                  })}',
                  e.origin
                );
                window.close();
              }
              window.addEventListener("message", receiveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })();
          </script>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(script);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur lors de l’authentification.');
  }
}
