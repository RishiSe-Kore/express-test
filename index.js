const express = require('express');
const app = express();
const port = 4040;

app.use(express.json()); // Enable parsing of JSON request bodies

app.post('/asyncServer', (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req.headers)
  const callbackUrl = req.headers.callbackurl;
  const authToken = req.headers.token; // Assuming the authorization token is in the 'token' header

  if (!callbackUrl) {
    return res.status(400).json({ error: 'Missing callback URL' });
  }

  if (!authToken) {
    return res.status(401).json({ error: 'Missing Authorization Token' });
  }

  // Extract the callId from the callback URL
  const callIdMatch = callbackUrl.match(/callflows\/([a-f0-9\-]+)\/serviceCallback/);
  const callId = callIdMatch ? callIdMatch[1] : null;
  console.log("🚀 ~ app.post ~ callId:", callId)

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
    const axios = require('axios'); // Import axios for making HTTP requests
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
  }, 3000); // Simulate a 3-second delay 
});

app.post('/syncServer', (req, res) => {
  console.log("🚀 ~ app.post ~ req:", req.headers)

  setTimeout(() => { // Simulate synchronous processing
  
    return res.status(202).json({ message: 'Sync API processed successfully' })
  }, 3000); // Simulate a 3-second delay 

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
