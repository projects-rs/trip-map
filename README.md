# Trip Map

A phone app for trips: the trip's sites on a map, with pins colored by legends (day, kind, or any other grouping), a card for each site with its opening hours, and navigation on foot. It is a web app added to the phone's home screen, with no app store and no account.

**Open the app:** <https://projects-rs.github.io/trip-map/> on an Android phone (Chrome) or an iPhone (Safari), then add it to the home screen.

The app is being built in steps (see the design, section 13). Today it shows the map and "My location".

## Documents

| Document | What it explains |
| --- | --- |
| [docs/DESIGN.md](docs/DESIGN.md) | What the app does, and why |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the code is organized |
| [AGENTS.md](AGENTS.md) | Rules for AI coding tools, and for anyone writing code here |
| [NOTICES.md](NOTICES.md) | The libraries and data the app uses, with their licenses |
| [SECURITY.md](SECURITY.md) | How to report a security problem |
| [icons/README.md](icons/README.md) | The icon set |

## Running it on a computer

The app is written in TypeScript and built into the folder `site/` (DESIGN.md section 13.7):

```sh
npm install                      # the build and test tools, at exact versions
npm run build                    # type check, compile, and assemble site/
python3 -m http.server 8000 --directory site
# then open http://localhost:8000/
```

## Tests

The tests run the built app in a simulated Android phone and iPhone ([Playwright](https://playwright.dev)):

```sh
npx playwright install chromium webkit
npm test                         # builds, then tests
```

They also run on GitHub for every pull request. After each merge, GitHub builds and tests the app again and publishes it once the owner approves.

## License

The app's code is under the [MIT license](LICENSE). The libraries it uses keep their own licenses, listed in [NOTICES.md](NOTICES.md).
