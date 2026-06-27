# ResQID Public Deployment Guide

This setup makes ResQID open from any phone or laptop anytime:

```text
QR code -> Vercel frontend -> Render backend -> MongoDB Atlas
```

## 1. Create GitHub Repository

1. Go to https://github.com
2. Click `+`
3. Click `New repository`
4. Repository name: `ResQID`
5. Choose `Public`
6. Do not add README
7. Click `Create repository`

Do not upload these:

```text
node_modules
.pnpm-store
server/.env
*.log
*.err
client/dist
```

## 2. MongoDB Atlas

1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user and password
4. Go to `Network Access`
5. Add this IP for hackathon/demo:

```text
0.0.0.0/0
```

6. Copy the connection string.

Use database name `resqid` in the URL:

```text
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/resqid?retryWrites=true&w=majority
```

## 3. Deploy Backend On Render

1. Go to https://render.com
2. Login with GitHub
3. Click `New`
4. Click `Web Service`
5. Select the `ResQID` repository
6. Use these settings:

```text
Root Directory:
server

Build Command:
pnpm install

Start Command:
pnpm start
```

Add environment variables:

```text
NODE_ENV=production
HOST=0.0.0.0
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use_a_long_random_secret
ENCRYPTION_SECRET=use_a_long_random_secret
CLIENT_URL=https://your-vercel-link.vercel.app
PUBLIC_APP_URL=https://your-vercel-link.vercel.app
```

Render gives a backend URL like:

```text
https://resqid-backend.onrender.com
```

Backend health check:

```text
https://resqid-backend.onrender.com/api/health
```

## 4. Deploy Frontend On Vercel

1. Go to https://vercel.com
2. Login with GitHub
3. Click `Add New`
4. Click `Project`
5. Import the `ResQID` repository
6. Use these settings:

```text
Root Directory:
client

Framework:
Vite

Build Command:
pnpm build

Output Directory:
dist
```

Add environment variable:

```text
VITE_API_URL=https://your-render-backend-link.onrender.com/api
```

Vercel gives a frontend URL like:

```text
https://resqid.vercel.app
```

Current ResQID frontend URL:

```text
https://res-qid-client.vercel.app
```

Current ResQID backend URL:

```text
https://resqid-backend.onrender.com
```

## 5. Final Render Update

After Vercel gives the final frontend URL, go back to Render and update:

```text
CLIENT_URL=https://your-vercel-link.vercel.app
PUBLIC_APP_URL=https://your-vercel-link.vercel.app
```

Then click `Save, rebuild, and deploy`.

## 6. Create Final QR

Use the Vercel website link for the QR:

```text
https://your-vercel-link.vercel.app
```

QR codes generated inside ResQID will open emergency profile pages on the Vercel website.
