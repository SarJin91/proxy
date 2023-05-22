const http = require('http');
const https = require('https');
const url = require('url');

// Tworzenie serwera HTTP
const server = http.createServer((request, response) => {
  // Parsowanie adresu URL żądania
  const requestUrl = url.parse(request.url);
  
  // Tworzenie opcji dla zapytania w zależności od adresu URL
  const requestOptions = {
    hostname: requestUrl.hostname,
    port: requestUrl.port || 80,
    path: requestUrl.path,
    method: request.method,
    headers: request.headers
  };
  
  // Tworzenie żądania HTTP
  const proxyRequest = http.request(requestOptions, (proxyResponse) => {
    // Przekazywanie nagłówków odpowiedzi
    response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    
    // Przekazywanie danych odpowiedzi
    proxyResponse.on('data', (chunk) => {
      response.write(chunk);
    });
    
    // Zakończenie odpowiedzi
    proxyResponse.on('end', () => {
      response.end();
    });
  });
  
  // Obsługa błędów zapytania proxy
  proxyRequest.on('error', (error) => {
    console.error('Błąd zapytania proxy:', error);
    response.statusCode = 500;
    response.end();
  });
  
  // Przekazywanie ciała żądania
  request.on('data', (chunk) => {
    proxyRequest.write(chunk);
  });
  
  // Zakończenie żądania
  request.on('end', () => {
    proxyRequest.end();
  });
});

// Uruchomienie serwera na porcie 3000
server.listen(3000, () => {
  console.log('Serwer proxy jest uruchomiony na porcie 3000');
});
