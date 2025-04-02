# Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/bdff0972-1374-41d9-90bb-63c4b9ba8f39/deploy-status)](https://app.netlify.com/sites/rainbow-tulumba-717edb/deploys)

## Get Started

> [!IMPORTANT]
>
> Go 1.23.x and Hugo v0.143.x or above is required

1. Run `bin/setup` to setup [Hugo](https://gohugo.io/installation) and [Blowfish](https://github.com/nunocoracao/blowfish) theme
2. Start the server with `bin/start`
3. Alternatively, build the application with `bin/build`

## Releases

> [!NOTE]
>
> New releases will be published to the `production` branch where Netlify listens and deploys to https://maxlareau.com automatically.

1. `git switch master` and `git pull` to ensure we are up-to-date
2. Bump `VERSION` in conformance to [semver](https://semver.org/)
3. Log changes in `CHANGELOG.md`
4. Commit changes with the new verison like `git commit -m "v0.0.0"`
5. Create a tag like `git tag -a v0.0.0 -m "v0.0.0"`
6. Push to origin with `git push origin v0.0.0`
7. Switch to `production` branch with `git switch production`
8. Ensure `production` is up-to-date with `git pull`
9. Merge `master` - into -> `production` with `git merge master`
10. `git push` to finalize the merge
11. Remember to `git switch master`!
