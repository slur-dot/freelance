import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.all('/api/djomy-proxy', async (req, res) => {
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

    const fetchOptions = {
      method: req.method,
      headers: djomyHeaders,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);

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
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
});
