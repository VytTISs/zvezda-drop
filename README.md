# Zvezda Drop 8.0

A mobile-friendly Telegram Mini App / browser demo with virtual stars, collectible gifts, daily case, inventory, profile, missions, Mines-style puzzle and a plane skill game.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Deploy on Render
- Create a Web Service connected to this GitHub repository.
- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: Node.
- Add `WEB_APP_URL` only if you configure a Telegram bot separately.

## GitHub upload
Upload the CONTENTS of this folder to the repository root. Keep the `public` folder and its three files. Do not upload a ZIP inside the repository. Commit, then in Render use Manual Deploy -> Deploy latest commit.

## Notes
- This version is a virtual demo. It has no real-money deposits, withdrawals, purchases, or cash prizes.
- Progress is stored in the browser's localStorage on that device. It is not a secure shared account database; clearing browser data resets it.
- Telegram Web Apps SDK is loaded when available, but the game also works in a normal browser.
- Never put a real BOT_TOKEN in a public GitHub repository.
