# Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/bdff0972-1374-41d9-90bb-63c4b9ba8f39/deploy-status)](https://app.netlify.com/sites/rainbow-tulumba-717edb/deploys)

## Get Started

> [!IMPORTANT]
>
> Hugo v0.143.x or above is required (standard edition). Go 1.23.x is only needed for `bin/setup`.

1. Run `bin/setup` to install [Hugo](https://gohugo.io/installation)
2. Start the server with `bin/start`
3. Alternatively, build the application with `bin/build`

## Design

The site uses a small custom theme (no Blowfish, no Tailwind, no JS framework). See [`DESIGN.md`](DESIGN.md).

| Where | What |
|---|---|
| `layouts/` | Templates: base, home, single (About), experience, 404 |
| `assets/css/main.css` | All styles. Brand tokens in `:root` |
| `assets/js/site.js` | Card welcome line, ASCII backgrounds and switcher, devtools hello |
| `data/experience.yaml` | Experience page content (work, certifications, volunteer), rendered as data plates |
| `hugo.toml` | Site config, homepage links, nav |
| `static/_redirects` | `/c` → `/?hi` (business card QR target, 302); `/resume` → `/experience/` (301) |

### Settings

- **Cloudflare Web Analytics:** set `params.cloudflareAnalyticsToken` in `hugo.toml`. Empty = no analytics script.
- **Footer nameplate:** shows `VERSION` and the commit from Netlify's `COMMIT_REF`, linked to GitHub (`local` when built locally).

## Releases

> [!NOTE]
>
> New releases will be published to the `production` branch where Netlify listens and deploys to https://maxlareau.com automatically.

1. `git switch master` and `git pull` to ensure we are up-to-date
2. Bump `VERSION` in conformance to [semver](https://semver.org/)
3. Log changes in `CHANGELOG.md`
4. Commit changes with the new verison `git commit -m "v0.0.0"`
5. Push commits to origin `git push`
6. Create a tag `git tag -a v0.0.0 -m "v0.0.0"`
7. Push tag to origin `git push origin v0.0.0`
8. Switch to `production` branch `git switch production`
9. Ensure `production` is up-to-date `git pull`
10. Merge `master` into `production` with `git merge master`
11. `git push` to finalize the merge
12. Remember to `git switch master`!
13. Wrap up the process by [making a new Github release](https://github.com/snowboardit/website/releases/new)
