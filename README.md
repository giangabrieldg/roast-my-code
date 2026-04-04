# 🔥 Roast My Code

A fun hobby web app that roasts your code using AI. Paste code, click a button, get brutally honest (and funny) feedback.

## Stack

- **Frontend**: HTML + CSS + Bootstrap 5 + Vanilla JS
- **Backend**: Node.js + Express
- **AI**: [Groq](https://groq.com) (free tier) using `llama-3.3-70b-versatile`

---

## Setup

### 1. Get a FREE Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Then open `.env` and paste your Groq API key:

```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
```

### 4. Run the app

```bash
npm start
```

Open your browser at **http://localhost:3000**

For development with auto-reload:

```bash
npm run dev
```

---

## Project Structure

```
roast-my-code/
├── public/
│   ├── index.html   ← Frontend UI
│   ├── style.css    ← Styles
│   └── app.js       ← Frontend JS
├── server.js        ← Express backend + Groq API
├── package.json
├── .env.example
└── .env             ← Your secrets (don't commit this!)
```

---

## Notes

- Groq's free tier is generous — great for hobby projects
- Code input is capped at ~8000 characters
- Ctrl+Enter also submits the code
