# Publish ResQID For A QR That Works Anytime

Local links such as `127.0.0.1` and Wi-Fi links such as `172.18.55.222` only work while your laptop server is running. A QR that works for anyone anytime must point to a public HTTPS website.

## Recommended Hackathon Deployment

Use one full-stack deployment on Render/Railway or similar Node hosting.

### Build Command

```bash
pnpm install --no-frozen-lockfile
pnpm --filter resqid-client build
```

### Start Command

```bash
pnpm --filter resqid-server start
```

### Required Environment Variables

```env
NODE_ENV=production
PORT=10000
HOST=0.0.0.0
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
ENCRYPTION_SECRET=use_a_long_random_secret
CLIENT_URL=https://your-live-resqid-url
PUBLIC_APP_URL=https://your-live-resqid-url
```

After deployment, open the live URL and generate QR codes again. New QR codes will use `PUBLIC_APP_URL`.

## Create Website QR After Deployment

Replace the URL with your real public link:

```bash
node scripts/make-public-qr.mjs https://your-live-resqid-url
```

This creates:

```text
ResQID-public-website-QR.png
```

That QR will work anytime as long as the deployed website is online.
