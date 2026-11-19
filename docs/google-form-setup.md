# Contact form → Google Forms

The `/contact` enquiry form posts to a Google Form when one is configured, and
falls back to opening the visitor's own mail app (`mailto:`) when it is not.
Nothing breaks either way, and the disclosure under the button changes to match
whichever path is live.

## Why it needs a form from you

The Anime Waifu quiz's `entry.*` ids belong to *that* form. Reusing them would
send MoldGuard enquiries into the quiz's feedback spreadsheet, so the MoldGuard
form has to be its own.

## Set up (about 2 minutes)

1. Go to <https://forms.new> and create a form with these five questions, in this
   order and with these exact types:
   - **Name** — Short answer, required
   - **Email** — Short answer, required
   - **Phone** — Short answer, optional
   - **I am a** — Short answer (not multiple choice; the site sends the label)
   - **Message** — Paragraph, required
2. Top right → **Send** → the **link** tab (not the embed tab).
3. Open <https://forms.new> preview in a new tab → open the live form → click
   **Get pre-filled link**, fill anything, click **Get link**, copy it.
   The URL looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQL.../viewform?usp=pp_url&entry.111=Name&entry.222=Email
   ```
   The `1FAIpQL...` part is the form id, and each `entry.NNN` is a question's id.
4. Put them in `.env.local` (gitignored, already stubbed with these keys):

```dotenv
VITE_GOOGLE_FORM_ACTION=https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
VITE_GOOGLE_FORM_ENTRY_NAME=entry.NNN
VITE_GOOGLE_FORM_ENTRY_EMAIL=entry.NNN
VITE_GOOGLE_FORM_ENTRY_PHONE=entry.NNN
VITE_GOOGLE_FORM_ENTRY_ROLE=entry.NNN
VITE_GOOGLE_FORM_ENTRY_MESSAGE=entry.NNN
```

5. `npm run build` and redeploy. Vite inlines `VITE_*` at build time, so the
   values must be present **during the build**, including a Vercel build — add
   them under Project → Settings → Environment Variables.

## Verify

```bash
# answers go straight to the form's Responses tab
npm run dev   # then submit the /contact form once
```

A green "Thank you — your message is on its way." panel means the POST left.
`mode: 'no-cors'` gives an opaque response, so success can only mean the request
was sent, not that the sheet accepted it — the Responses tab is the real check.

## How it works

`src/sections/Contact.tsx` builds a `URLSearchParams` body and POSTs it with
`mode: 'no-cors'` and `Content-Type: application/x-www-form-urlencoded`, plus
the three fields Google requires (`fvv`, `pageHistory`, `fbzx`). If
`VITE_GOOGLE_FORM_ACTION` or the message entry id is missing, `useForm` is false
and the submit handler sets `window.location.href` to the mailto instead.
