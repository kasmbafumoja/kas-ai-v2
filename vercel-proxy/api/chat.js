const DEFAULT_UPSTREAM = "https://wormgptn-i6n8.vercel.app/api/chat";

export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée. Utilise POST." });
  }

  const upstreamUrl = process.env.UPSTREAM_API_URL || DEFAULT_UPSTREAM;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(req.body || {})
    });

    const body = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    return res.status(upstreamResponse.status).send(body);
  } catch (error) {
    return res.status(502).json({
      error: "Le proxy n'a pas réussi à joindre l'API distante.",
      detail: error?.message || "Erreur réseau"
    });
  }
}
