MIDAS Assistant Integration

This project supports a MIDAS assistant that can use an external API.

Environment variables (set in your deployment environment):

- `MIDAS_API_URL` - URL of the external MIDAS API that accepts POST JSON { message, context } and returns JSON with `reply` or `text`.
- `MIDAS_API_KEY` - (optional) API key or Bearer token for the external service.

Behavior:
- If `MIDAS_API_URL` is set, the server will forward chat messages to that URL via POST.
- If `MIDAS_API_URL` is not set, the server returns a demo fallback reply.

Example curl (replace placeholders):

```bash
curl -X POST $MIDAS_API_URL \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MIDAS_API_KEY" \
  -d '{"message":"Qual é a melhor prática para separar finanças?"}'
```

Server endpoint:
- `POST /api/midas/chat` - body: `{ message: string, context?: any }`.

Frontend:
- The widget in `src/components/MidasWidget.tsx` will POST to `/api/midas/chat` and show replies.

Deployment:
- Set `MIDAS_API_URL` and optionally `MIDAS_API_KEY` in your hosting provider (Heroku, Vercel, Azure, etc.).
- Restart the Node server.

Security note:
- Do not commit secret API keys to the repository. Use environment variables or secret managers.
