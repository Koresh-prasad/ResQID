import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const QRCode = require('../server/node_modules/qrcode');

const url = process.argv[2] || process.env.PUBLIC_APP_URL;

if (!url || !/^https?:\/\//.test(url)) {
  console.error('Usage: node scripts/make-public-qr.mjs https://your-public-resqid-url');
  process.exit(1);
}

await QRCode.toFile('ResQID-public-website-QR.png', url, {
  width: 1200,
  margin: 2,
  color: {
    dark: '#0f172a',
    light: '#ffffff'
  }
});

console.log(`Created ResQID-public-website-QR.png for ${url}`);
