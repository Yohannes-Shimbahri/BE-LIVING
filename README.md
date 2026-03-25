# Be-Living Marketing Agency — Website

A full Next.js website for Be-Living Marketing Agency.

---

## 🚀 Quick Start

### Requirements
- **Node.js** v18 or higher → https://nodejs.org
- **npm** (comes with Node.js)

### 1. Install dependencies
Open a terminal in this folder and run:
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

Then open your browser at: **http://localhost:3000**

### 3. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
be-living/
├── app/                      # All pages
│   ├── layout.js             # Root layout (Navbar + Footer on every page)
│   ├── globals.css           # Global styles & CSS variables
│   ├── page.js               # Home page
│   ├── about/page.js         # About Us page
│   ├── services/page.js      # Services page
│   ├── portfolio/page.js     # Portfolio page
│   ├── industries/page.js    # Industries page
│   └── contact/page.js       # Contact page
│
├── components/
│   ├── Navbar.js             # Navigation bar
│   ├── Navbar.module.css
│   ├── Footer.js             # Footer
│   ├── Footer.module.css
│   └── AnimatedCard.js       # Scroll-triggered animation wrapper
│
└── lib/
    └── data.js               # ⭐ ALL website content lives here
```

---

## ✏️ How to Edit Content

### Edit text, services, portfolio, industries, stats:
Open **`lib/data.js`** — everything is clearly labelled:

- `SITE` → Agency name, email, phone, location
- `STATS` → The 4 numbers shown on the homepage stats bar
- `SERVICES` → All 7 services (icon, title, description, bullet points)
- `PORTFOLIO` → Case study cards (tag, title, description, result, color)
- `INDUSTRIES` → Industry cards (icon, name, short desc, long detail)
- `VALUES` → Values shown on the About page
- `PROCESS` → 4-step process on the About page

### Edit styles / colors:
Open **`app/globals.css`** — all colors are CSS variables at the top:
```css
:root {
  --gold: #C9A84C;       /* Main accent color */
  --dark: #0D0D0D;       /* Background dark */
  --offwhite: #F5F3EE;   /* Background light */
  /* ... */
}
```
Change `--gold` to any color to retheme the entire site instantly.

### Add a new page:
1. Create a folder: `app/newpage/`
2. Add `page.js` inside it
3. Add the link to `components/Navbar.js` and `components/Footer.js`

---

## 🌐 Deploying

### Deploy to Vercel (recommended, free):
1. Push this folder to a GitHub repository
2. Go to https://vercel.com and import the repo
3. Click Deploy — done!

### Deploy to Netlify:
1. Run `npm run build`
2. Upload the `.next` folder to Netlify

---

## 🐍 Python / Backend (Optional)

If you want to add a Python backend (e.g. for contact form emails):

1. Create a `backend/` folder
2. Add a Python file, e.g. `backend/main.py` using **FastAPI**:

```python
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])

class ContactForm(BaseModel):
    name: str
    email: str
    company: str = ""
    service: str = ""
    message: str

@app.post("/api/contact")
async def contact(form: ContactForm):
    # Add email sending logic here (e.g. smtplib, SendGrid, etc.)
    print(f"New inquiry from {form.name} ({form.email})")
    return {"status": "success"}
```

3. Install and run:
```bash
pip install fastapi uvicorn
uvicorn backend.main:app --reload --port 8000
```

4. In `app/contact/page.js`, replace the `handleSubmit` function with a fetch call:
```javascript
const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length > 0) { setErrors(e); return; }
  await fetch('http://localhost:8000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  setSubmitted(true);
};
```
