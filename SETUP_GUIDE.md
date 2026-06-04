# StoryLingo Demo: Complete Setup Guide

Deploying an app to the internet sounds like something only "real developers" do.

It's not. You're going to do it today. And honestly, it's going to take you less time than writing a PRD.

By the end of this guide, you'll have a **working voice AI app** — one that tells kids fairy tales in real-time using OpenAI's voice models — **live on the internet**, deployed to your own backend. You built it. Well, you configured and deployed it. Same energy.

Here's what we'll cover:

- What accounts do I need to set up?
- What's a "repo" and how do I get the code?
- What are environment variables and why do they matter?
- How do I actually deploy this thing to a live URL?
- How do I know it's working?

Don't worry if you've never opened a terminal before. We'll go step by step.

---

## Before You Start: The Full Picture

Here's everything you're going to set up. It looks like a lot, but each one takes 5-10 minutes.

| Tool | What it does | Cost |
|------|-------------|------|
| **Claude Code** | Your AI coding assistant — it'll help you run commands and edit files | Free tier available |
| **GitHub** | Where the app's code lives — think of it as Google Drive for code | Free |
| **OpenAI** | Powers the voice AI storytelling — the "brain" behind the app | Pay-as-you-go (you'll need ~$5 credit) |
| **Railway** | Hosts your app on the internet — it's like renting a computer in the cloud | Free tier available ($5/month after) |

Total setup time: **30-60 minutes**.

Let's go.

---

## Step 0: Set Up Claude Code

Claude Code is your AI-powered coding assistant. Think of it as having a senior developer sitting next to you, helping you run commands, edit files, and debug issues. You'll use it throughout this guide.

### Create an Anthropic account

1. Go to [claude.ai](https://claude.ai)
2. Click **Sign up** and create an account with your email or Google login
3. You'll need a **Pro plan** ($20/month) or **Max plan** to use Claude Code — the free tier doesn't include it

### Install Claude Code

You have a few options. Pick whichever feels most comfortable:

**Option A: Desktop app (easiest)**
1. Go to [claude.ai/code](https://claude.ai/code)
2. Download the desktop app for your operating system (Mac or Windows)
3. Open the app and sign in with your Anthropic account

**Option B: VS Code extension**
1. Open VS Code
2. Go to Extensions (the square icon on the left sidebar)
3. Search for "Claude Code" and install it
4. Sign in with your Anthropic account

**Option C: Terminal (CLI)**
1. Open your terminal
2. Run: `npm install -g @anthropic-ai/claude-code`
3. Run: `claude` and follow the sign-in prompts

> **Which should I pick?** If you've never coded before, go with the **desktop app**. It's the friendliest. If you already use VS Code, the extension is great.

---

## Step 1: Set Up GitHub

GitHub is where developers store and share code. When someone says "pull the repo," they mean "download the code from GitHub." That's exactly what you're about to do.

### Create a GitHub account

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Choose a username, enter your email, create a password
4. Complete the verification steps
5. Select the **Free** plan — that's all you need

### Install Git

Git is the tool that lets you download ("clone") code from GitHub to your computer. It might already be installed.

**Check if you have it:**
Open your terminal (or Claude Code) and type:
```bash
git --version
```

If you see a version number (like `git version 2.39.0`), you're good. Skip ahead.

**If you don't have it:**

- **Mac:** Open Terminal and run `xcode-select --install` — this installs Git along with other developer tools
- **Windows:** Download Git from [git-scm.com](https://git-scm.com/downloads) and run the installer (accept all defaults)

---

## Step 2: Clone the Repo

"Cloning" just means downloading a copy of the code to your computer. Here's how:

### Using Claude Code (recommended)

Open Claude Code and type:

> "Clone the repo from https://github.com/deewang/storylingo-demo"

Claude will run the command for you and put the code in your current directory.

### Using the terminal manually

```bash
git clone https://github.com/deewang/storylingo-demo.git
cd storylingo-demo
```

The first command downloads the code. The second command moves you into the project folder.

**How do I know it worked?** You should see a new folder called `storylingo-demo` with files like `package.json`, `README.md`, and a `server/` folder inside it.

> **What's a repo?** Short for "repository." It's just a folder of code that's tracked by Git. Every time someone makes a change, Git remembers it — like version history in Google Docs.

---

## Step 3: Preview the App Locally

Before setting up any accounts or API keys, let's see the app actually running on your machine. This gives you a feel for what you're deploying — and it's a great way to check that the code downloaded correctly.

### Ask Claude to run it

Open Claude Code inside the `storylingo-demo` folder and type:

> "Can you run a preview of this app"

Claude will install the dependencies and start the development server for you. After a minute or so you'll see the app open in your browser (or Claude will give you a link like `http://localhost:8081`).

### What you should see

You'll land on the **StoryLingo home screen** — an owl mascot, the app name, and a **Start** button. Tap Start and you'll reach the **Story Selection screen**, where you can browse the available stories and language options.

> **Note:** The voice AI features won't work yet — those need your OpenAI keys from Step 4. But the whole UI will be there and navigable.

### How to stop the server

When you're done previewing, go back to Claude Code and type:

> "Stop the dev server"

Or just close the terminal window.

---

## Step 4: Set Up OpenAI

OpenAI provides the voice AI that powers the storytelling. You need two things from them: an **API key** (your password to use their services) and a **stored prompt** (the instructions that tell the AI how to be a storyteller).

### Create an OpenAI account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Click **Sign up** and create an account
3. Go to **Settings** > **Billing** and add a payment method
4. Add at least **$5 in credit** — the voice API costs fractions of a cent per interaction, so $5 goes a long way

### Get your API key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Give it a name like "StoryLingo Demo"
4. **Copy the key immediately** — you won't be able to see it again after you close the dialog
5. Save it somewhere safe (a notes app, password manager, etc.)

Your key will look something like: `sk-proj-abc123xyz...`

> **Important:** This key is like a password. Don't share it, don't paste it in public chats, and don't commit it to GitHub. Anyone with your key can use your OpenAI credits.

### Create your stored prompt

The "stored prompt" is a set of system instructions saved in your OpenAI account that tells the voice AI how to behave as a storyteller. The app references this prompt by its ID.

This lives in the **Realtime Audio** section of the OpenAI platform — not the regular Prompts page.

1. Go to [platform.openai.com/audio/realtime](https://platform.openai.com/audio/realtime)
2. Click **Create** to start a new agent
3. Give it a name like "StoryLingo Prompt"
4. Open the file `prompts/storyteller.md` in the repo you just cloned — you can find it in your code editor or [view it on GitHub](https://github.com/deewang/storylingo-demo/blob/main/prompts/storyteller.md)
5. Copy everything inside the **Prompt Template** section (the text inside the code block)
6. Paste it into the **System instructions** field in the OpenAI editor
7. Click **Save**
8. Copy the **Prompt ID** — it's shown at the top of the page and starts with `pmpt_` (e.g., `pmpt_abc123def456...`)

Save this Prompt ID alongside your API key. You'll need both in the next steps.

---

## Step 5: Set Up Railway

Railway is a cloud platform that runs your app on the internet. Think of it as renting a computer that's always on, always connected, and accessible from any URL.

### Create a Railway account

1. Go to [railway.app](https://railway.app)
2. Click **Login** > **Sign in with GitHub** (this is the easiest way — and it connects your accounts)
3. Authorise Railway to access your GitHub
4. You'll land on the Railway dashboard

> **Do I need to pay?** Railway has a **free trial** with $5 of usage. The StoryLingo demo uses very little resources, so the free tier should be fine for testing. After the trial, it's $5/month for the Hobby plan.

### Connect your GitHub repo

1. On the Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Find and select `storylingo-demo` in the list
   - If you don't see it, click **Configure GitHub App** and grant Railway access to the repo
4. **Don't deploy yet** — we need to set environment variables first. If Railway starts an automatic deploy, that's okay — it'll fail, and we'll fix it in the next step

---

## Step 6: Configure Environment Variables

Environment variables are **secret settings** your app needs to run — things like API keys and domain names. They're kept separate from the code so you can share the code without sharing your secrets.

You need to set **3 variables**:

| Variable | What it is | Where you got it |
|----------|-----------|-----------------|
| `OPENAI_API_KEY` | Your OpenAI API key | Step 3: "Get your API key" |
| `OPENAI_PROMPT_ID` | Your stored prompt ID | Step 3: "Create your stored prompt" |
| `EXPO_PUBLIC_DOMAIN` | Your Railway app's URL | You'll get this below |

### Get your Railway domain first

Before setting the variables, you need to know your app's URL:

1. In your Railway project, click on your service (it might be called "storylingo-demo")
2. Go to **Settings** > **Networking**
3. Click **Generate Domain**
4. Railway will create a URL like `storylingo-demo-production.up.railway.app`
5. **Copy this domain** (without the `https://` part)

### Set the variables in Railway

1. In your Railway service, go to the **Variables** tab
2. Click **New Variable** for each one:

```
OPENAI_API_KEY = sk-proj-your-actual-key-here
OPENAI_PROMPT_ID = pmpt_your-actual-prompt-id-here
EXPO_PUBLIC_DOMAIN = storylingo-demo-production.up.railway.app
```

> **Why does EXPO_PUBLIC_DOMAIN matter?** This tells the frontend where to find the backend API. It gets baked into the app when it builds — which is why you need to set it **before** the app builds for the first time. If you set it after, you'll need to trigger a redeploy.

### (Optional) Set up locally with Claude Code

If you want to test on your own machine before deploying:

1. Open the project in Claude Code
2. Ask Claude: "Create a .env file from the .env.example template"
3. Claude will copy `.env.example` to `.env` and you can fill in your values:

```
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_PROMPT_ID=pmpt_your-prompt-id-here
EXPO_PUBLIC_DOMAIN=localhost:5000
```

> **What's the .env file?** It's a simple text file that holds your environment variables locally. It's already in `.gitignore`, which means Git will never upload it to GitHub. Your secrets stay on your machine.

---

## Step 7: Deploy to Railway

Once your environment variables are set, Railway will automatically build and deploy your app.

### Trigger the deploy

If Railway didn't auto-deploy after you set the variables:

1. Go to your Railway service's **Deployments** tab
2. Click **Deploy** or push any change to GitHub to trigger a new build

### What happens during the build

Railway runs two commands automatically (configured in `railway.json`):

1. **Build:** `npm run build` — this bundles the frontend (the web UI) and the backend (the Express server) into production-ready files
2. **Start:** `npm run server:prod` — this starts the server that serves your app

The build takes **3-5 minutes** the first time. You'll see logs streaming in the Railway dashboard.

### How do I know it's deployed?

- The deployment status will show a **green checkmark**
- The logs will show: `express server serving on port [number]`
- Your URL (from Step 5) will load the app

`[SCREENSHOT: Railway deployment logs showing successful build and "express server serving on port" message]`

---

## Step 8: Verify It Works

Time for the fun part. Let's make sure everything is working.

1. **Open your Railway URL** in a browser (e.g., `https://storylingo-demo-production.up.railway.app`)
2. You should see the **StoryLingo app** load
3. **Pick a story** — try "Snow White" to start
4. **Select a language** (English is the default)
5. **Start the session** and grant microphone access when your browser asks
6. **Talk to the storyteller** — it should respond with a warm voice telling you the story

> **Use Chrome.** The voice features work best in Google Chrome. Safari and Firefox may have issues with the WebRTC audio.

### Something not working?

| What you see | What's probably wrong | How to fix it |
|-------------|----------------------|--------------|
| App doesn't load at all | Build failed | Check the Railway deployment logs for errors. Most likely `EXPO_PUBLIC_DOMAIN` wasn't set before the build |
| App loads but voice doesn't work | Missing prompt ID or API key | Check that both `OPENAI_API_KEY` and `OPENAI_PROMPT_ID` are set in Railway Variables |
| "OPENAI_PROMPT_ID not set" error | Prompt ID missing | Go back to Step 4 and create the stored prompt |
| 401 error from OpenAI | Invalid API key | Double-check your API key. It may have expired or been revoked |
| Microphone not detected | Browser permissions | Click the lock icon in your browser's address bar and allow microphone access |
| App loads but shows wrong URL errors | EXPO_PUBLIC_DOMAIN mismatch | Make sure the domain matches your Railway URL exactly (no `https://`, no trailing slash). Redeploy after fixing (see Step 6) |

If you're stuck, **ask Claude Code for help.** Open the project and describe what you're seeing — it can read the error logs and help you debug.

---

## Wrapping Up

Look at what you just did:

- **Set up Claude Code** as your AI coding assistant
- **Created a GitHub account** and cloned a real codebase
- **Previewed the app locally** before touching any accounts or credentials
- **Set up an OpenAI account** with API access and a stored voice prompt
- **Created a Railway project** and connected it to your GitHub repo
- **Configured environment variables** — the secret settings that make the app work
- **Deployed a full-stack app** to a live URL on the internet
- **Tested a voice AI feature** end-to-end

That's a real deployment workflow. The same pattern — **pull code, configure secrets, deploy to a cloud provider** — is how production apps ship at real companies every day.

The tools change (Railway vs. AWS vs. Vercel), the apps change (StoryLingo vs. your future product), but the pattern is the same. And now you've done it yourself.

Not bad for an afternoon's work.

---

## Quick Reference

When you need to remember the key pieces:

| What | Where |
|------|-------|
| Your app URL | Railway dashboard > Settings > Networking |
| Your API key | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Your prompt ID | [platform.openai.com/prompts](https://platform.openai.com/prompts) |
| Env vars on Railway | Railway dashboard > Variables tab |
| Prompt template | `prompts/storyteller.md` in this repo |
| Env var template | `.env.example` in this repo |
| Deployment logs | Railway dashboard > Deployments tab |
