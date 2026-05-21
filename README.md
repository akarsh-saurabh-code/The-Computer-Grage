# The Computer Garage — Website

## Chalane ke Steps (2 terminals)

### Terminal 1 — Server
```
node server.js
```

### Terminal 2 — Frontend  
```
npx vite
```

### Browser mein kholo
```
http://localhost:5173
```

---

## Login Credentials

| Role    | Email                          | Password   |
|---------|-------------------------------|------------|
| Admin   | admin@tcgarage.in             | admin123   |
| Client  | meera@prayagfinance.com       | client123  |
| Client  | sunil@gangaresidency.in       | hotel456   |

---

## Project Structure

```
tcg-website/
├── server.js          ← Backend server (ek file mein sab kuch)
├── data-store.js      ← JSON database (SQLite nahi, koi error nahi)
├── seed.js            ← Demo data (automatically runs)
├── data/              ← JSON files mein data save hota hai
├── src/
│   ├── App.jsx        ← Poori website
│   └── CCTVCalculator.jsx
├── public/
│   └── logo.jpeg
├── package.json
└── .env               ← Email/Razorpay settings
```

---

## npm install error aaye to

```
npm install --legacy-peer-deps
```
