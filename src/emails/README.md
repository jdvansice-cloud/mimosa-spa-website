# Email Templates for Mimosa Spa Retreat

These email templates are designed to match the Mimosa Spa website branding.

## Setup in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Email Templates**
3. Select the template type you want to customize
4. Copy the HTML from the corresponding file and paste it into the template editor

## Available Templates

### magic-link.html
Used for passwordless login (Magic Link authentication).

**Supabase Variables:**
- `{{ .ConfirmationURL }}` - The magic link URL
- `{{ .SiteURL }}` - Your site URL

### How to Update

1. Edit the HTML file
2. Test in an email client or use a tool like [Litmus](https://litmus.com/) or [Email on Acid](https://www.emailonacid.com/)
3. Copy the updated HTML to Supabase

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#FCCF08` | Primary brand color, buttons |
| Gold Dark | `#D4AD00` | Button hover, gradients |
| Cream | `#FDFAF5` | Background |
| Beige | `#F5EFE7` | Secondary background |
| Warm Gray | `#8B8680` | Body text |
| Dark | `#333333` | Headings |

## Fonts

- **Display**: Cormorant Garamond (serif) - Headings
- **Body**: Lato (sans-serif) - Body text

Note: Web fonts may not render in all email clients. Fallbacks are provided.

## Testing

Always test emails in multiple clients:
- Gmail (web & mobile)
- Apple Mail
- Outlook (Windows & Mac)
- Yahoo Mail

## Logo URL

The logo is hosted at: `https://mimosa-spa-website.vercel.app/logo.png`

Make sure to update this URL if the site domain changes.
