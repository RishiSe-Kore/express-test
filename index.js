const express = require('express');
const axios = require('axios'); // Import axios at the top
const app = express();
const port = 4040;

app.use(express.json()); // Enable parsing of JSON request bodies

app.get('/asyncServer', (req, res) => {
  console.log("🚀 ~ app.get ~ req:", req.headers)
  const callbackUrl = req.headers.callbackurl;
  const authToken = req.headers.token; // Assuming the authorization token is in the 'token' header
  const delay = (parseInt(req.headers.delay) || 20) * 1000; // Take delay from headers, fallback to 20 seconds, convert to ms

  if (!callbackUrl) {
    return res.status(400).json({ error: 'Missing callback URL' });
  }

  if (!authToken) {
    return res.status(401).json({ error: 'Missing Authorization Token' });
  }

  // Extract the callId from the callback URL
  const callIdMatch = callbackUrl.match(/callflows\/([a-f0-9\-]+)\/serviceCallback/);
  const callId = callIdMatch ? callIdMatch[1] : null;
  console.log("🚀 ~ app.get ~ callId:", callId)

  if (!callId) {
    return res.status(400).json({ error: 'Invalid callback URL format' });
  }

  // Simulate some processing
  const data = {
    message: 'Async API processed successfully',
    timestamp: new Date().toISOString(),
    // callId: callId, // Include the callId in the payload
  };

  // Send the response to the callback URL
  setTimeout(() => { // Simulate asynchronous processing
    axios.post(callbackUrl, data, {
      headers: {
        'Authorization': authToken, // Include the original token in the callback
      }
    })
    .then(() => {
      res.status(202).json({ message: 'Response sent to callback URL' });
    })
    .catch(error => {
      console.error('Error sending callback response:', error);
      res.status(500).json({ error: 'Failed to send response to callback URL' });
    });
  }, delay); // Use delay from headers or fallback 
});

app.get('/syncServer', (req, res) => {
  console.log("🚀 ~ app.get ~ req:", req.headers)

  const delay = (parseInt(req.headers.delay) || 20) * 1000; // Take delay from headers, fallback to 20 seconds, convert to ms

  setTimeout(() => { // Simulate synchronous processing
    return res.status(202).json({ message: 'Sync API processed successfully' })
  }, delay); // Use delay from headers or fallback 

});

app.get('/', (req, res) => {
  const documentation = `
    <h1>API Documentation</h1>
    <h2>GET /asyncServer</h2>
    <p>Asynchronously processes a request and sends the response to the callback URL after a specified delay.</p>
    <p><strong>Headers:</strong></p>
    <ul>
      <li><strong>callbackurl</strong>: URL to send the response to (required)</li>
      <li><strong>token</strong>: Authorization token (required)</li>
      <li><strong>delay</strong>: Delay in seconds (optional, defaults to 20 seconds)</li>
    </ul>
    <h2>GET /syncServer</h2>
    <p>Synchronously processes a request and sends the response after a specified delay.</p>
    <p><strong>Headers:</strong></p>
    <ul>
      <li><strong>delay</strong>: Delay in seconds (optional, defaults to 20 seconds)</li>
    </ul>
  `;
  res.send(documentation);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
