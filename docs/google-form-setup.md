# Contact form → Google Form

**Status: LIVE.** The form is created, published, and wired into the site.

| | |
|---|---|
| Form (fill in) | https://docs.google.com/forms/d/e/1FAIpQLSf4Vruzlbu0oIySPNBW33dVq05tpY9ytPglLXfUCvEMlsTyEg/viewform |
| Form (edit) | https://docs.google.com/forms/d/1JghZUdTwB6b0Q-Jfyuos6iSKadY-dJtfdkFRw30OgOI/edit |
| Owner | attilasabiniano@gmail.com |

Submissions land in the form's **Responses** tab (2 test responses recorded
2026-11-19, both accepted with "Your response has been recorded").

## Field mapping

Verified by submitting the live form and reading the real POST body — not by
guessing the ids:

```dotenv
VITE_GOOGLE_FORM_ACTION=https://docs.google.com/forms/d/e/1FAIpQLSf4Vruzlbu0oIySPNBW33dVq05tpY9ytPglLXfUCvEMlsTyEg/formResponse
VITE_GOOGLE_FORM_ENTRY_NAME=entry.273512640
VITE_GOOGLE_FORM_ENTRY_EMAIL=emailAddress
VITE_GOOGLE_FORM_ENTRY_PHONE=entry.1363306184
VITE_GOOGLE_FORM_ENTRY_ROLE=
VITE_GOOGLE_FORM_ENTRY_MESSAGE=entry.1184808363
```

> **There is a second, unused form** in the Drive called
> "MoldGuard enquiry" (`11OMQ9oHw…`). It is a rebuild I abandoned mid-way and is
> NOT wired to anything - ignore or delete it. The live one is the `1FAIpQLSf4Vru…`
> id above.

Two things worth knowing:

- **Email is `emailAddress`, not `entry.NNN`.** Google's built-in email collector
  posts under its own key, so it is not an entry id like the others.
- **"I am a" has no id** (`VITE_GOOGLE_FORM_ENTRY_ROLE` is empty). Rather than drop
  the visitor's choice, `Contact.tsx` folds it into the message body as
  `I am a: <role>` — verified in the POST body. Add a "I am a" question and set
  the env var to send it as its own column instead.

## Vercel

Vite inlines `VITE_*` at **build** time, so these six must also exist in
Vercel → Project → Settings → Environment Variables. `.env.local` is gitignored.

## Behaviour

`src/sections/Contact.tsx` posts a `URLSearchParams` body with
`mode: 'no-cors'` + `Content-Type: application/x-www-form-urlencoded`, plus the
`fvv` / `pageHistory` / `fbzx` fields Google requires. On success the form is
replaced by a thank-you panel; on failure a `role="alert"` tells the visitor to
email directly. If `VITE_GOOGLE_FORM_ACTION` or the message id is missing,
`useForm` is false and submit falls back to `mailto:` — and the disclosure under
the button changes to match, so it never claims "no backend" while posting to
Forms.
