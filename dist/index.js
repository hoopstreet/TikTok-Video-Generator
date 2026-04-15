const express = require('express');
const app = express();
const port = process.env.PORT || 7860;

app.get('/', (req, res) => res.send('TikTok Video Generator Proxy Active'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
    console.log(`🌐 Proxy Server active on port ${port}`);
});
