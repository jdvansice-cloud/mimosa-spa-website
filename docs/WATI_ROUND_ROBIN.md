# WATI round robin for chats that skip the location question

WATI Pro has no built-in round robin. The chatbot's **Webhook** node asks our
site whose turn it is, saves the answer in a variable, and a **Condition** node
hands the chat to that location's **Assign Team** node.

```
[no location chosen] → Webhook (GET /api/wati/round-robin) → saves {{team}}
                     → Condition: team == "cde" ?
                           yes → Assign Team: Costa del Este
                           no  → Assign Team: San Francisco
```

Answers alternate strictly `cde`, `sfc`, `cde`, `sfc`… A phone that was
routed in the last 24 h gets the same team again, so a retry never burns a
turn. If the database is unreachable the endpoint still returns `sfc` with
`"fallback": true`, so the chat is never left in the default pool.

## 1. Database (once)

Run `supabase/migrations/20260903_wati_round_robin.sql` in the Supabase SQL
editor. It is idempotent.

## 2. Environment variable

Add `WATI_ROUND_ROBIN_SECRET` (long random string) to Vercel → Production
and to `.env.local`. Redeploy after adding it.

```bash
openssl rand -hex 24
```

## 3. Chatbot in WATI (Flow Builder)

Open the flow that asks for the location. On the branch where the customer
does **not** choose (timeout / "other" / free text), replace the current
"assign to default team" step with these three nodes.

### Node 1: Webhook

| Field | Value |
|---|---|
| Method | `GET` |
| URL | `https://mimosaretreat.com/api/wati/round-robin?phone={{phone}}` (use the **Variables** button to insert `phone`) |
| Customize Headers | ON. Key `Authorization`, value `Bearer <WATI_ROUND_ROBIN_SECRET>` |
| Test Your Request | ON, set `phone` = your own number, click **Test the request**. Expect `{"team":"cde"...}` or `{"team":"sfc"...}` |
| Save Responses as Variables | ON. Response key `team` → variable `team` |
| Response Routing | ON. Route status `200` to the Condition node; route "other" straight to one Assign Team node (San Francisco) so failures still land somewhere |

### Node 2: Condition

- Variable: `team`
- Operator: `equal to`
- Value: `cde`
- Green path → Assign Team **Costa del Este**
- Red path → Assign Team **San Francisco**

### Node 3 and 4: Assign Team

Two Assign Team nodes, one per location, using the exact team names from
Team Inbox → Teams. Do **not** also select the default team.

Publish the flow.

## Test

1. From a phone not in the inbox, message the number and skip the location
   question. Note which team the chat lands in.
2. Repeat from a second phone: it must land in the other team.
3. Repeat from the first phone within 24 h: same team as before.

Check what happened at any time:

```sql
select phone, team, reused, created_at
from wati_round_robin_log order by created_at desc limit 20;
```

Reset the counter: `update wati_round_robin_state set last_team = 'sfc';`

## Endpoint reference

`GET|POST /api/wati/round-robin` — `src/app/api/wati/round-robin/route.ts`

- Auth: `Authorization: Bearer <WATI_ROUND_ROBIN_SECRET>` (401 otherwise, 503 if unset)
- Input: `?phone=` or JSON `{ "phone": "..." }`
- Output: `{ "team": "cde" | "sfc", "reused": boolean, "fallback"?: true }`
