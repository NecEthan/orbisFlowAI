import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// Enable CORS for Figma plugin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Hello World endpoint
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express.js!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});