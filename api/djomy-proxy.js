export default async function handler(req, res) {
  // CORS Preflight headers for the browser to allow calling this serverless function
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-KEY, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { path } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const targetUrl = `https://sandbox-api.djomy.africa${path}`;

  try {
    const djomyHeaders = {
      'Content-Type': 'application/json',
      'X-API-KEY': req.headers['x-api-key'] || '',
    };

    if (req.headers['authorization']) {
      djomyHeaders['Authorization'] = req.headers['authorization'];
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: djomyHeaders,
      // req.body is already parsed as an object by Vercel
      body: (req.method === 'POST') ? JSON.stringify(req.body) : undefined
    });

    const data = await response.text();
    let json;
    try { 
      json = JSON.parse(data); 
    } catch (e) { 
      json = { raw: data }; 
    }
    
    res.status(response.status).json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
