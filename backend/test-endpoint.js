const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/dashboard/summary',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer test-token'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.end();
