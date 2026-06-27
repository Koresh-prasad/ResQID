import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { default: app } = await import('./app.js');
const { connectDatabase } = await import('./config/database.js');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

app.listen(PORT, HOST, () => {
  console.log(`ResQID API running on http://${HOST}:${PORT}`);
});

connectDatabase();
