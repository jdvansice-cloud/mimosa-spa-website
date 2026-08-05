# Gift Card Label Printing — Front-Desk Machine Setup Guide

Complete provisioning guide for printing gift-card labels from **Chrome → QZ Tray → Omezizy D520** on a Mac (iMac or any front-desk Mac). Written 2026-08-04; verified against the working setup on the dev MacBook.

## The system at a glance

```
Chrome (admin → Gift Cards → Emitidas → Imprimir)
  └─ renders the label as a 609×406 px bitmap (203 dpi, exactly 3×2 in)
  └─ QZ Tray (local app, signed websocket — no print dialog)
      └─ CUPS queue "D520" (TSPL label driver)
          └─ Omezizy D520 via USB → 3×2 in label
```

Everything is pixel-exact end to end: the bitmap is rendered at the printer's native 203 dpi, pre-rotated in the browser, and sent with all scaling disabled. **Nothing in this chain may scale, fit, or rotate the image** — that is what breaks barcodes.

## What you need

- The **Omezizy D520** printer + its **USB cable** (Bluetooth is only for their phone app — the Mac must use USB)
- The roll of **3×2 in transparent direct-thermal labels**
- The **`override.crt`** file — the system's existing public signing certificate. **Do not create a new one on this machine** (see step 4 — it must match the private key on the server). You can download it from the website itself once logged in as admin, or AirDrop the copy from the dev MacBook (`~/Desktop/Mimosa QZ Cert/override.crt`)
- An admin login for the website

---

## 1. Printer hardware

1. Connect the D520 to power and to the Mac **by USB**. Power it on.
2. Open the lid and load the label roll, labels feeding out from the top, adhesive side down. Adjust the side guides snug against the roll.
3. Close the lid and **press the feed button once**. The printer feeds and self-calibrates to the label. It should stop with a label edge at the tear bar. If it feeds continuously or stops mid-label, see [Calibration](#calibration--the-transparent-labels).

### Calibration & the transparent labels

The D520 registers labels with a sensor. Clear film is invisible to the transmissive **gap** sensor, so transparent labels rely on the **black marks** printed on the back of the liner:

- **Flip the roll and check the liner's back for black rectangles** at each label boundary. The Amazon transparent 3×2 rolls normally have them (that's how clear thermal labels are made usable at all).
- With marks present, the queue option `zeMediaTracking=BLine` (set in step 3) makes the printer align every single label — position drift is impossible.
- After **every roll change**, press feed once so the printer re-finds the mark.
- If a roll ever arrives with **no marks and no detectable gap**, the printer cannot register it — don't fight it; use marked media.

Transparent film also needs **more heat than paper**: the darkness setting in step 3 is already raised (11), and print speed is set low (2 ips). If prints come out faint, raise Darkness further (max 15).

## 2. Install the D520 Mac driver

1. Download the Mac driver for the D520:
   - Omezizy's own guide: https://omezizy.com/pages/d520-setup-guide
   - Same printer rebadged, driver also at Phomemo: https://phomemo.com/pages/drivers (search "D520")
2. Run the `.pkg` with the printer **connected and on**; finish until "Installation was successful".
3. Confirm the queue exists — in Terminal:

   ```
   lpstat -p
   ```

   You should see a printer named **`D520`**. (If the installer didn't add it: System Settings → Printers & Scanners → Add Printer → select the USB D520, choose the "D520 Printer" driver.)

## 3. Configure the CUPS queue (critical)

There are **two layers of printer defaults**, and QZ jobs only see one of them (learned the hard way, 2026-08-05):

- `lpoptions` writes **user-level** defaults (`~/.cups/lpoptions`) — applied to `lp` and print-dialog jobs, **ignored by QZ Tray's Java pipeline**.
- The queue PPD's `*Default…` lines (`/etc/cups/ppd/D520.ppd`) are what the driver falls back to for everything a job doesn't specify — **this is what QZ jobs actually get**. The factory PPD defaults are wrong for our labels: tracking `Gap` (blind on transparent film → every print drifts lower than the last), speed 4 ips, darkness low. (`lpadmin -o …-default` looks like the official way to set these, but on macOS it exits 0 without storing anything — edit the PPD directly.)

**Step A — server-side defaults (the ones QZ obeys).** Paste into Terminal (asks for your Mac password):

```bash
sudo sed -i '' -e 's/^\*DefaultzeMediaTracking:.*/*DefaultzeMediaTracking: BLine/' -e 's/^\*DefaultDarkness:.*/*DefaultDarkness: 11/' -e 's/^\*DefaultzePrintRate:.*/*DefaultzePrintRate: 2/' /etc/cups/ppd/D520.ppd && grep -E '^\*Default(zeMediaTracking|Darkness|zePrintRate|Rotate):' /etc/cups/ppd/D520.ppd
```

The `grep` at the end should print `BLine`, `11`, `2` — and `Rotate: 1`, which is correct: **do NOT change `*DefaultRotate` in the PPD.** The app pre-rotates its bitmaps assuming the driver default of 1; changing it flips every QZ print sideways.

**Step B — user-level defaults (for the browser-dialog fallback and `lp`):**

```bash
lpoptions -p D520 -o PageSize=w216h144 -o zeMediaTracking=BLine -o Darkness=11 -o zePrintRate=2 -o Rotate=0
```

(Here `Rotate=0` **is** wanted — the browser fallback sends an unrotated 3×2 page.)

What the options mean:

| Option | Value | Why |
|---|---|---|
| `zeMediaTracking` | `BLine` | Register each label by the black mark on the liner back — the gap sensor cannot see clear film |
| `Darkness` | `11` (0–15) | Clear film needs more heat than paper |
| `zePrintRate` | `2` ips | Slower = darker and sharper |
| `PageSize` | `w216h144` (3×2 in) | Stops the driver scaling to Letter (blurry, unscannable barcode) |
| `Rotate` | `1` in the PPD, `0` in lpoptions | QZ path pre-rotates and needs the driver's 1; the fallback path needs 0 |

> All of this is per-machine, per-queue. If the D520 queue is ever deleted and re-added (or the driver reinstalled), both steps must be run again.

## 4. Install QZ Tray (fresh or reinstall)

QZ Tray is the bridge between Chrome and the printer. Current known-good version: **2.2.6**.

**If reinstalling** (clean slate):

```
pkill -f qz-tray
```

Then drag **QZ Tray.app** from /Applications to Trash. Keep `~/Library/Application Support/qz/` only if you want to keep the cert; simplest is to delete the folder too and re-provision below. (Note: QZ Tray does not quit via right-click → Quit reliably — `pkill` is the way.)

**Install:**

1. Download the macOS installer from https://qz.io/download/ and run it.
2. Launch **QZ Tray** (it appears as an icon in the menu bar, near the clock).
3. Make it start automatically: the installer enables "launch on login" by default — verify in System Settings → General → Login Items that QZ Tray is listed.

**Install the Mimosa signing certificate** (this is what makes printing silent — no Allow dialogs):

> **Important: the certificate is copied to this machine, never created on it.** There is exactly one "Mimosa Gift Card Printing" key pair for the whole system: the **private key** lives on the server (`QZ_TRAY_PRIVATE_KEY` env var — it signs every print request) and the **public certificate** is what each front-desk Mac installs as `override.crt` so its QZ Tray trusts those signatures. A cert generated fresh on the iMac would not match the server's private key, and QZ would reject every print. Only regenerate the pair if the private key is lost or compromised — see the appendix at the end.

1. Get `override.crt` onto the machine — either way works:
   - **Easiest — download from the website:** in Chrome, logged in as admin, open `https://<the-site>/api/admin/qz/cert`. The page shows the certificate text (`-----BEGIN CERTIFICATE-----…`). Save it with **File → Save Page As…** to the Desktop as `override.crt` (format "Page Source"; if it saves as `override.crt.txt`, rename it).
   - **Or AirDrop** the existing copy from the dev MacBook: `~/Desktop/Mimosa QZ Cert/override.crt`.

2. Install it where QZ Tray looks for it, then restart QZ Tray:

   ```
   mkdir -p ~/Library/Application\ Support/qz && cp ~/Desktop/override.crt ~/Library/Application\ Support/qz/override.crt
   ```

   ```
   pkill -f qz-tray; sleep 2; open -a "QZ Tray"
   ```

   (Adjust the first path if you AirDropped it elsewhere — AirDrop lands in `~/Downloads`.)

Without this file, every print pops QZ's "Allow" dialog (and QZ's built-in Demo Cert **cannot** be remembered — the checkbox greys out the Allow button; don't bother with that path).

## 5. Chrome & the website

No Chrome settings are needed — the site talks to QZ Tray over a local websocket.

1. In Chrome, log into the site as admin → **Admin → Gift Cards → Emitidas** → pick a card → **Imprimir**.
2. Click **"Prueba"** (test print). First time, if it can't find the printer automatically it lists what it sees — click **D520**. The choice is remembered on that machine (per browser).
3. Read the test label against the checklist below.
4. Print a real label with **"Imprimir Etiqueta"** and scan its barcode with the front-desk scanner to confirm Mindbody lookup.

### Reading the test label

The **Prueba** button prints a calibration pattern. On a good print:

- **Frame** — the outer double frame lands on the label's edges, evenly. A shifted frame = registration offset → press feed once to recalibrate; still off → check `zeMediaTracking=BLine`.
- **ARRIBA triangle** points at the top of the label as it exits the printer. Sideways = `Rotate=0` missing or driver misconfigured.
- **Darkness patches** — 100% is solid black with no gray voids; 50% and 25% still look clearly different. All faint → raise Darkness. 50% smeared into solid → lower it.
- **Barcode** — crisp vertical bars, no gray edges. Scan `PRUEBA123` with the barcode scanner; it must read on the first pass.

## 6. Done — daily operation

- Staff just click **Imprimir Etiqueta**. No dialogs, no settings.
- New roll loaded → press feed once → optionally hit **Prueba**.
- Faint prints → raise Darkness (Terminal: rerun the step-3 command with `Darkness=13`, up to 15).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| "No se pudo conectar con QZ Tray" | QZ Tray not running | Open QZ Tray from Applications; check menu-bar icon |
| QZ "Allow" dialog on every print | `override.crt` missing | Step 4 cert install, restart QZ Tray |
| Label prints sideways | Driver rotation | `lpoptions -p D520 -o Rotate=0` (and note the app already pre-rotates — never "fix" rotation in the app) |
| Blurry text / unscannable barcode | Driver scaling | Rerun the full step-3 `lpoptions` line (PageSize is the usual culprit) |
| Each print lands lower than the last (progressive drift) | QZ jobs use the PPD defaults, and the factory default is `Gap` tracking — blind on clear film → fixed-length feeding | Run **step 3A** (the `sudo sed` PPD edit); confirm the liner back has black marks; press feed once |
| Labels drift / print across the gap | Sensor not tracking marks | Press feed once; confirm liner has black marks; check step 3 (both A and B) |
| Faint print | Clear film needs heat | Raise `Darkness` (max 15); keep `zePrintRate=2` |
| Continuous feeding after power-on | Never calibrated on this roll | Press feed once; if still lost, power-cycle with lid closed and feed again |
| Wrong printer receiving jobs | Stale saved choice in the browser | On the print page, trigger a print, click the correct printer when listed (it re-saves), or clear the site's localStorage key `giftcard-qz-printer-v2` |
| Prints fine via test but website fails only in production | Vercel env vars | `QZ_TRAY_CERTIFICATE` / `QZ_TRAY_PRIVATE_KEY` must be set in the Vercel project |

## Appendix — creating/regenerating the signing certificate

**You almost never do this.** The current pair (CN "Mimosa Gift Card Printing", valid to 2046) is already deployed. Regenerate only if the private key is lost or compromised — and understand the blast radius: the new public cert must then be reinstalled on **every** front-desk machine, and the env vars updated in both `.env.local` and Vercel.

1. On any Mac, generate a new 20-year self-signed pair:

   ```
   openssl req -x509 -newkey rsa:2048 -sha512 -nodes -days 7300 -subj "/CN=Mimosa Gift Card Printing" -keyout qz-private-key.pem -out override.crt
   ```

   This produces `qz-private-key.pem` (secret — server only) and `override.crt` (public — front-desk machines).

2. Convert each file to a single `\n`-escaped line for the env vars:

   ```
   awk '{printf "%s\\n", $0}' override.crt
   ```

   ```
   awk '{printf "%s\\n", $0}' qz-private-key.pem
   ```

3. Set the env vars with those values (quoted, single line):
   - `.env.local`: `QZ_TRAY_CERTIFICATE="-----BEGIN CERTIFICATE-----\n…"` and `QZ_TRAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…"`
   - Vercel → project **mimosa-spa** → Settings → Environment Variables: update the same two, then **redeploy** (env changes don't apply until the next deployment).

4. Install the new `override.crt` on every front-desk machine (step 4 above) and restart QZ Tray on each. Delete `qz-private-key.pem` from the Mac once the env vars are set — the server copies are the only ones needed.

5. Keep a provisioning copy of the new `override.crt` in `~/Desktop/Mimosa QZ Cert/` on the dev MacBook (or just rely on the website download path).

## Architecture notes (for developers)

- Transport: `src/lib/qz/qzPrint.ts` — QZ connection, signing, printer resolution, 1:1 bitmap submission. The D520 job is submitted as a **portrait 2×3 in page with the bitmap pre-rotated 90° CCW** — the macOS driver blur-resamples landscape pages; this is the only crisp path (verified on hardware 2026-08-04).
- Templates: `src/components/admin/giftcards/labels/` — `renderLabelCanvas.ts` (real label), `renderTestLabel.ts` (calibration pattern), both drawn in 203 dpi dot space.
- Printer geometry: `PRINTER_PROFILES` in `labels/types.ts` — D520 primary (3 in wide, rotate), Star TSP143 fallback (2.835 in, 52.5 mm pitch, no mark sensor — align rolls by hand).
- Signing: `/api/admin/qz/cert` + `/api/admin/qz/sign` (SHA512withRSA), keys in `QZ_TRAY_CERTIFICATE` / `QZ_TRAY_PRIVATE_KEY` (`\n`-escaped in `.env.local`; also set in Vercel). Cert CN "Mimosa Gift Card Printing", valid to 2046.
