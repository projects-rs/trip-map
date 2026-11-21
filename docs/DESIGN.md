# Trip Map — App Design

"Trip Map" is a working name.

A phone-first web app that shows the sites of a trip on a real street map, with custom pins, several legends, site cards, and walking navigation. The app is not tied to any trip: each trip is a separate map file that is shared on its own.

Status: version 1 (basic map) is built. Everything below describes the version 2 design. All proposals and assumptions were approved by the app owner on 2026-11-15. Remaining open questions are listed in section 15. The build plan is in section 13. Group trips (section 9) are the last feature to be built, in release E.

Last updated: 2026-11-21

---

## 1. Goals

> **Decision (2026-11-21): the trip model.** What people share is a **trip**: its sites, legends, and groups, shown on a map. All trips are public, in one Trips repository, and anyone can download any trip. A user changes a trip only locally, on their phone, and can ask for the changes to be added to the public trip; only the app owner approves. Locked (encrypted) maps are dropped. Details that only the people on a trip should see travel only inside their group (goal 12). Sections 2 to 15 are being revised to this model, section by section, in the review of 2026-11-21.

Trips on the map:

1. Show a trip's sites on a real map with every street named.
2. Group sites by more than one legend (for example Category and Day) and filter by them.
3. Tap a site to see its details and navigate to it. Do this inside the app where possible; other navigation apps are a choice, not the default.
4. Keep the app independent of any trip. Every trip is a JSON file. The app predefines no sites, legends, groups, or colors.
5. Hold several trips on one phone, and switch between them. Each trip keeps its own local changes.

Getting and changing trips:

6. Let anyone find and download any trip from a list of public trips, by country and city, with nothing but the phone's browser. Advanced users can also take trips directly from GitHub.
7. Let a user change a trip locally, on their phone only: add or remove sites, and add or remove legend entries.
8. Let a user ask for their local changes to be added to the public trip, without knowing GitHub. Only the app owner approves. After approval, the trip's users are offered the update, and their copy changes only when they accept it.
9. Let a user publish a trip they created to the Trips repository, from the app, with "Request to add this trip". Before anything is sent, the app checks the trip for personal data (names, phone numbers, email addresses, exact home addresses, booking codes) and shows what it found; the user must remove it first. The same checks run again on GitHub, and the app owner reviews and approves the trip before it appears in the trip list (section 14.2).
10. Let an AI agent create a new trip from scratch, or update one, as a JSON file in the exact format the app accepts. The agent learns the format from the AI toolkit, public at one fixed address: a trip guide in plain words, a machine-readable schema, the icon list, and complete examples. The user just asks any AI to plan a trip for the app and answers its questions; the app's "Copy request for AI" gives one line with that address (section 8.4). One checker verifies every trip: in the app, on GitHub for anyone, and automatically on every pull request, where a trip that fails cannot be merged.
11. Let a user move a trip file in and out of the app, to edit it with outside tools such as an AI agent or a JSON editor.

Sharing:

12. Let a user share, from the app, with a predefined group (for example the people on the same trip): the whole trip, a legend entry, a site, and their location, the last only in a safe way (section 9.4). What is shared inside a group stays inside the group, and never reaches the public trip.

Platform and cost:

13. Install the app once, on its own, with no trips inside. After that, every trip is downloaded from within the app (goal 6). Installing needs nothing preinstalled: only the phone's browser, with no account, no app store, and no technical steps (section 3.1).
14. Update the app with no installation steps, and only after the user accepts.
15. Cost nothing to users, and as little as possible to the app owner: no servers of our own and no paid services, only the GitHub plan.
16. Keep private information out of public trips, and let users send feedback and problem reports without exposing it.

## 2. Main concepts

| Concept | Meaning |
| --- | --- |
| App | The program. One public address, the same for everyone. Installed on its own, with no trips inside (goal 13). |
| App owner | The single person who owns the app and its repositories, approves every change to the app and to every trip, and publishes new versions (section 12). |
| Trip | What people share: a JSON file with a trip's sites, legends, and legend entries, shown on a map. Every trip has a permanent identity, its `uid` (section 10). |
| Trips repository | The one public place where all published trips are kept, on GitHub. Anyone can download any trip from it (goal 6). |
| Trip list | The list of published trips inside the app, by country and city. Built from the Trips repository; the user does not see GitHub. |
| My trips | The trips on one phone: downloaded from the trip list, received from a group, opened from a file, or started on the phone. |
| Local trip | A trip that exists only on one phone: opened from a file or started with "Start a new trip", and not (yet) in the Trips repository. |
| Legend | One way of grouping a trip's sites, for example Category or Day (section 5.3). |
| Legend entry | One item of a legend, with its color, for example "Architecture" in Category, or "Fri 11" in Day. A site can be in several legend entries. |
| Local change | A change a user made to a trip on their phone only: a site added, changed, or removed, or a legend entry added or removed. It stays on the phone until the user sends it (goals 7, 8). |
| Update request | A user's local changes to a published trip, sent to the app owner with "Request to add my changes", to be added to that trip (section 8.6). Only the app owner approves. |
| New trip request | A trip a user created, sent to the app owner with "Request to add this trip", to be added to the Trips repository after the personal-data check (goal 9, section 8.6). Only the app owner approves. |
| Contributor | Someone who adds a new trip to the Trips repository, or updates one, by pull request on GitHub (an advanced user, section 2.1). The app owner approves every contribution. |
| Group | A predefined set of people, for example the four people on the same trip, who share trips, legend entries, sites, and their location with each other from the app, through the trip's WhatsApp group (goal 12, section 9). Membership is having the group's key; the app keeps no member list, IDs, or names. |
| Group trip | A trip that a group shares and works on together. What the members share inside the group, such as their apartment, stays inside the group and never reaches the published trip (section 9). |
| User | Anyone who uses the app. Simple and advanced users are described in section 2.1. |

Words that are no longer used (decision of 2026-11-21): "map" for the shared file (now "trip"), "locked map", "public map" (every trip is public), "map owner" (the app owner approves everything), "proposal" (now "update request" for changes, "new trip request" for a whole new trip), "group" for an item of a legend (now "legend entry").

### 2.1 Two kinds of user

| | Simple user | Advanced user |
| --- | --- | --- |
| Who | Anyone with a phone | Someone who uses GitHub: has an account, and knows how to make a commit and open a pull request |
| Needs | Only the phone's browser. No account, no keys. | A GitHub account |
| Downloads trips | From the trip list in the app | From the trip list, or directly from the Trips repository on GitHub |
| Makes local changes, shares in a group | Yes | Yes |
| Sends changes back | As an update request from the app (section 8.6) | As an update request, or as a pull request to the Trips repository |
| Adds a new trip to the Trips repository | Asks from the app, with "Request to add this trip", after the personal-data check (goal 9); the app owner does the rest | As a pull request (section 12.1) |
| Suggests app changes | Reports a problem from the app | As a pull request to the App repository |

- Every update request and every pull request is approved by the app owner. Nothing reaches the published trips or the app without that approval.
- Nothing in the app requires a simple user to know that GitHub exists (goal 13).
- An advanced user's rights belong to their GitHub account, not to their phone.

## 3. Platform, installation, and updates

| Item | Choice |
| --- | --- |
| App type | Web app, installable to the home screen (no app store) |
| Phones | Android and iPhone |
| Map display | Leaflet. Online: OpenStreetMap tiles. Offline: the trip's own offline map file (section 7.4) |
| Walking routes | FOSSGIS OSRM public server, foot profile |
| Hosting | GitHub Pages |
| Server of our own | None. Messages between users travel through WhatsApp or another messaging app (sections 8.6, 9). |
| Cost | Free |

### 3.1 Installation

The app is a web page that can be added to the phone's home screen (a "progressive web app"). It is not installed from an app store, and it does not need to be: Android and iPhone both support adding a web app to the home screen as a standard feature of the browser, so there is nothing for the stores to block.

- Opening the app link works immediately in the browser.
- "Add to home screen" gives the app its own icon and a full-screen view. Android offers this in one tap. On iPhone it takes two taps through the Share menu, and the app shows a short picture guide the first time.

#### 3.1.1 How the app and trips reach the phone (decided 2026-11-21)

The app and the trips arrive separately: first the app, then the trips, from inside the app.

| # | What | How |
| --- | --- | --- |
| 1 | **Installing the app** | The app owner sends the app's link, `https://projects-rs.github.io/trip-map/`, through WhatsApp or another messaging app, or shows it as a QR code. Users can forward it. The user opens it and adds the app to the home screen (section 3.1.3). The app arrives with no trips inside. |
| 2 | **Downloading a trip** | After the app is installed, from the trip list inside the app (by country and city). All trips in the list are public, so no link or key is needed. |
| 3 | **Creating a new trip on the phone** | "Start a new trip", then "Add site". Sites are placed by searching for a place or an address, or by a long press on the map (section 8.2). The user does not need to be there: GPS and the current location are not needed. |
| 4 | **Adding a trip made by an AI agent** | The AI agent writes the trip as a file (section 10.1). The user saves it on the phone, then uses "Add local trip" to add it to "My trips". The app checks the file first (section 10.3). |
| 5 | **Asking to update a public trip** | "Request to add my changes": an update request to the app owner (section 8.6). |
| 6 | **Asking to add a new trip to the public trips** | "Request to add this trip": a new trip request to the app owner, after the personal-data check (goal 9, section 8.6). |
| 7 | **Sharing a trip with a group** | Members of a group trip share the whole trip with each other through WhatsApp: "Share with my group" sends it as a group message, with everything the group added, such as their apartment. A trip too large for a link is sent as a small file. Each member's app adds it to "My trips". It does not go to the public trips. |

Inside a group (goal 12), members also send each other other group messages: a group invite, and messages that bring changes, sites, legend entries, or a location into the group trip (section 9). These stay inside the group chat.

Every link is an ordinary web address that starts with the app's address. The user never sees GitHub or needs to know about it. What comes after the "#" in a link is read only by the app on the phone, and is never sent over the internet.

#### 3.1.2 Which browser

| Phone | Opens the app | Adds it to the home screen |
| --- | --- | --- |
| Android | Any up-to-date browser: Chrome, Samsung Internet, Edge, Firefox | Chrome, Samsung Internet, Edge (recommended: Chrome) |
| iPhone | Any browser (on iPhone they all use Safari's engine) | Safari; on newer iOS versions also Chrome and Edge, through their Share menu |

- **Links opened inside WhatsApp** open in WhatsApp's own small browser, which can show the map but cannot add it to the home screen. The app detects this and shows "Open in Chrome" (Android) or "Open in Safari" (iPhone), with the menu item to tap.
- **Security and permissions:** the app runs inside the browser's security sandbox, like any web page. It cannot read the phone's files, contacts, photos, or other apps. The only permission it asks for is location, the first time the user taps "My location" or starts navigation, and the user can refuse or withdraw it in the phone's settings. Sections 14.3 and 14.4 cover the app's own security rules.

#### 3.1.3 What "installed" means, step by step

Adding the app to the home screen does three things: it saves the app's files in the browser's storage on the phone (so it opens without a connection), it creates an icon on the home screen, and it lets the app open full-screen in its own window, without the browser's address bar. No app store, account, or special permission is involved, and it can be removed like any app.

Android (Chrome):

1. Open the map link in Chrome.
2. The app shows an "Add to home screen" button. Tap it, or open Chrome's ⋮ menu → **Add to Home screen** (or **Install app**).
3. Tap **Install**. The icon appears on the home screen, and the map is already inside.
4. To remove it: long-press the icon → **Uninstall** (or remove).

iPhone (Safari):

1. Open the map link in Safari.
2. In the app's picture guide, tap **Copy map link** (see step 7 below for why).
3. Tap Safari's **Share** button (the square with an arrow) → **Add to Home Screen** → **Add**.
4. Open the app from its new icon and tap **Add map**, which pastes the copied link.
5. To remove it: long-press the icon → **Remove App** → **Delete from Home Screen**.

#### 3.1.4 When the browser does not load the app

| Cause | What the user sees or does |
| --- | --- |
| No internet on the first visit | "No connection" (table below) |
| A content blocker or "data saver" blocks parts of the page | The app shows which part failed (map tiles, the map file) and suggests allowing the app's address |
| A phone managed by an employer blocks the address | The browser shows its own block page; the user needs another phone or the employer's permission |
| A very old browser or phone | "This browser is too old for Trip Map. Please update it." |
| The link opened inside WhatsApp | Works for viewing; to add to the home screen, "Open in Chrome / Safari" (section 3.1.2) |


#### 3.1.5 Known platform limits

Adding a web app to the home screen is a standard, long-supported feature of both Android and iPhone. These limits are known, and none of them blocks the app:

| Limit | Phone | How the app deals with it |
| --- | --- | --- |
| "Add to Home Screen" is hidden in the Share menu | iPhone | A picture guide on first use (section 3.1.3) |
| The home-screen app does not share saved data with Safari | iPhone | Trips are downloaded inside the installed app (goal 13), so nothing has to be carried over |
| A website's saved data can be deleted after weeks without use; apps added to the home screen are exempt | iPhone | The app asks to be added to the home screen |
| No work in the background: no tracking or syncing while the app is closed | Both | Not needed: updates are checked when the app opens, and "Share my location" is a single tap |
| Not listed in the app stores | Both | People get the app's address by link or QR code |
| Blocked on some employer-managed phones, like any website | Both | Section 3.1.4 |

#### First use: from the app's link to the first trip

1. The user receives the app's link from the app owner, or from a friend, in WhatsApp or as a QR code, and taps it (section 3.1.1).
2. The phone's browser opens, and the app loads in a few seconds. If the link opened inside WhatsApp, the app shows "Open in Chrome" or "Open in Safari" first (section 3.1.2).
3. The app suggests adding itself to the home screen, with a picture guide on iPhone (section 3.1.3). After that, the user opens it from its icon.
4. The app asks the browser to keep its data permanently (section 3.3).
5. "My trips" is empty, and offers the ways to get a trip (below).
6. The user downloads a trip from the trip list. The app checks it (section 10.3), saves it in "My trips", and opens it.
7. The app offers "Download map for offline use" for the trip's area (section 7.4).
8. A short welcome note explains the basics: tap a pin for details, tap a chip to filter, and use the menu for more.
9. The first time the user taps "My location" or starts navigation, the phone asks for permission to use location. The app does not ask earlier.

The user needs no account and no password at any step. Installing comes first, so on iPhone nothing has to be carried from Safari into the home-screen app.

#### Ways to get a trip

"My trips", when empty, and the "Add trip" item in the menu, offer:

| Choice | What it does | Release |
| --- | --- | --- |
| **Trip list** | The public trips, by country and city, each with its title, place, and a short description. The chosen trip is downloaded into "My trips". The user does not see that the list and the trips come from GitHub. | A |
| **Start a new trip** | A new, empty local trip with a title and a place, ready for "Add site" (section 8.2). | A |
| **Add local trip** | A trip file saved on the phone, for example one made by an AI agent (sections 8.4, 10.2) | A |
| **Create a trip with AI** | A guided way to have any AI chat write a trip (section 8.4) | D |

A trip shared inside a group arrives as a group message instead (section 3.1.1, row 7).

#### Receiving a trip from a group

A trip shared inside a group arrives as a link in the group's WhatsApp chat. How a member receives it, with or without the app installed, is described in section 9.4 ("Receiving a whole trip").

#### What happens on later visits

1. The user opens the app from its home-screen icon.
2. The app opens with the trip that was last used. Other trips are in "My trips".
3. **Trip updates, asked first.** For each trip from the trip list, the app checks for a newer version. If the app owner approved changes, it shows "Update available for <trip>" with the list of what changed, and **Update** and **Not now**. The trip on the phone changes only after the user taps Update. The user's local changes are kept on top of the update.
4. **Every trip update is checked before it is applied.** The app runs the checker on the new version (section 10.3). If it fails, the saved version stays, and the app shows "This update could not be checked; your current trip is unchanged."
5. **App updates, asked first.** If a new version of the app is available, it shows "New version of Trip Map available" with what is new, and **Update** and **Not now** (section 3.2).
6. The app, each trip, and each offline map are updated separately.

#### When something goes wrong the first time

| Situation | What the user sees |
| --- | --- |
| No internet connection | "No connection. Connect to the internet and open the app again." |
| The trip list cannot be loaded | "The trip list is not available right now. Try again later." "Start a new trip" and "Add local trip" still work. |
| A trip needs a newer app | "This trip needs a newer version of the app", with an Update button. |
| A trip file fails the check | The checker's report, in plain words, and the trip is not added (section 10.3). |

#### When something goes wrong on a later visit

| Situation | What the user sees |
| --- | --- |
| No internet connection | The trips on the phone open, with their offline maps if downloaded (section 7.4). A small "No connection" note is shown. |
| A trip was removed from the trip list | The copy on the phone stays and keeps working, together with the user's local changes. The app shows "This trip is no longer in the trip list. You are viewing your copy from <date>." From then on it behaves as a local trip. |
| A newer version of a trip needs a newer app | The copy on the phone opens. The app shows "An update of this trip needs a newer version of the app", with an Update button. |
| The app's data was wiped | The recovery screen of section 3.3. |

### 3.2 App updates

- The app downloads a new version in the background, but uses it only after the user accepts. When a new version is published at the app's address, the app shows "New version of Trip Map available" with a short list of what is new, and **Update** and **Not now**. "Not now" asks again the next time the app is opened.
- Nothing changes during a walk: the question is never shown during navigation.
- A user opening the app for the first time always gets the newest version.
- If a map needs a newer app than the one on the phone, the app says so and offers the update (section 3.1).
- An update replaces only the app. The user's maps, local sites, and settings stay on the phone.
- The app's version number is shown in Settings.
- Each map file records its format version. Newer app versions continue to read older map files (section 11).
- Publishing a new version is the app owner's task. Claude can prepare a version, but only the app owner publishes it (section 12.4). Users do nothing.

### 3.3 Your data on the phone

Decision (2026-11-21): downloaded trips and changed trips must be safe from easy deletion. A web app cannot be fully protected from a user who deliberately wipes its data, but it can be safe from automatic cleanup and from common mistakes, and recoverable after a wipe.

Where the app keeps its data:

| Storage | What it holds | Cleared by "clear browser cache"? |
| --- | --- | --- |
| The app's database in the browser (IndexedDB) | Trips, local changes, groups, member names, settings | No |
| The app's private folder (Origin Private File System) | Each trip as a file, and the latest backup | No |
| The app's program files (Cache Storage) | The app itself, so it opens without a connection | No; and if lost, they reload from the app's address |

What can delete the data:

| Action | Trips and local changes |
| --- | --- |
| Clearing the browser's cache ("cached images and files") | Kept |
| The browser cleaning up space by itself | Kept, once persistent storage is granted (below) |
| Clearing "cookies and site data", or "Clear storage" / "Clear data" for the browser in the phone's settings | Deleted |
| Removing the app from the home screen | Deleted |

Protections:

1. **Persistent storage.** When the app is installed, it asks the browser to keep its data permanently ("persistent storage"), so the browser never deletes it on its own to free space. Settings shows whether this was granted.
2. **Never in the cache.** Trips and changes are stored only in the database and the private folder, never in the browser's cache.
3. **Restore link for the trips list.** Every published trip can be downloaded again by its `uid`. Settings offers "Save my restore link": a short link listing the user's trips, which the user can send to themselves, for example in WhatsApp. Tapping it re-downloads every trip on the list.
4. **Copies inside the group.** Everything shared in a group is also on the other members' phones. After a wipe, any member taps "Share with my group", which always sends the whole trip (section 9.4).
5. **One-tap backup of local changes.** A phone browser does not let a web app save a file by itself, so backup is offered, not silent: when a trip has unsent local changes, the app reminds the user ("You have 6 unsaved changes on Barcelona. Save a backup?"), and one tap saves a backup file to the phone's files or the user's own cloud drive. "Open trip file" restores it. The backup is private: it is not sent to the app owner.
6. **Warnings.** "Remove from this phone" warns about unsent changes and offers a backup first. Each trip in "My trips" shows the number of its unsent changes.
7. **After a wipe.** If the app finds its data gone, it opens with "Your trips are not on this phone any more" and three ways back: "Open my restore link", "Open a backup file", and "Download from the trip list".
8. **Permanent safety.** Changes sent as an update request and approved by the app owner are kept in the Trips repository, and can always be downloaded again.

## 4. Screen layout

The user interface is described across sections 4 to 7.1:

| Section | Part of the interface |
| --- | --- |
| 4 | Screen layout, the menu, and "My trips" |
| 5 | Pins and legends: what is drawn on the map |
| 6 | Site card: what it shows, and how it reacts to taps and long presses (section 6.1) |
| 7.1 | Navigation panel |

Each part's interactions are described next to the part itself.

Decision (2026-11-21): the interface in sections 4 to 7.1 is a first version, to be improved in several iterations. This applies to the layout below and to every screen, card, and interaction in those sections. Each iteration is tried on real phones at the test address (section 13.2), Android and iPhone; the app owner's feedback leads to the next one, and this section is updated when a layout is settled. Before an iteration, Claude can show the screens as mock-ups to compare options without building them.

First version:

- Full-screen map.
- Top: the trip's title, which opens "My trips" (section 4.1), and a switch that chooses the active legend.
- Bottom: the active legend's entries as chips. Tapping a chip shows or hides that entry's sites.
- Side: "My location" button, a "Search" button (section 8.5), and a menu.
- Site card: slides up from the bottom when a pin is tapped.

The menu, in the first version:

| Item | What it does | Release |
| --- | --- | --- |
| My trips | The trips on the phone (section 4.1) | A |
| Add trip | Trip list, Start a new trip, Add local trip (section 3.1) | A |
| Add site | Add a site to the current trip (section 8.2) | A |
| Download map for offline use | The trip's offline map (section 7.4) | A |
| Export trip | Save the trip with its local changes as a file; also the backup (section 3.3) | A |
| Request to add my changes | An update request to the app owner (section 8.6) | C |
| Request to add this trip | A new trip request to the app owner (goal 9) | C |
| My requests | The requests sent from this phone and their results (section 8.6) | C |
| Group | Start a group, invite, share with my group, leave (section 9) | To be decided in the review of section 9 |
| Create a trip with AI, Copy request for AI | Section 8.4 | D |
| Send feedback | Section 13.5 | A |
| Settings | Includes Offline maps, the restore link, and About (sections 3.3, 7.4, 14.1) | A |

Each item appears only once its release is built (section 13.3), and only where it applies.

### 4.1 Several trips: "My trips" and switching

A phone can hold several trips (goal 5). The app shows one trip at a time.

Switching:

1. The user taps the trip's title at the top of the screen, or "My trips" in the menu.
2. The "My trips" list opens. The trip on screen is marked.
3. The user taps another trip. The app switches to it.

Each entry in "My trips" shows:

| Item | Example | Notes |
| --- | --- | --- |
| Title and subtitle | Barcelona Trip, Dec 10–15 | |
| Where it came from | "Trip list", "Local", or "Group: Barcelona Dec 2026" | All trips in the trip list are public. A local trip is not (yet) in the trip list. A group trip also shows its group. |
| Published version date | "Published 2026-11-21" | For a trip from the trip list: the date of its last approved change in the Trips repository, or of its first publication if never changed. Not shown for a local trip. |
| Last local change | "Your changes: 2026-12-11, 6 not sent" | The date of the user's last change on this phone, and how many local changes are not yet sent. Not shown when there are none. |
| Update available | "Update available" | A newer approved version exists in the trip list (section 3.1) |
| Offline map | "Offline map: 38 MB" | When the trip's offline map is downloaded (section 7.4) |

Behavior:

- The list is ordered by last use, with the most recent first.
- The app opens with the trip that was used last.
- Each trip remembers its own view: the active legend, which legend entries are switched on, and the map position. Returning to a trip shows it as the user left it.
- Local changes belong to the trip they were made on. They do not appear on other trips.
- Adding a trip that is already on the phone, recognized by its `uid` (section 10), switches to it. It is not added twice.
- Switching trips during navigation first asks whether to stop the navigation.
- "Remove from this phone" takes a trip off the list. If the trip has local changes that were not sent, the app warns first and offers a backup (section 3.3).

### 4.2 Controls and what they do

Every control in the interface, with what a tap or a long press does. Each has an ID. The architecture description (ARCHITECTURE.md) maps each ID to the code that handles it, and each automated test names the IDs it checks. A new control gets a new ID here first.

Main screen:

| ID | Control | Action | What happens |
| --- | --- | --- | --- |
| UI-01 | Trip title (top) | Tap | Opens "My trips" (section 4.1) |
| UI-02 | Legend switch (top) | Tap | Shows the trip's legends. Choosing one replaces the chips at the bottom with its entries, and redraws every pin in that legend's colors (section 5.1) |
| UI-03 | Legend entry chip (bottom) | Tap | Shows or hides that entry's sites on the map. A hidden entry's chip is greyed out. A site stays visible while any of its entries in the active legend is shown |
| UI-04 | Legend entry chip | Long press | A small menu: "Show only this entry" (a second long press shows all again), and, in a group trip, "Share with my group" |
| UI-05 | Pin | Tap | Opens the site card (section 6), and moves the map so the pin is not hidden by the card |
| UI-06 | Map | Drag, pinch | Moves and zooms the map. Without a connection, the offline map is used in the trip's area (section 7.4) |
| UI-07 | Map | Long press | Starts "Add site" at that point (section 8.2) |
| UI-08 | "My location" button | Tap | The first time, the phone asks for location permission. Then the map centers on the blue dot. A second tap keeps the map following the user while walking |
| UI-09 | "Search" button | Tap | Opens search (section 8.5) |
| UI-10 | Menu button | Tap | Opens the menu (section 4) |
| UI-11 | Phone's Back button or gesture | Back | Closes the top panel (card, search, menu, list). On the main screen, asks before leaving the app |

Site card (section 6):

| ID | Control | Action | What happens |
| --- | --- | --- | --- |
| UI-20 | Card | Swipe down | Closes the card |
| UI-21 | Card | Swipe up | Shows the full card: weekly hours, all legend entries, the whole description |
| UI-22 | Any text | Long press | The phone's own text selection, to copy all or part (section 6.1) |
| UI-23 | Address | Tap | Opens the navigation panel (UI-40) |
| UI-24 | Web link | Tap | Opens the page in the phone's browser |
| UI-25 | Web link | Long press | The phone's own link menu: copy, open |
| UI-26 | Legend entry label on the card | Tap | Switches to that legend and shows only that entry (as UI-04) |
| UI-27 | Share button | Tap | "Share with my group": sends the whole trip, with this site in it, to the trip's WhatsApp group (section 9.4). In a trip with no group, offers to start one |
| UI-28 | "Edit" (local sites, and sites of the user's own trips) | Tap | Opens the site form (section 8.2) |

My trips (section 4.1):

| ID | Control | Action | What happens |
| --- | --- | --- | --- |
| UI-30 | A trip in the list | Tap | Switches to that trip, asking first if navigation is running |
| UI-31 | A trip in the list | Long press | The trip's actions: update, offline map, share with my group, export, remove from this phone |
| UI-32 | "Add trip" | Tap | Trip list, Start a new trip, Add local trip (section 3.1) |
| UI-33 | "Download map for offline use" (menu, or a trip's actions in UI-31) | Tap | Shows an adjustable rectangle around the trip's sites, with its size live ("12.4 km² · 38 MB", at most 150 MB) and "Best on Wi-Fi". **Download** fetches it, with a progress bar and **Cancel**; it continues if the user goes back to the map, and the trip shows "Offline map ready". If 2 areas are already stored, asks first which to delete. If no region covers the area, offers to request one (section 7.4) |
| UI-34 | Settings → **Offline maps** | Tap | Shows the 2 slots, each with its trip, size in km² and MB, and date. Tapping one shows its area on the map. **Change area** reopens UI-33 for that trip; **Delete** frees the slot after asking. An area with a newer version shows **Update** (asked first, section 3.1) |

Navigation panel (section 7.1):

| ID | Control | Action | What happens |
| --- | --- | --- | --- |
| UI-40 | Navigation panel | Opens | Shows the walking distance and time, and two choices of equal size |
| UI-41 | "In this app" | Tap | Starts in-app navigation (section 7.2); without a connection, shows direction and distance instead (section 7.4) |
| UI-42 | "In another app" | Tap | Opens Google Maps or Apple Maps with the site as the destination |

The menu items are listed in section 4. Group controls are added with the review of section 9.

## 5. Pins and legends

### 5.1 Pin icon and pin color

Decision: the icon comes from the site, and the color comes from the legend.

- Each site has its own location and icon. The icon says what the place is, and it is the same whichever legend is active.
- A pin has no color of its own. It takes the color of the legend group it is displayed under.
- Each legend group has a color, chosen by whoever defines the legend. The colors mean what the legend's author wants them to mean. A church can sit in "Architecture", or in a new "Famous buildings" group with its own color.
- Switching the active legend recolors the pins.
- A site that is in no group of the active legend shows a neutral grey pin, under an automatic "Other" chip.

A site in more than one displayed group (decision: pie-chart pin):

- The pin is divided like a pie chart, with one equal segment per displayed group, in each group's color.
- Up to three segments are shown. With four or more displayed groups, the pin shows the first three in legend order, plus a small count for the rest, such as "+2".
- Only groups of the active legend that are switched on are counted. When only one of the site's groups is displayed, the pin shows that group's color alone.
- The site card lists every legend entry the site belongs to, in every legend, each with its color, for example "Architecture" and "Music" from Category, and "Sun 13" from Day. The pin shows only the colors of the legend chosen at the top; the card shows them all.
- The "Add site" form shows a hint, without blocking, when a site is ticked into more than three entries of one legend, because its pin can show only three colors and a "+N" mark: for example "This site is in 4 Category entries. Its pin will show 3 colors and +1." The user can keep it that way.

### 5.2 Closed sites

- A site that is closed right now shows a red X mark on its pin.
- A site that closes within the next 30 minutes shows a yellow X mark, as a "closing soon" warning.
- In both cases the pin keeps its icon and its group color, so the site is still recognizable.
- Sites that are open, always open, or have unknown hours show the normal pin.
- The mark follows the same automatic open / closed status as the site card (section 6).

### 5.3 Legends

All the rules in sections 5.1 to 5.4 are also rules for AI agents that write trips, and are packaged in the trip-author skill (section 10.1).

Principle: a map's legends and their groups are decided by the map's author, not by the app. The app has no built-in legends, groups, or colors. It displays whatever a map defines. "Category" and "Day" in this document are examples only.

| Decided by the app | Decided by each map's author |
| --- | --- |
| The icon set (section 5.4) | Which legends exist, and their names |
| How pins, chips, and cards look and behave | The groups in each legend, and their names |
| | Each group's color |
| | Which sites belong to which groups |

Designing a map's own legends and groups is part of designing the map. It is done outside the app, in the map file, by the map owner, usually together with an AI tool (section 10.1). Users can add local legends and groups of their own on top (below).

- A legend is a named list of groups, for example Category (Art, Architecture, …) or Day (Thu 10, Fri 11, …).
- Each group lists the sites it contains.
- A site can appear in several legends, and in more than one group of the same legend.
- A map can define any number of legends.
- A legend chip shows its group's color, the group name, and the number of sites in it. The chips are the color key of the map.

#### Adding legends and groups in the app

Decision (2026-11-15): users can also add legends and groups in the app, in the same way as they add sites.

- A user can add a new group to one of the map's legends, with a name and a color, for example "Famous buildings".
- A user can add a new legend of their own, with its groups, for example "Who wants to go", with a group per person.
- These are **local legends and groups**, like local sites (section 8.3). They stay on the user's phone and do not change the map itself. The user can rename, recolor, or delete them.
- They are included in "Export map", and in proposals to the map owner, who decides whether to add them to the map.
- In a group trip, they are shared with the other members like any other change. Each member decides whether to take a new legend or group (section 9).


### 5.4 Icon set (version 1.0: 31 icons, maximum 50)

| # | Icon | Name | ID | Example |
| --- | --- | --- | --- | --- |
| 1 | ![Breakfast](../icons/breakfast.svg) | Breakfast | `breakfast` | café, bakery |
| 2 | ![Lunch](../icons/lunch.svg) | Lunch | `lunch` | restaurant |
| 3 | ![Dinner](../icons/dinner.svg) | Dinner | `dinner` | restaurant |
| 4 | ![Architecture](../icons/architecture.svg) | Architecture | `architecture` | notable building |
| 5 | ![Music](../icons/music.svg) | Music | `music` | concert hall, jazz club |
| 6 | ![Market](../icons/market.svg) | Market | `market` | food market, flea market |
| 7 | ![Shopping mall](../icons/shopping-mall.svg) | Shopping mall | `shopping-mall` | department store |
| 8 | ![Shopping](../icons/shopping.svg) | Shopping | `shopping` | shopping street |
| 9 | ![Viewpoint](../icons/viewpoint.svg) | Viewpoint | `viewpoint` | hilltop lookout |
| 10 | ![Sea](../icons/sea.svg) | Sea | `sea` | boat trip, harbor |
| 11 | ![Promenade](../icons/promenade.svg) | Promenade | `promenade` | seaside walk |
| 12 | ![Holy place](../icons/holy-place.svg) | Holy place | `holy-place` | church, cathedral |
| 13 | ![Museum / art](../icons/museum.svg) | Museum / art | `museum` | art museum |
| 14 | ![History / monument](../icons/history.svg) | History / monument | `history` | ruins, castle |
| 15 | ![Park / garden](../icons/park.svg) | Park / garden | `park` | city park |
| 16 | ![Bar / drinks](../icons/bar.svg) | Bar / drinks | `bar` | cocktail bar |
| 17 | ![Airport](../icons/airport.svg) | Airport | `airport` | airport |
| 18 | ![Tickets / booking](../icons/tickets.svg) | Tickets / booking | `tickets` | reminder pin |
| 19 | ![Ski lift](../icons/ski-lift.svg) | Ski lift | `ski-lift` | cable car, chairlift |
| 20 | ![Winery](../icons/winery.svg) | Winery | `winery` | winery, wine cellar |
| 21 | ![Parking](../icons/parking.svg) | Parking | `parking` | car park |
| 22 | ![Home / accommodation](../icons/home.svg) | Home / accommodation | `home` | where the group stays: apartment, hotel, or one's own home |
| 23 | ![Underground station](../icons/underground.svg) | Underground station | `underground` | metro stop (a train in a tunnel, so it differs from the railway station) |
| 24 | ![Bus station](../icons/bus.svg) | Bus station | `bus` | bus terminal, bus stop |
| 25 | ![Railway station](../icons/railway.svg) | Railway station | `railway` | train station |
| 26 | ![Beach](../icons/beach.svg) | Beach | `beach` | beach |
| 27 | ![Gym](../icons/gym.svg) | Gym | `gym` | gym, fitness club |
| 28 | ![Stadium / arena](../icons/stadium.svg) | Stadium / arena | `stadium` | football stadium, sports arena |
| 29 | ![Hospital](../icons/hospital.svg) | Hospital | `hospital` | hospital, emergency room |
| 30 | ![Police station](../icons/police.svg) | Police station | `police` | police station |
| 31 | ![Ferry](../icons/ferry.svg) | Ferry | `ferry` | ferry terminal, ferry crossing |

The icon set belongs to the app, so all maps share it.

Icon style (decision): solid, filled symbols in one uniform style, shown in white on the pin. The symbols come from the Material Design Icons collection by Pictogrammers, which is free and open source. The pictures in the table above are the files in the `icons` folder next to this document. The ID column is the value a map file uses in a site's `icon` field.

The icon set can be extended:

- The icon set is kept as its own file in the app's repository, `icons/icons.json`, with its own version number (section 11.4). It is not built into the app's code. The pictures are in `icons/`, one SVG file per icon, named by the icon's ID.
- Each icon has a fixed ID (for example `market`), a display name, a symbol, and the icon set version in which it was added (`since`). One icon file therefore holds the whole history, and no old icon files need to be kept.
- New icons are added by the app's owner and arrive with an app update.
- An icon's ID is never reused or deleted. A retired or renamed icon keeps working through an alias, so old maps are not broken.
- Each map file states the icon set version it was written for (`iconSetVersion`).
- Version 1.0 has 31 icons. The icon set has an upper limit of 50 icons.
- Decision: a map cannot carry private icons of its own, for now. Maps use only the shared icon set. If this is added later, a map would pick its extra symbols from a built-in symbol library.

## 6. Site card

The rules for what goes on a site card are also rules for AI agents that write trips, and are packaged in the trip-author skill (section 10.1).

A short tap on a pin opens the card. It shows these details:

1. **Icon title:** the name of the site's icon, for example "History / monument".
2. **Address:** or GPS coordinates when the site has no street address.
3. **Description:** free text.
4. **Webpage link:** the line is hidden when the site has no link.
5. **Opening hours:** for any site that has them, not only markets. The card shows the current status ("Open now, closes 19:00", "Closing soon, closes in 25 min", or "Closed, opens Tue 10:00") and the weekly hours. A site that never closes shows "Always open". The line is hidden when the hours are unknown.

Open or closed is worked out automatically from the site's hours and the current time at the map's location, not the time zone of the phone.

The card also lists the legend entries the site belongs to, in every legend, each with its color (section 5.1), and has a Share button (section 9.4).

### 6.1 Interactions

| Action | Result |
| --- | --- |
| Long press on any text | Native phone behavior: select and copy all or part of the text |
| Long press on the link | The phone's own link menu (Copy link, Open, …) |
| Short tap on the address | Opens the navigation panel (section 7.1) |
| Short tap on the link | Opens the page in the phone's default browser |

Decision: copying uses the phone's native behavior. Each field is copied on its own.

## 7. Navigation

### 7.1 Navigation panel

A short tap on the address opens a panel inside the app:

**"Navigate to <site>"**

- **In this app:** route, turn-by-turn directions, and voice on the app's map.
- **In another app:** Google Maps, Apple Maps (iPhone), or any installed navigation app (Android).
- **Cancel**

Both choices have equal prominence. The panel appears every time. There is no "Remember my choice" (decided 2026-11-15).

### 7.2 In-app navigation

- Walking route from the user's position, with distance and time.
- Follow mode: the map keeps the user centered while walking.
- Turn-by-turn banner ("In 80 m, turn left onto …") and a list of all steps.
- Spoken directions, with an on/off button.
- Re-routing when the user leaves the route.
- Arrival message, after which the site card opens.
- The screen stays on during navigation.

### 7.3 Limits of a web app

A web app runs only while it is on screen. When the phone is locked, or another app is in front, the browser pauses it: it cannot follow the user's position or speak directions in the background. Native navigation apps can.

What happens to navigation:

| Situation | What happens |
| --- | --- |
| The app is on screen | Full navigation: follow mode, turn banner, spoken directions. The screen stays on by itself (the browser's "keep screen awake" feature), so the phone does not lock while walking |
| The user switches to another app, or locks the phone | Navigation pauses: no spoken directions and no position updates. The route, the destination, and the walked part are kept |
| The user comes back to the app, or unlocks the phone with the app on screen | Navigation continues at once: the app shows "Finding your position…" for the few seconds the GPS needs, then shows "Navigation resumed", and, if the user has left the route, works out a new route (this needs a connection; without one, the app shows the direction and distance to the site, section 7.4) |
| The phone closed the app in the background, for example after a long lock (more common on iPhone) | While navigating, the app saves the destination, route, and progress on the phone. When it opens again, it offers "Continue navigation to <site>?", and one tap resumes |
| The user wants guidance with the phone in a pocket | Use "In another app" (section 7.1): Google Maps and Apple Maps keep speaking directions in the background |

Other limits:

- New routes need a connection. The map itself works offline in the trip's area (section 7.4).
- Navigation uses more battery than a native navigation app, mostly because the screen stays on. Section 7.3.1 describes how the app reduces this.

#### 7.3.1 Saving battery during navigation

The app reduces battery use during navigation as far as a web app can, and suggests further savings to the user:

| # | Measure | Saves battery because |
| --- | --- | --- |
| 1 | **Dark map, suggested:** when navigation starts, the app offers "Use the dark map to save battery?" The user can also switch it on or off at any time in the navigation banner | Most phones have OLED screens, where dark pixels use far less power |
| 2 | **"Keep screen on" switch** in the navigation banner, on by default. The app suggests turning it off on long walks. When off, the screen may turn off; on waking, navigation resumes at once (section 7.3), and the next turn is shown large | The screen is the biggest consumer |
| 3 | **Less drawing:** the map is redrawn only when the position changes noticeably, without animations | Less work for the processor |
| 4 | **Offline map in use** (section 7.4) | No mobile data for map images |
| 5 | **Battery hints:** after 30 minutes of navigation, the app suggests "Dim the screen to save battery". When the phone reports low battery, it suggests more: "Use the dark map, turn off Keep screen on, dim the screen, or continue in another app" | Gives the user the choice, without interrupting too often |

Each hint is shown once per walk, as a small banner that closes by itself and never covers the turn directions. A web app cannot change the screen's brightness itself, so dimming is only suggested.

### 7.4 Offline maps (decided 2026-11-21, release A)

A trip's map works fully without an internet connection, in an area the user downloaded for it. This is very important for travelers without a data plan.

What works without a connection:

| Part | Without a connection |
| --- | --- |
| Trips, pins, site cards, legends, opening hours, local changes | Works (stored on the phone, section 3.3) |
| Your position (the blue dot) | **Always works**: with or without a connection, inside or outside a downloaded area. GPS does not need the internet. Outside the offline area, without a connection, the dot and the pins are shown on a blank background, with the direction and distance to the chosen site |
| The map, with streets and street names | **Works in the downloaded area**, after "Download map for offline use" |
| Direction and straight-line distance to a site | Works: "850 m, north-east", with the blue dot |
| Walking route line and turn-by-turn | Needs a connection (section 7.2). Offline, the app shows the direction instead, and "In another app" can use Google Maps' own offline areas |
| Searching new places and addresses | Needs a connection. Searching within the trip works |

Offline regions:

- The app owner keeps a catalog of **offline regions**, for example "Barcelona and surroundings". Each is one map file, built from OpenStreetMap data in the PMTiles format (one file holding the map of the region, with an index of where each part is stored, read directly by the app), and published next to the app.
- A region is added when the app owner approves it. A user can ask for one from the app: "No offline map here yet – request it" reaches the app owner like an update request.
- Any trip can use a region that covers it, whether published, local, made on the phone, or received in a group.
- OpenStreetMap data may be copied and used offline, with credit (section 14.1). The offline files do not use OpenStreetMap's tile servers, whose rules forbid bulk downloading.
- GitHub Pages allows about 1 GB for the whole site, with files up to 100 MB each, so the catalog holds about 10 to 20 regions. If more are needed, region files can move to larger free storage later.

How the download works:

The app never downloads from OpenStreetMap's own tile servers, whose rules forbid bulk downloading for offline use. It uses OpenStreetMap's data, which may be copied with credit, packed into the project's own files.

1. **OpenStreetMap data.** The raw map of the world (streets, names, buildings), free to use under the Open Database License, with the credit "© OpenStreetMap contributors".
2. **A region file is built.** When the app owner approves a region, the automatic check on GitHub cuts that region out of a ready-made OpenStreetMap extract, as one PMTiles file.
3. **Inside the file.** The map is cut into many small square pieces ("tiles"), for each zoom level, from the whole region down to street level. At the start of the file, an index says where each tile sits in the file and how big it is.
4. **Published next to the app,** on GitHub Pages, at an ordinary web address.
5. **On the phone,** when the user chooses the rectangle:
    - the app first downloads only the index, which is small;
    - from the index, it knows exactly which tiles fall inside the rectangle at every zoom level, and their total size, which is the exact size shown;
    - on **Download**, it asks the web server for only those parts of the file. Web servers can send just bytes X to Y of a file ("range requests").
6. **Stored in the app's private folder** (section 3.3), and read by the map display when there is no connection.

So the phone never downloads the whole region, only the chosen rectangle, and nobody else's servers are loaded. The technical details are in ARCHITECTURE.md.

Choosing the area, as with Google Maps offline:

1. On a trip, **"Download map for offline use"** (UI-33) shows the map with an adjustable rectangle, starting around the trip's sites.
2. The user drags and zooms to change it. Live, below it: "12.4 km² · 38 MB". The size is exact: the app reads the region file's index before downloading.
3. **Download** fetches only the parts inside the rectangle, over Wi-Fi if possible, with a progress bar and **Cancel**. It is stored in the app's private folder (section 3.3), safe from clearing the browser's cache.
4. An area can be at most 150 MB. Above that, the app asks for a smaller rectangle.
5. If no region covers the rectangle, the app says "No offline map here yet" and offers to request it.

At most 2 offline areas on the phone (decided 2026-11-21):

- Each downloaded area belongs to one trip, and the trip shows it in "My trips" ("Offline map: 12.4 km², 38 MB").
- When 2 areas are already stored, a third download first asks which one to delete. The list shows each area's trip, size, and date.
- A trip whose area was deleted keeps working online. The freed slot can be used for a new trip, or for a new area of the same trip.
- Settings → **Offline maps** (UI-34) shows the 2 slots, with **Delete** and **Change area** for each.

Using it:

- Without a connection, the app shows the downloaded area at street level with street names. With a connection, it uses whichever is faster.
- A site outside the downloaded area shows "This site is outside the offline map".
- When a region has a newer version, the app offers to update the downloaded area, like any update, and asks first (section 3.1).
- The blue dot and the pins are always shown, even where there is no map behind them, so the user can always see where they are relative to the trip's sites.

To check before building it (build step 5a): a source of OpenStreetMap data in PMTiles form that the automatic check on GitHub can reach and is allowed to use, and its license terms.

## 8. Adding sites and changing trips

### 8.1 Start a new trip

A user can start a trip from scratch, from anywhere: GPS is not needed, and the user does not need to be at the place.

1. "My trips" → **Add trip** → **Start a new trip**.
2. A short form:
    - **Title** (required), for example "Lisbon, spring 2027".
    - **Place:** the user types a city, for example "Lisbon, Portugal", and picks it from the search (section 8.5). This sets where the map opens and the trip's time zone, which opening hours use.
    - **Dates** (optional), shown as the subtitle.
    - **Starting legends** (optional, all suggested and editable): "Day", with one entry per date if dates were given ("Thu 10", "Fri 11", …), each with its own color; "Category", empty, with entries added as sites are added; or no legends at all.
3. **Create.** The app makes a new trip with its own permanent `uid` (section 10), adds it to "My trips" as a local trip, and opens the map at the chosen place, with the hint "Long press on the map, or search, to add your first site".
4. From there, the trip works like any other: add sites (section 8.2), add legend entries, share it with a group (section 9), download an offline area (section 7.4), and later "Request to add this trip" to the public trips (goal 9).

### 8.2 Add site

- Choose the place: search for a place or address (section 8.5), long press on the map, or use the current location.
- Fill a short form: name, icon, description, link, opening hours, and the legend groups the site belongs to. A new group or legend can be added from the same form (section 5.3). The pin's color follows from the groups. The address is filled in from the location.

### 8.3 Local sites

- A site added in the app is stored on that phone only.
- The map shows the shared sites and the user's local sites together.
- The user can add, change, and remove any site on their phone, including the trip's own sites (goal 7). Changes stay on that phone only. A trip's own site that was changed or removed is marked, so that "Request to add my changes" can send it (section 8.6), and "Undo my change" restores the published version.
- Local sites survive closing the app and app updates.
- **Local changes are kept when the trip is updated** (section 3.1). A local site that was approved into the trip is replaced by the published one, matched by its ID, so there are no duplicates. A local change to a site that the update also changed is shown as "changed on both sides", and the user picks which to keep.
- Export: local sites can be saved as a small JSON file or shared as text, or exported together with the map (section 10.2). This is the backup. Clearing the browser's data, or opening the app in another browser, removes local sites.

### 8.4 Create a trip with AI

Creating a trip with AI is mainly for the person who organizes a trip; the others in the group receive the result (section 9). The user does only a few simple things. All the know-how is hidden in the public AI toolkit (section 10.1), which the AI reads by itself, and the app checks the result (section 10.3).

**Three steps** (decided 2026-11-21):

1. **Ask any AI** (ChatGPT, Claude, Gemini, Copilot, or another): "Plan a trip for the Trip Map app." To make sure the AI finds the toolkit, the app has a **"Copy request for AI"** button that copies one line with the address in it: "Plan a trip for the Trip Map app: projects-rs.github.io/trip-map/ai".
2. **Answer the AI's questions.** The toolkit tells the AI to ask the user where, when, and what they like, then to build the trip and check it. The user just chats, as with any AI. The app asks no questions of its own.
3. **Bring the trip into the app:** copy the AI's answer and tap **"Paste trip"**, or save the AI's file and use **"Add local trip"**. On Android, the AI app's Share button can also send it to Trip Map.

The app finds the trip in what was pasted, checks it, adds its `uid`, and adds it as a local trip. If anything is wrong, the app says what, in plain words, with a ready "please fix" text to paste back to the AI.

The plain request works only if the AI can search the web and the search finds the toolkit. "Trip Map" is a common name, so until the app has a distinctive name (open question 16), the "Copy request for AI" line with the address is the reliable way.

**Ask for a trip** (for users who do not use AI): "Add trip" → **"Ask for a trip"**, a short form with the place, the dates, and interests. It is sent to the app owner like a new trip request (section 8.6), and the user is told when the trip is ready in the trip list. Users can also start a trip by hand (section 8.1).

Checking what the AI made:

- An AI can get locations, addresses, and opening hours wrong. Every site made by AI is marked "not yet verified" on its card.
- The user can fix a location by dragging the pin or by searching the address (through OpenStreetMap's search, within its usage terms), and mark the site as verified.
- The request asks the AI to write descriptions in its own words and to leave out private information (section 14).

A built-in AI, where the user types into the app itself, is possible later. Someone must pay for every request, which conflicts with goal 15, so it is not part of this version.

### 8.5 Search

Decision (2026-11-15): the app can search the user's own map, and OpenStreetMap for places, streets, and addresses. The main use is choosing the place for a new site.

Two sources:

| | Search my map | Search OpenStreetMap |
| --- | --- | --- |
| Finds | Sites, groups, and addresses already in the map, including local sites | Any place, street, or address: "Sagrada Família", "pharmacy", "Carrer de Mallorca 401" |
| Works offline | Yes, on the phone | No, needs a connection |
| Service | None | OpenStreetMap's search service (Nominatim) |

#### Searching when adding a site (main use)

1. The user taps "Add site". The form opens with a field "Search a place or address".
2. The user types, for example "Sagrada Família", and taps Search.
3. The app shows a list of results, each with its name, address, type of place, and distance. Results near the area shown on the map come first.
4. The user taps a result. The map moves to it and shows a temporary pin.
5. The user taps "Use this place". The form is filled in with the name, address, and location, and, where OpenStreetMap has them, the website and opening hours. The app suggests an icon from the type of place.
6. The user checks the details, chooses the legend groups, and saves. The site becomes a local site (section 8.3).

If the place is not found, the user can still long press on the map or use the current location (section 8.2).

#### Searching from the map

- The "Search" button opens a search field over the map.
- Results from the user's own map come first. A "Search OpenStreetMap" line below them searches more widely.
- Tapping a result moves the map to it. A site from the map opens its card. A place from OpenStreetMap shows a temporary pin with a small card: name, address, "Add as site", and "Navigate" (section 7.1).

#### Rules for the OpenStreetMap search service

- **No search on every letter.** The user types and taps Search. The free service does not allow search-as-you-type.
- **At most one search per second** for the whole app. Without a server, the app cannot count across phones, so each phone waits at least one second between searches and keeps recent results so that the same search is not sent twice. With light use (a few groups), the total stays far below the limit. The app's own address is sent with each search, so the service can contact the app owner.
- **The app identifies itself** to the service, as its usage policy requires.
- **Credit:** search results show "Search by OpenStreetMap".
- **Larger use:** if the app grows beyond light use, another search provider is needed (section 13.6).

#### Data taken from OpenStreetMap

- Name, address, location, and, when present, website and opening hours.
- Fields filled from OpenStreetMap are marked "from OpenStreetMap" in the form, and the user can change them. Descriptions are written by the user (section 14.1).
- Opening hours in OpenStreetMap's format are converted to the app's format (section 10) when they are simple. Complex hours are shown to the user to enter by hand.
- A site added this way carries the OpenStreetMap credit (section 14.1).

#### Privacy

- The words searched, and the area shown on the map, are sent to OpenStreetMap's search service. Nothing else is sent (section 14.2).
- Searching the user's own map sends nothing.

### 8.6 Asking to add your changes or your trip to the public trips

Decided (2026-11-21): for now, the app owner approves every change to a public trip and every new trip. Later, a separate repository may let each contributor own their trips (section 15.1, "Community trips").

There are two kinds of request:

| Request | Button | What it carries |
| --- | --- | --- |
| **Update request** | "Request to add my changes", on a downloaded trip that has local changes (section 8.3) | The local changes: sites added, changed, or removed; legend entries added or removed; and notes on existing sites ("Report a problem with this site", for example "closed for renovation") |
| **New trip request** | "Request to add this trip", on a local trip | The whole trip |

For the user:

1. The user taps the button. The app runs the checker (section 10.3) and the personal-data check (section 14.2), and shows what it found. Errors and personal data must be removed first.
2. The app removes what must never leave the group: sites marked "Group only", and the group's key and WhatsApp link (section 9).
3. For a new trip request, the user chooses how to be named in the trip's `credits`, or "anonymous" (section 10).
4. The app shows everything that will be sent. The user confirms.
5. The phone's share menu opens with the request ready, addressed to the app's own email address for requests: a dedicated address for the app, not the app owner's personal email (section 13.5). The user can also choose WhatsApp or another app. A request too large for a link is sent as a small file.
6. The user's local changes stay on the phone, marked "sent", until the app owner decides.

#### 8.6.1 How a request finds the right trip

Every trip carries a permanent identity, so a request always reaches the right trip and the right version, even if the trip was renamed or updated in the meantime.

What the app remembers about each downloaded trip:

| Item | Example | Used for |
| --- | --- | --- |
| The trip's `uid` (section 10) | `6f1c2a9e-…` | Recognizing the trip, wherever it came from |
| The revision the user has | 7 | Knowing which version the user's changes are based on |
| A fingerprint of that version | the first characters of its SHA-256 hash | Proving that the base version is exactly the published one, not an edited copy |

An update request carries the trip's `uid`, the revision it was made on, that version's fingerprint, and the changes: new sites with their own new IDs, changed or removed sites by their existing IDs, and notes on existing sites. It carries no group details.

What the app owner's app does with it:

1. Finds the trip by its `uid`. A request for a trip that is not in the Trips repository is shown as "unknown trip" and cannot be approved.
2. Checks the fingerprint. If it does not match the published revision, the app warns that the request was made on an edited copy.
3. If the request was made on an older revision, the app compares site by site: a site the owner did not change since then is applied normally; a site both changed is marked "changed on both sides", and the owner picks one.
4. On approval, the trip's revision goes up by one (section 11.2).

A new trip request has a `uid` that the Trips repository does not have yet. The app owner's app checks that no published trip already uses it.

#### What happens next

The trip's owner decides whether to accept the request. Today that is the app owner, for every trip in `trip-db` (section 12.1). Once an accepted change is published, every user of the trip is offered the update the next time their app checks (section 3.1, "What happens on later visits").

**Telling the user the result** (decided 2026-11-21). Without a server, the result is published in `trip-db`, and the app reads it:

1. Each request gets a random request number when it is sent, for example `r-7f3a9c`. It reveals nothing about the user. The app keeps it on the phone, with the request.
2. When the trip owner decides, the result is written to a small public file in `trip-db`, `requests.json`: the request number; accepted, partly accepted, or not accepted; the date; and optionally a short reason, such as "already in the trip" or "closed permanently". It never holds names, email addresses, or other personal data.
3. The app checks `requests.json` whenever it checks for trip updates (section 3.1), and shows the result:

| # | Result | The app shows | The local changes |
| --- | --- | --- | --- |
| 1 | Accepted | "Your changes to *Barcelona* were accepted. Update available." | Replaced by the published ones when the user updates, so there are no duplicates (section 8.3) |
| 2 | Partly accepted | The same, and which sites were not accepted, with the reason | The accepted ones are replaced; the others stay local |
| 3 | Not accepted | "Your changes to *Barcelona* were not accepted", with the reason | Stay on the phone, marked "not accepted". The user can keep them or undo them |
| 4 | New trip accepted | "Your trip *Lisbon* is now in the trip list." | The local trip becomes the published one, matched by its `uid` |

- **"My requests"** in the menu lists every request sent from this phone, with its status: waiting, accepted, partly accepted, or not accepted.
- Since requests arrive by email, the trip owner can also reply directly, but the app does not depend on it.

## 9. Group trips

### What a group trip is (decided 2026-11-21)

A group trip is **one trip that a few people travelling together share on their phones**, for example four friends in Barcelona, December 10–15. Everyone sees the same map, the same sites, and the same legends. When one person adds something, the others get it.

**Why it is needed.** People on a trip plan together and change plans on the way. Without a group trip, each person has their own copy, and the copies drift apart ("where is that restaurant Noa found?"). A group trip keeps everyone on the same map.

**What the group can do together:**

| # | What | Example |
| --- | --- | --- |
| 1 | **Start from a trip** | A public trip from the trip list, or one a member built in the app or with AI (sections 3.1, 8) |
| 2 | **Add private places** | The apartment, a friend's home, the car park: seen only by the group, never sent to the public trips |
| 3 | **Share** | A new site, a whole day (a legend entry), changes, or the whole trip (section 9.4) |
| 4 | **Show where I am** | One tap sends my current position to the group, as a pin on the map: once, never tracked (section 9.4) |
| 5 | **Navigate** | Everyone navigates to the same shared sites (section 7) |

**Who and when.** A small group of people who know each other, about 8 at most (a recommendation; the app does not count members), for the length of one trip. After the trip, each member simply keeps the trip on their phone.

**Basic principles:**

- **The group is the only place for sharing** in the app. Outside a group there is nothing to share: a friend who wants the same trip downloads it from the trip list (section 3.1), and changes to a public trip are sent as a request, not shared (section 8.6).
- **Two ways to share, chosen when the group is created** (decided 2026-11-22): **WhatsApp** (the default, simpler) or **Google Drive** (an option, more robust). The whole group uses the one chosen; there is no mixing within a group. To change it later, the members start a new group from the same trip. Neither needs a server of our own or GitHub. (A server of our own was reconsidered and not chosen: section 15.1.)

    | # | | **WhatsApp** (default) | **Google Drive** (option) |
    | --- | --- | --- | --- |
    | 1 | Sending | Tap "Share with my group", pick the trip's WhatsApp group, Send | Automatic: the app writes to the group's shared Drive file |
    | 2 | Receiving | Tap the link (on iPhone: Copy, then "Paste group link") | Automatic: the app reads the file while it is open |
    | 3 | Accounts | None | Every member needs a Google account, and signs in once in the app |
    | 4 | Set up by the starter | A WhatsApp group of all participants, and its link | Sign in with Google; the app creates the Drive file by itself |
    | 5 | What members send each other | The invite, then every share | **Only the invite**: a QR code in person, or the invite link in WhatsApp. It holds the Drive file's link and the group key; all trip data then goes through the Drive file |
    | 6 | Missed updates | Caught up by the next share | Cannot happen: everyone reads the same file |
    | 7 | "Share my location" | Through the trip's WhatsApp group | **Also through WhatsApp** (the hybrid way, decided 2026-11-22): instant, and the chat shows who sent it |
    | 8 | Built | **First** (release E, steps 15 to 17) | **Afterwards**, as a supplementary way, once the WhatsApp way works and the two tests pass (step 17a, section 9.5) |

    Everything else is the same in both: the group key, the invites (QR code or link), joining, the whole-trip merging, and "Share my location". The app keeps the part that moves messages separate from the rest, so the two ways are interchangeable pieces on top of the same merging (section 13).
- **Membership is simply having the group key** (decided 2026-11-21). A share that opens with the group key came from inside the group, so it is valid. The app keeps **no member list, no member IDs, and no names**: WhatsApp already shows who sent each message, and the member who taps it knows who it came from.
- **What is private stays in the group:** nothing the group adds reaches the public trips unless a member sends it in a request, and sites marked "Group only" never do (section 8.6).
- **Simple for everyone:** joining is scanning a QR code on another member's phone, or opening an invite link, and receiving is one tap on a message.

Release: group trips are scheduled as the last feature, in release E (section 13.3). Moving them earlier is under discussion (2026-11-21). Until then, members pass trips as files (section 13.3, release A).

### 9.1 What a group trip stores

On each member's phone, in the app's internal database:

| # | Item | Example | Leaves the phone? |
| --- | --- | --- | --- |
| 1 | The group's name | "Barcelona Dec 2026" | Yes, inside invites and the group's locked messages |
| 2 | The trip | The Barcelona trip, with every site the group added | Yes, the whole trip, each time a member taps "Share with my group" (section 9.4). Each site has its own ID and the time it was last changed; who changed it is not stored. |
| 3 | The sharing way, and its address: either the WhatsApp group's invite link or the Google Drive file's link, never both | `https://chat.whatsapp.com/…`, or a Drive file ID | Yes, inside invites, so that one scan also joins the WhatsApp group, or opens the Drive file (section 9.3) |
| 4 | The group key | (hidden) | Yes, inside invites. The browser keeps it so that it can be used but not read out of the app. |
| 5 | The group's offline area | A rectangle: four numbers | Yes, inside the trip, so every member can download the same offline map (section 7.4) |

Not stored anywhere: members, member IDs, names, phone numbers, email addresses, or any other contact details.

The internal database:

- It is the app's own storage on the phone, separate from trip files.
- "Export trip", update requests, new trip requests, and feedback never read the group key or the WhatsApp link from it.
- Sites marked "Group only" are never included in a request (section 8.6).

### 9.2 Starting a group trip

The starter chooses the sharing way first (decided 2026-11-22), and then adds its address: the WhatsApp group's link, or the Google Drive file.

```mermaid
flowchart TD
    A["In the app: open the trip in 'My trips' and tap 'Start a group'"] --> B["Name the group: the trip's title is suggested"]
    B --> C{"Choose how to share"}
    C -->|"WhatsApp (default)"| W1["Create a WhatsApp group of all the participants, in WhatsApp (guide below)"]
    W1 --> W2["Paste the WhatsApp group's invite link"]
    W2 --> W3{"Confirm: is this your trip's WhatsApp group? Check it in WhatsApp, and see its participants there"}
    W3 -->|"Paste again"| W2
    W3 -->|"Yes, it's the right group"| E["The app creates the group and its group key"]
    C -->|"Google Drive"| D1["Sign in with Google"]
    D1 --> D2["The app creates the group's file in the starter's Drive, open to anyone who has its link; its content is locked with the group key"]
    D2 --> E
    E --> F["'Invite now' (section 9.3): QR code in person, and/or an invite link"]
```

**With WhatsApp (the default):**

1. **Create a WhatsApp group** with all the participants, in WhatsApp, as usual. The app cannot create it.
2. **In the app,** open the trip in "My trips", tap **"Start a group"**, name it (the trip's title is suggested; using the same name as the WhatsApp group makes it easy to recognize), and choose **WhatsApp**. Any trip can be used: one downloaded from the trip list, one built in the app, or one made with AI.
    - The app asks for the WhatsApp group's invite link, with a short picture guide (below). The app stores it with the group, so that the QR code can carry it and the app can show "Open the group chat". The app cannot use it to send messages.
    - **The app asks to confirm the link** (decided 2026-11-21): it shows the pasted link, shortened, and asks "Is this your trip's WhatsApp group?", with three buttons: **"Check in WhatsApp"**, **"Yes, it's the right group"**, and **"Paste again"**. "Check in WhatsApp" opens the link in WhatsApp; since the member is already in that group, WhatsApp simply opens it. The screen also says: "To see who is in it: in WhatsApp, open the group, tap its name, and the participants are listed. Make sure everyone there is on this trip."
    - The app cannot show the group's name or its participants itself: WhatsApp gives other apps no way to read them, and the link holds only a random code. This also means the app never learns anyone's phone number or name.
    - After "Yes", the app creates the group and its group key.
3. **Invite** with "Invite now" (section 9.3).

**With Google Drive (the option):**

1. In the app, tap **"Start a group"**, name it, and choose **Google Drive**.
2. **Sign in with Google.** The app asks only for access to files it creates or that the user picks, never to the whole Drive (section 9.5).
3. **The app creates the group's file** in the starter's Drive, for example `Barcelona Dec 2026.tripmap`, holding the whole trip, locked with the group key.
4. **Nothing else to share** (decided 2026-11-22). The app sets the file so that anyone who has its link can open it, which Google allows for a file the app created. Its content is locked with the group key, so the file's link alone is useless. **The invite holds the Drive file's link and the group key** (section 9.3), so no WhatsApp group is needed for the trip data, and the starter does not share the file in Drive by email; the app never sees email addresses.
5. The app creates the group and its group key. **Invite** with "Invite now" (section 9.3): a QR code in person, or the invite link in WhatsApp. This is the only thing the members send each other.

#### The in-app guide for the WhatsApp steps

"Start a group" opens a short guide in the app, with a picture for each step, on the phone's own system (Android or iPhone). The menu wording differs a little between WhatsApp versions, so the guide names what to look for rather than an exact position.

Creating the WhatsApp group (step 1):

| # | Android | iPhone |
| --- | --- | --- |
| 1 | Open WhatsApp, on the Chats tab | Open WhatsApp, on the Chats tab |
| 2 | Tap the new-chat button, then "New group" | Tap the new-chat button, then "New Group" |
| 3 | Choose the participants, then tap the arrow | Choose the participants, then tap "Next" |
| 4 | Type the group's name, for example "Barcelona Dec 2026", and tap the check mark | Type the group's name, and tap "Create" |

The person who creates a WhatsApp group is its admin. Only admins can get its invite link.

Copying the WhatsApp group's invite link (step 2):

| # | Android | iPhone |
| --- | --- | --- |
| 1 | Open the group chat | Open the group chat |
| 2 | Tap the group's name at the top | Tap the group's name at the top |
| 3 | Tap "Invite to group via link" (sometimes under "Invite to group") | Tap "Invite to Group via Link" |
| 4 | Tap "Copy link" | Tap "Copy Link" |
| 5 | Back in Trip Map, tap "Paste" | Back in Trip Map, tap "Paste" |

The link looks like `https://chat.whatsapp.com/…`. The app checks that what was pasted is a WhatsApp group link, and says so if it is not. The guide also says: anyone who has this link can join the WhatsApp group; if it reaches the wrong person, an admin taps "Reset link" in the same WhatsApp menu, and the old link stops working.

The in-app guide above is for the WhatsApp way. The Google Drive way needs no guide: the app does it.

Rules:

- A trip can have only one group on each phone.
- A public trip that becomes a group trip still gets the trip owner's updates, offered as usual (section 3.1). The group's own sites, such as the apartment, are kept on top of it and are never replaced by an update.
- All members are equal. The member who starts the group has no extra rights.

### 9.3 Inviting and joining

Any member can invite, at any time, with no approval step: whoever opens a valid invite and taps Join is in the group. Because the app keeps no member list or IDs, it does not matter who invites, how many invite at once, or in which order people join.

#### Two ways to invite (decided 2026-11-21)

| # | Way | When | Valid | Where the group key goes |
| --- | --- | --- | --- | --- |
| 1 | **In person, with a QR code (recommended)** | The members are together, for example at the airport or at a meeting before the trip | 15 minutes, while the screen is open | Straight from one phone to the other, through the camera. It never goes into WhatsApp or the browser. |
| 2 | **An invite link in the trip's WhatsApp group** | Someone who is not there in person | 15 minutes from when it was made | Inside the link, after the "#" (section 9.6, "How group messages travel") |

What an invite holds, the same in both ways:

| # | Item | Example |
| --- | --- | --- |
| 1 | The group's name and ID | "Barcelona Dec 2026" |
| 2 | The trip's `uid` | `6f1c2a9e-…` |
| 3 | The sharing way, and its address: **either** the WhatsApp group's invite link **or** the Google Drive file's link, never both (decided 2026-11-22) | `https://chat.whatsapp.com/…`, or the Drive file's link |
| 4 | The group key | (hidden) |
| 5 | The expiry time | 15 minutes from when it was made |

This is well under 1 KB. A whole trip does not fit in a QR code, so the trip and the group's sites arrive after joining (below).

#### Inviting in person, with a QR code

1. A member taps "Invite" → **"Show QR code"**. The app draws the QR code on the spot; no service is involved. It is valid for 15 minutes and shown only while that screen is open, so a photo of the screen taken later is useless.
2. The new member opens the app and taps **"Join with QR code"**. The app's own scanner opens the camera. The camera is used only for scanning; no picture is kept.
3. The join screen shows the group's name and "Nothing about you is stored or shared". The new member taps **Join**.
4. **One scan joins both.** With WhatsApp: if the new member is not in the WhatsApp group yet, the app offers "Join the WhatsApp group", and WhatsApp opens on that group. With Google Drive: the app asks the new member to sign in with Google, then opens Google's file picker showing only the group's file, and the member taps **Select** once (section 9.5).
5. If the new member does not have the app yet, the inviter's screen first shows a second QR code, **"Get the app"**, with only the app's address. The new member scans it with the phone's camera, adds the app to the home screen (section 3.1.3), opens it, and then scans the invite QR code from inside the app.

Why in person is safer: the group key never appears in the WhatsApp chat, so it is not in any chat backup or on WhatsApp on a computer, and it never passes through the browser, so it is not in the browser's history. Every share later sent in the chat is locked with a key that exists only inside the members' apps; someone who reads a backup of the chat sees only unreadable links.

The QR code is free, with no outside service: making it uses a small open-source library (for example *qrcode-generator*, MIT), and scanning uses the browser's built-in barcode reader where there is one (Android) or a small open-source library (for example *jsQR*, Apache 2.0) on iPhone. Both are included in the app and listed in the notices file (section 14.1). The app asks for camera permission the first time someone scans.

#### Inviting with a link in the WhatsApp group

```mermaid
flowchart TD
    A["A member taps 'Invite' → 'Send invite link'"] --> B["The app makes the link: the group, the trip's uid, the WhatsApp group's link, the group key; valid 15 minutes"]
    B --> C["The member sends it to the trip's WhatsApp group"]
    C --> D["The invited person opens it. Android: tap. iPhone: Copy, then 'Paste group link' in the app"]
    D --> E["Join screen: group name, 'nothing about you is stored or shared'"]
    E --> F{"The invited person decides"}
    F -->|Join| G["Group added. The trip arrives with the next 'Share with my group' (below)"]
    F -->|"No, thanks"| K["Nothing is stored, anywhere"]
    F -->|"Does nothing"| O["The link expires after 15 minutes"]
```

- The invite screen says "Send this invite only to the trip's WhatsApp group".
- One link can be used by several people, for example everyone in the WhatsApp group, within its 15 minutes. Someone who misses it asks for a new one; after 15 minutes the app shows "This invite has expired. Ask a member for a new one."
- The app recommends copying the link and using **"Paste group link"** in the app rather than tapping it, so that it does not enter the browser's history; on iPhone this is the way it works anyway (section 9.4, "Receiving a shared trip"). If the link is tapped, the app removes the part after the "#" from the address bar as soon as it has read it.
- Someone who declines: nothing about them is stored, on any phone, and the app sends nothing on their behalf. If they want to tell the inviter, they reply in WhatsApp as usual.

#### After joining

With Google Drive, the new member's app reads the group's file straight after the member selects it, and has the whole trip at once; steps 1 and 2 below are not needed.

1. **The inviter taps "Share with my group"** in the trip's WhatsApp group. The app offers it right after each invite.
2. **The new member taps it.** The whole trip, with everything the group added, is added to "My trips". This works the same for every kind of trip: one from the trip list, one built in the app, or one made with AI. A public trip keeps its `uid`, so the new member also gets the trip owner's updates later (section 3.1).
3. **The offline map:** if the group chose an offline area, the app offers "Download the group's offline map: Barcelona centre, 12.4 km², 38 MB. Wi-Fi recommended." The map itself is downloaded from the offline region catalog (section 7.4), not through WhatsApp: it is far larger than the trip, and sending it would only add an upload for the sender.
4. **Nobody else needs to do anything.** There is no "joined" message: the app keeps no member list, so there is nothing to announce. The others see the new person in the WhatsApp group as usual.

#### Someone joins late

WhatsApp does not show a new member the messages sent before they joined, unless whoever added them chooses to share recent messages with them (WhatsApp's "Group message history", up to 100 messages). So a late joiner cannot rely on old invites or old shares. A member gives them a fresh invite (a QR code, or a new link posted after they joined), then taps "Share with my group".

### 9.4 Sharing in the group through WhatsApp

Decision (2026-11-21): the app shares only inside a group, and **every share sends the whole trip**. Everything below travels only to the group's members, through the trip's WhatsApp group, and never reaches the public trips or GitHub.

There are two buttons:

| # | Button | Where | What the others get |
| --- | --- | --- | --- |
| 1 | **"Share with my group"** | In "My trips", in the trip's menu, and on a site card (UI-27) | **The whole current trip:** its sites, legends, and legend entries, everything the group added (for example the apartment), and the group's offline area |
| 2 | **"Share my location"** | In the group trip | A temporary pin, for one moment, not live tracking (below). It is not part of the trip. |

Why always the whole trip (decided 2026-11-21): it is simpler to build and to use than sending only the changes. A member who missed a message, a new member, and a late joiner are all brought up to date by the next share; the order in which messages are opened does not matter; and there is one kind of message to build and test. The cost is size, and trips are small: the Barcelona trip, 32 sites with descriptions and opening hours, is about 6,000 characters as a link, and a WhatsApp message holds over 65,000.

How every share travels:

1. A member adds, changes, or removes sites or legend entries. Each change goes into the trip's JSON on their phone, with the time (section 10).
2. The member taps **"Share with my group"**. The app runs the privacy checks (section 14.2).
3. The app packs the whole trip into a link: compressed (as in a zip file), and locked with the group key. It carries no name and no member ID.
4. The phone's share menu opens. The member picks the trip's WhatsApp group and taps Send. The app never sends anything by itself.
5. The other members tap the link. The app checks it, merges it into their copy (rules below), and shows what changed, for example "1 new site: Café Jansen · 1 changed · 1 removed". The member knows who sent it from the WhatsApp chat.
6. A trip too large for a link is sent as a small compressed file in the same chat; members add it with "Add local trip", which recognizes it as a group share.

```mermaid
flowchart TD
    A["Member adds, changes, or removes a site: it goes into the trip's JSON, with the time"] --> B["Taps 'Share with my group'"]
    B --> C["App checks for private information"]
    C --> D["App packs the whole trip into a link: compressed, locked with the group key"]
    D --> E["WhatsApp opens: the member picks the trip's WhatsApp group and taps Send"]
    E --> F["Members tap the link"]
    F --> G["App unlocks and checks the trip"]
    G --> H["Merges site by site: the newest version of each site wins"]
    H --> I["Shows '1 new site · 1 changed · 1 removed'"]
```

Merging rules:

- **Site by site, by the site's own ID** (not a user ID; there are none). If both copies have the same site, the version with the later `changed` time is kept.
- **A removed site** is kept in the trip as a short "removed" note with its time (section 10), so that a phone that still has the site can tell that it was removed, and not that the sender never had it. A removed note newer than the site removes it; a site changed after the note brings it back.
- **New sites added on a phone** get a random ID, for example `cafe-jansen-7k2m`, so two members adding sites at the same time never pick the same ID.
- **The times come from each phone's clock.** If two members change the same site within a few seconds, the later clock wins. For a trip among friends, this is acceptable.
- A new or changed legend entry is offered to each member, who takes it or skips it. If a member skips it, its sites appear under that legend's "Other" chip.
- Sharing the same trip twice changes nothing the second time.
- A share that does not open with this group's key, or is for a group not on the phone, is not shown.
- The app shows, for each trip, whether there are local changes that have not been shared yet.
- **What is shared in the group stays in the group.** A site marked **"Group only"** (`groupOnly`, section 10), such as the group's apartment, is never included in an update request or a new trip request (section 8.6). Other sites can later be sent to the trip owner in an update request.

#### What happens when several members share (decided 2026-11-21)

Example: Noa, Tamar, and Avichai each share the trip. Noa's has a new site, Café Jansen. Tamar's has the Sagrada Família visit changed to 11:15. Avichai's has Noa's Café Jansen, which he received from her, and his own new site, Bar Marsella. A member opens the three links in this order:

| # | Opened | The trip afterwards | The app shows |
| --- | --- | --- | --- |
| 1 | Avichai's | + Café Jansen, + Bar Marsella | "2 new sites" |
| 2 | Noa's | Café Jansen is already there, with the same time: nothing changes | "Already up to date" |
| 3 | Tamar's | Sagrada Família: 11:15 | "1 changed" |

Opened in any other order, the result is the same trip. Every case:

| # | Case | What happens | Why |
| --- | --- | --- | --- |
| 1 | The links are opened in different orders on different phones | Every phone ends up with the same trip | For each site, only the newest version (latest `changed` time) is kept, whatever the order |
| 2 | A member skips a link | They miss only what was new in it, until that person shares again | Every share carries the sender's whole trip |
| 3 | The same site arrives from two people (one added it, another passed it on) | Kept once | Same site ID |
| 4 | The same version arrives twice | Nothing changes: "Already up to date" | Same ID and time |
| 5 | Two members add the same place by searching | Kept once, automatically | Both get the OpenStreetMap ID, for example `osm-n123456789` (section 10) |
| 6 | Two members add the same place by a long press, or by hand | The app asks: **"Looks like the same place: Café Jansen. Merge or keep both?"** | A similar name within about 30 m. "Merge" keeps the newer details under one ID, and the other becomes a removed note |
| 7 | Two members change the same site | The later change wins, on every phone | The phones' clocks decide |
| 8 | One member removes a site, another changes it | Whichever happened later wins: removed, or kept with the change | The removed note has a time, like a change |
| 9 | A new legend entry arrives, for example "Tapas night" | Each member takes it or skips it | A personal choice. The match code counts only sites and legend entries, not which entries a member skipped |

Joining has no such cases any more: the app hands out no member numbers, so several members can invite at once, and one link in the WhatsApp group can be used by everyone within its 15 minutes (section 9.3).

Not protected: if a phone's clock is wrong by minutes, an older change can win in case 7. Phones set their clocks automatically, so this is rare.

#### Receiving a shared trip

Every share (section 3.1.1, row 7) arrives as a link in the trip's WhatsApp group.

If the app is already installed:

1. **Android:** tapping the link opens the installed app, which adds the trip to "My trips" and opens it.
2. **iPhone:** links from WhatsApp always open in Safari, not in the home-screen app. So the member long-presses the link in WhatsApp, taps **Copy**, opens the app from its icon, and taps **Paste group link** in "My trips". The app adds the trip. If the member taps the link anyway, Safari shows a page that explains these two steps. The same applies to every group link on iPhone, so "Paste group link" is a large button on the main screen.

If the app is not installed yet:

1. The member taps the link. The app opens in the browser and shows the trip at once, so the member can look at it right away.
2. The app explains: "To keep this trip, add Trip Map to your home screen", with the picture guide (section 3.1.3).
    - **Android:** after installing, the trip is already inside.
    - **iPhone:** the guide first offers **Copy group link**; after adding the app to the home screen, the member opens it and taps **Paste group link**. This step is needed because on iPhone the home-screen app does not share saved data with Safari.
3. A member who has not joined the group yet needs an invite (section 9.3) to open its shares.

The same steps apply to every "Share with my group" link.

#### "Share my location"

Decision (2026-11-21): "Share my location" is sent only to the trip's WhatsApp group. Sharing a position with anyone else is not worth the risk, and WhatsApp's own "Share location" already does that.

How it works:

1. The user taps "Share my location" in the group trip.
2. The app shows the user's current position on the map, with the text "This shows where you are now", and asks to confirm.
3. The app prepares a link to the app itself, with the position after the "#" sign, locked with the group key. When a member taps the link, the phone loads the app's page from GitHub Pages, but the part after the "#" is never sent to GitHub.
4. WhatsApp opens. The user picks the trip's WhatsApp group and taps Send.
5. A member who taps it sees a temporary pin on the group's map, labeled with the time it was sent, for example "Shared location, 14:05". The member knows whose it is from the chat. It is not saved, unless that member chooses "Add as site".

How it fits sections 14.2 and 14.3:

- It only happens when the user taps it, confirms, and sends. It is never automatic and never repeated.
- It is a single position at one moment, not live tracking.
- The position is never stored in a trip file, in local changes, in "Export trip", in update requests, or in feedback.
- A received link is checked like any other (section 14.3).

Risks:

- Sending it to the wrong chat. The confirmation step and the user's own choice of chat in WhatsApp reduce this.
- Pressing it at home reveals where one lives, to the people in the chat.

WhatsApp also has its own "Share location", including live location for a set time. The app's version adds the position directly to the map, next to the group's sites.

Limits of sharing in a group:

- The app cannot send a message by itself, or choose the chat. The member taps Send in WhatsApp. Sending automatically is possible only through WhatsApp's paid business service, which does not fit goal 15.
- The app cannot read the chat. Each member taps the link to receive a share.
- Shares are not live. They arrive when someone shares and the others tap the link.

### 9.5 Sharing through Google Drive (option)

Decided (2026-11-22): a group can choose Google Drive instead of WhatsApp when it is created (section 9.2). It is built after the WhatsApp way works, as a supplementary way (step 17a, section 13.3). Then **nothing is sent by hand except the invite**: a QR code in person, or the invite link in WhatsApp, holding the Drive file's link and the group key. After that nobody picks a chat, taps a link, or copies and pastes: all trip data goes through the one shared file in Google Drive, and the members' apps exchange changes by themselves.

What is stored where:

| # | Where | What | Why |
| --- | --- | --- | --- |
| 1 | **Google Drive** | One shared file for the group: the whole trip, locked with the group key. | The meeting point, where phones exchange changes. Google Drive only stores it; it cannot read it |
| 2 | **Each phone** | Its own full copy of the trip, in the app's storage | The trip works without internet, opens at once, and a phone keeps its own changes until it sees them in Drive |

When a phone syncs with Drive, only while it has internet:

1. when the app is opened;
2. when the member makes a change;
3. every minute, while the app is open;
4. when the internet comes back after being offline.

Each sync is the same three steps: **read** the Drive file; **merge** it with the phone's own copy, with the same rules as for WhatsApp (section 9.4); and **write it back only if the phone has something Drive does not**. Nobody is in charge of the file: whoever has something new writes it, and everyone else reads.

Example: four members, at different stages. At the start, Drive holds the base trip (v1), and all four phones have it.

| # | When | What happens | Drive | Reuven | Tamar | Noa | Avichai |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 10:00 | Reuven, online, adds the apartment. His app reads v1, merges, writes | v2: + apartment | + apartment | base | base | base |
| 2 | 10:20 | Noa, offline in the metro, adds Café Jansen. It is saved on her phone only | v2 | + apartment | base | + café | base |
| 3 | 10:30 | Tamar opens the app: reads v2, gets the apartment. Nothing new of hers, so no write | v2 | + apartment | + apartment | + café | base |
| 4 | 10:35 | Tamar changes the Sagrada Família time: reads v2, merges, writes | v3: + apartment, time | + apartment | + apartment, time | + café | base |
| 5 | 10:50 | Noa is back online: reads v3, merges her café, writes | v4: all three | + apartment | + apartment, time | all three | base |
| 6 | 10:51 | Reuven's one-minute check: reads v4, gets the café and the time | v4 | all three | + apartment, time | all three | base |
| 7 | 11:00 | Tamar's check: reads v4, gets the café | v4 | all three | all three | all three | base |
| 8 | Next morning | Avichai's phone was off. He opens the app, reads v4, and gets everything | v4 | all three | all three | all three | all three |

Two members writing at the same moment:

- **The version check.** Drive gives the file a version number. Just before writing, the app checks that the file is still the version it read. If someone else wrote in between, the app reads the new version, merges again, and then writes. Nothing is lost.
- **The rare gap.** If two phones pass the check within the same fraction of a second, one write can overwrite the other. It heals itself: each phone remembers which of its changes it has not yet seen in Drive, and at its next sync (within a minute while the app is open) it merges them in again and writes. A short random wait before retrying stops two phones from colliding again. In the worst case a change appears on the others' phones about a minute later; it is never lost.

"Share my location" with Google Drive (decided 2026-11-22: the hybrid way): **the location still goes through WhatsApp**, exactly as in section 9.4. Only the trip goes through Drive. This keeps the location instant, and the WhatsApp chat shows who sent it, which a Drive file could not show without names. The location is locked with the group key, as in a WhatsApp group, so the members of a Drive group can send it to their own WhatsApp group, or to any chat with the people on the trip.

Privacy:

- Google stores the files, locked with the group key, so it cannot read the trip or the locations.
- The file is open to anyone who has its link, but its content is locked with the group key, and its link travels only inside the group's invite. Google knows which accounts opened it; the members do not see each other's email addresses, and the app never reads or stores them.
- Google access: the app uses Google's narrow permission, which covers only files the app created or that the user picked with Google's file picker, never the whole Drive. This needs no costly Google security review.

Two tests before building it (open questions 17 and 18, section 15):

1. **Opening the group's file.** With the narrow permission, a member gets access to the group's file by picking it once in Google's file picker, shown with only that file. It must be confirmed that this works for a file open to anyone with its link, and that the app can then keep reading and writing it after other members' apps have written it. If not, the fallback is that the starter shares the file in Drive with each member's Google email address.
2. **The version check.** It must be confirmed that Drive can "write only if the file is still version N" in one step. If it cannot, the self-healing above still keeps everyone in step, a little more slowly.

Limits:

- Every member needs a Google account. A group with someone who has none uses WhatsApp.
- Each member signs in with Google once, and picks the group's file once.
- Changes arrive at the next sync, within about a minute while the app is open, not instantly.

### 9.6 Leaving, catching up, and a new phone

- **Leaving:** a member taps "Leave group". The group and its key are removed from that phone; the trip stays as a local trip. No message is needed.
- **Excluding someone:** the others start a new group from the same trip, with a new key, and invite everyone except that person (decided 2026-11-21; replaces removal by vote). Old shares stay readable to anyone who kept the old key, but new ones are not.
- **Catching up:** happens by itself with the next "Share with my group", which always carries the whole trip. Anyone who missed messages can also ask a member to share.
- **A new phone:** the member gets a fresh invite from any member, then a "Share with my group".
- **Checking that copies match:** each phone shows a short code for the group trip's current state, such as "K7P2". The same code means the same trip. If codes differ, a member taps "Share with my group".

How group messages travel (checked against section 14.2):

- **Only inside the trip's WhatsApp group**, sent by a member.
- **Locked twice:** with the group key, and by WhatsApp's own end-to-end encryption.
- **Never seen by a web server:** the data sits in the part of the link after the "#" sign, which browsers do not send to any server. GitHub, which hosts the app, never receives it, and neither does a link preview.
- **Sealed:** the lock used (AES-GCM) also detects any change. A share that was altered, or not made with the group's key, is rejected (section 14.3).
- **Nothing personal inside:** the messages contain sites, times, the group's name, and, in invites, the key and the WhatsApp group's link. No names, member IDs, phone numbers, or contact details.
- **Chat history:** the messages stay in the WhatsApp chat, like any message, and in WhatsApp's backups if a member uses them. If the group was joined by QR code, the key is not in the chat, so a backup holds only unreadable shares. If an invite link was posted, the key is in the chat too, and someone who can read a member's backup could open the shares; WhatsApp's encrypted backup avoids this.

Limits:

- The 15-minute limit on invites is checked by the app; the key inside an old invite does not expire. If an invite may have reached the wrong person, the members start a new group, which gives a new key.
- Without a server, the app cannot change data on another person's phone by itself.
- Members' copies can differ until the next share. Every "Share with my group" brings them back in step, and the match code shows when one is needed.

### 9.7 Decided items

Decided on 2026-11-15, and updated on 2026-11-21:

1. ~~Phone numbers~~: decided, none are stored.
2. ~~Invites~~: decided, valid for joining for 15 minutes (changed on 2026-11-21 from 7 days); one link can be used by several people; a QR code in person is recommended.
3. ~~Removing a member~~: replaced on 2026-11-21. There is no vote; to exclude someone, the others start a new group.
4. ~~The starter's role~~: decided, all members are equal. The starter has no extra rights.
5. ~~Ending a group~~: decided, there is no "end group" for everyone. Each member keeps the trip, or leaves whenever they like. When a member leaves, the trip stays on their phone as a local trip.
6. ~~Group size~~: changed on 2026-11-21: about 8 members, as a recommendation. The app does not count members.
7. ~~Checking that copies match~~: decided, each phone shows a short code for the group trip's current state, such as "K7P2". If codes differ, a member taps "Share with my group".
8. ~~Locked maps~~: no longer applies; locked maps were dropped on 2026-11-21.
9. ~~Release~~: decided, group trips are built last, in release E (section 13.3). Moving them earlier is under discussion.
10. ~~Signed changes~~: replaced on 2026-11-21. There are no member keys or signatures; the group key and its seal (AES-GCM) show that a share came from the group.
11. ~~New group key~~: replaced on 2026-11-21. A new key comes with a new group.
12. ~~Member IDs and names~~: decided on 2026-11-21, none. Membership is having the group key; WhatsApp shows who sent each message.
13. ~~WhatsApp group~~: decided on 2026-11-21, a WhatsApp group of all participants is required, and all sharing goes through it.
14. ~~What a share carries~~: decided on 2026-11-21, always the whole trip, compressed and locked; merged site by site by each site's ID and last-changed time. One "Share with my group" button replaces sharing a site, a legend entry, changes, or everything.
15. ~~Two ways to share~~: decided on 2026-11-22, and "Share my location" always goes through WhatsApp, also in a Google Drive group (the hybrid way); WhatsApp (default) or Google Drive (option), chosen when the group is created (sections 9.2, 9.5). An invite holds either the WhatsApp group's link or the Drive file's link, never both. WhatsApp is built first; Google Drive is added afterwards as a supplementary way.

## 10. Map file format

One JSON file per map.

```json
{
  "formatVersion": "2.0",
  "iconSetVersion": "1.0",
  "revision": 7,
  "uid": "6f1c2a9e-4b7d-4e21-9a3f-2c8d5e7b1a40",
  "id": "barcelona-2026",
  "title": "Barcelona Trip",
  "subtitle": "Dec 10–15",
  "timezone": "Europe/Madrid",
  "copyright": "© 2026 The Trip Map authors",
  "license": "CC-BY-4.0",
  "credits": ["The Trip Map authors"],
  "start": { "lat": 41.3905, "lng": 2.1735, "zoom": 14 },
  "sites": [
    {
      "id": "sagrada",
      "name": "Sagrada Família",
      "lat": 41.4036,
      "lng": 2.1744,
      "icon": "architecture",
      "address": "Carrer de Mallorca 401, 08013 Barcelona",
      "desc": "Booked Fri Dec 11 at 11:15, tower included.",
      "url": "https://sagradafamilia.org",
      "hours": {
        "mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00",
        "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "09:00-18:00",
        "sun": "10:30-18:00",
        "closedDates": ["2026-12-25"]
      }
    }
  ],
  "legends": [
    {
      "id": "category",
      "name": "Category",
      "groups": [
        { "id": "arch", "name": "Architecture", "color": "#7F77DD", "sites": ["sagrada"] }
      ]
    },
    {
      "id": "day",
      "name": "Day",
      "groups": [
        { "id": "d11", "name": "Fri 11", "color": "#E8590C", "sites": ["sagrada"] }
      ]
    }
  ]
}
```

Rules:

- `formatVersion`, `iconSetVersion`, and `revision` follow section 11.
- `uid` is the map's permanent identity: a random code (a UUID) made once, when the map is first created, and never changed, even when the map is renamed, moved, or published (section 8.6.1). Two maps never share a `uid`.
- `id` values are unique, lowercase, with no spaces. The map's own `id` is a readable short name; it is not used to recognize the map, because two people can choose the same name.
- `icon` must be an icon ID from the icon set version named in `iconSetVersion` (section 5.4).
- Every legend group has a `color`. Sites have no color of their own.
- Every site listed in a legend group must exist in `sites`.
- `address` empty: the card shows `lat, lng`.
- `url` empty: the card shows no link line.
- `hours` is optional for every site. A day left out means closed that day. Two periods in one day are written `"09:00-13:00, 16:00-20:00"`. A period that ends earlier than it starts runs past midnight: `"19:00-02:00"` on Friday means open until 02:00 on Saturday morning. `closedDates` lists single closed days. `"hours": "always"` marks a site that is always open, such as a viewpoint or a promenade, and the card shows "Always open". Without `hours`, the hours are unknown and the card shows no hours line.
- `timezone` is the time zone of the map's location. Open or closed is worked out in that time zone.
- **Copyright, license, and credits** (decided 2026-11-21). They are kept inside the trip file, because a JSON file cannot carry a comment line like the notice at the top of a code file (section 14.1), and because trips will later have different owners (section 15.1, "Community trips").
    - `copyright` is the notice exactly as it is shown, for example `"© 2026 The Trip Map authors"`. For trips in the Trips repository today it is always "The Trip Map authors"; with Community trips it names the trip's owner.
    - `license` is the license's standard short code (SPDX). Today it is always `"CC-BY-4.0"`. A trip built mostly from OpenStreetMap data may need `"ODbL-1.0"` (section 14.1).
    - `credits` lists who made the trip, including people whose update requests were approved, if they chose to be named. Anyone can stay anonymous.
    - All three are optional in a local trip. The checker refuses a trip for the Trips repository without `copyright` and `license`.
    - "Request to add this trip" fills them in; the user chooses how to be named, or "anonymous". An AI agent that writes a trip fills them in too (section 10.1).
    - The app shows them on the trip's info screen.
- `verified` is optional. `false` marks a site whose details were made by AI and not yet checked; the card shows "not yet verified" (section 8.4). Left out, the site counts as checked.
- `source` is optional. `"osm"` marks a site whose details came from OpenStreetMap; the card shows the OpenStreetMap credit (sections 8.5, 14.1).
- The order of sites inside a group is the display order. In a Day group it is the visiting order.
- **Fields for group trips** (decided 2026-11-21; section 9.4). All are optional, and none of them names a person:
    - `changed` on a site: when the site was last added or changed, in UTC, for example `"2026-12-11T14:05:00Z"`. Used to keep the newest version when copies are merged.
    - A **removed site** stays in `sites` as a short note, `{ "id": "cafe-jansen-7k2m", "removed": "2026-12-12T09:30:00Z" }`, so that a merge can tell a removed site from one the sender never had. The map and the lists do not show it. Notes older than the trip's last published revision may be cleaned up.
    - `groupOnly: true` on a site: seen only by the group, such as the apartment. It is never included in an update request or a new trip request (section 8.6), and the checker refuses it in a trip for the Trips repository.
    - `offlineArea` on the trip: the group's offline area, as a rectangle, `{ "south": 41.37, "west": 2.14, "north": 41.42, "east": 2.20 }` (section 7.4).
    - **Site IDs for sites added on a phone or by an AI agent** (decided 2026-11-21): a site found through OpenStreetMap's search gets an ID built from its OpenStreetMap number, for example `osm-n123456789`, so that two members who add the same place get the same ID and a merge keeps one site. Any other new site gets an ID made from its name and a short random part, for example `cafe-jansen-7k2m`, so that two different places with the same name never share an ID. An AI agent uses the OpenStreetMap number when it knows it.

### 10.1 AI toolkit

The App repository contains an AI toolkit: the files that let an AI tool help with maps and with the app.

Requirements:

- **Any AI tool.** Creating and editing maps with AI works with any AI tool, not only Claude.
- **Public, at a fixed address.** Everything an AI tool needs is public and can be reached by one address.
- **A map guide** that explains the map format in plain words, with examples and common mistakes. It is written for people and AI tools alike, and states the current format version.
- **A machine-readable description of the format** (a schema), so that editors and AI tools can check a file while writing it.
- **The icon set** as a file, with each icon's ID, name, and the version it was added in (section 5.4).
- **Complete example maps.**
- **The map checker** (section 10.3) and **the format converter** (section 11), usable by people, AI tools, and the automatic checks.
- **An entry point for AI coding tools** in each repository, stating what the repository is, where things are, and the working rules: changes arrive only as change requests, the checks must pass, and only the owner merges and publishes (sections 12.2, 12.3).
- **A description of how the app is built,** for anyone changing it. This document says what the app does. That one says how.
- **The agent does the work, the user only answers.** The toolkit's first instruction to an agent is: ask the user where, when, and what they like (and, if they want, how to group the sites: by day, by type of place, or both); then build the trip, run the checker, fix every error, and give the user the finished file. The user never needs to know the format (section 8.4).
- The app's **"Copy request for AI"** button copies one line with the toolkit's address, for pasting into any AI chat (section 8.4).
- **Every rule for trips, written for agents** (decided 2026-11-21). Every rule in this document about trips, pins, and legends must be followed by an AI agent that writes or changes a trip. Among them:
    - each legend entry has a color, and sites have none of their own (section 5.1);
    - a site in more than three entries of one legend gets a "+N" pin, and the agent says so (section 5.1);
    - every icon is an ID from `icons/icons.json` at the trip's `iconSetVersion` (section 5.4);
    - every site listed in a legend entry exists, and IDs are unique (section 10);
    - every site card's details (section 6): a name; a correct position; the street address when the site has one; a short description written in the agent's own words, never copied from websites or from Google Maps (section 14.1); a link only to an official `https` page; and opening hours only when known from a reliable source, otherwise left out;
    - opening hours in the exact written form, in the trip's time zone (section 10);
    - the trip's `uid` is kept, never changed or invented anew for an existing trip (section 10);
    - the trip has `copyright`, `license`, and `credits`, and the agent keeps the existing ones when it changes a trip (section 10);
    - no personal data in a trip meant for the public trips (section 14.2).
- **A skill for agents.** These rules are packaged as a skill, `skills/trip-author/SKILL.md`, that any agent which supports skills loads before working on a trip (Claude among them), and that other agents can read as plain text. The skill tells the agent to run the checker and fix every error before handing the trip over.
- **One source for the rules.** The rules are written once, in the trip guide and the schema. The skill points to them and summarizes them; it does not keep its own copy, so the guide, the schema, the skill, and the checker never disagree. When a rule in this document changes, the guide, the schema, the skill, and the checker change in the same pull request.
- **Built early.** The trip guide, the schema, and the skill are built in build step 2, together with the checker, so that Claude follows them from the first trip it writes (section 13.3).

#### For advanced users and the app makers: the trip skill

The skill (`ai/skill/`, the same as `skills/trip-author/` in the repository) is not needed for the simple way in section 8.4. It is for:

- **The app makers,** who use it while building and testing, for example to make example trips or to check that the rules still work after a change.
- **Advanced users of Claude,** who can upload it once in Claude's settings (a short picture guide comes with it). After that, Claude knows the trip rules without reading the toolkit from the web, and the user can simply ask, for example, "make me a trip for Lisbon, 4 days, art and food". The user adds Claude's file with "Add local trip".

Both ways give the same kind of trip file, checked by the same checker.

#### The toolkit's public address (decided 2026-11-21)

Everything an AI agent needs to build a trip is public at one address, **`https://projects-rs.github.io/trip-map/ai/`**, served by GitHub Pages from the folder `ai/` of the `trip-map` repository. Gemini, Claude, ChatGPT, and any other AI that can read web pages can use it.

```
trip-map/                 (repository; published at https://projects-rs.github.io/trip-map/)
├── index.html, …         the app
├── llms.txt              a standard "for AI" pointer file at the site's root, pointing to ai/
├── .nojekyll             makes GitHub Pages serve every file exactly as it is
├── icons/                the icons, used by the app (section 5.4)
├── ai/                   the AI toolkit
│   ├── index.md          "Read me first": what a trip is, the steps, and links to the rest
│   ├── trip-guide.md     the rules in plain words
│   ├── trip.schema.json  the exact structure of a trip file
│   ├── icons.json        the allowed icon IDs, copied automatically from icons/icons.json
│   ├── example-trip.json a complete, valid trip
│   ├── skill/            SKILL.md, the same rules as a skill, and a zip file for uploading it to Claude
│   └── checker/          the checker as small scripts (section 10.3)
├── check/                the checker page for people (section 10.3)
└── docs/                 DESIGN.md and other documents for people
```

- **Plain files.** The files are served exactly as they are, not wrapped in web pages, which is what AI agents read best.
- **Short entry page.** `ai/index.md` is short and links to the details, because agents sometimes read only part of a long page.
- **One source.** The rules are written once, in the trip guide and the schema (section 10.1 above). `ai/icons.json` and the summaries in `index.md` and the skill are generated from them by the automatic checks on every merge, so they never go out of step.
- **Stable addresses.** `ai/` is always the latest version. `ai/v2/` stays fixed for format version 2.0, so instructions given for older trips keep working (section 11.1).
- **Where the address is published:** the README of `trip-map`, `llms.txt`, the app's "Copy request for AI" line, the trip list page, and `AGENTS.md` for AI coding tools.

Making the toolkit easy to find for search engines and AI agents (decided 2026-11-21):

- **A real web page.** Besides `ai/index.md` for agents, the toolkit has `ai/index.html`, generated from the same text, with a clear title ("Trip Map: how to make a trip file with AI"), a short description, and structured data that tells search engines what the page is.
- **`robots.txt`** at the site's root allows all search engines and AI crawlers (for example Google, Bing, OpenAI's, Anthropic's, Perplexity's) to read the app's public pages and the toolkit.
- **`sitemap.xml`** lists the toolkit's pages and the trip list, so search engines find them.
- **`llms.txt`** at the site's root, the emerging standard file that AI agents look for, points to the toolkit.
- **The GitHub repository** has a clear description, topics such as "trip-planner", "travel", "ai", and "json-schema", and links to the toolkit in its README.
- **Registered with search engines:** the app owner adds the site once to Google Search Console and Bing Webmaster Tools (free), which also shows whether the pages are found.
- Being found depends on the search engines; these steps make it likely, but cannot guarantee it.

The rest of the toolkit's file layout is described in the repository's README and architecture description, so that it stays in step with the files.

How an AI tool gets a map's readable JSON:

| Situation | How |
| --- | --- |
| A trip from the trip list | Read it directly from the Trips repository |
| A user's own trip, with local changes | "Export trip" in the app, then give the file to the AI tool |
| A new trip | The AI tool writes it from the trip guide and the skill, and runs the checker. The user adds it with "Add local trip". |

### 10.2 Moving map files in and out of the app

Export:

- "Export map" saves the current map as a readable JSON file, or passes it to another app through the phone's share menu.
- The user chooses what to include: the map only, or the map together with their local sites.
- The exported file follows the format in section 10, so an AI tool or a JSON editor can work on it directly.

Open a map file:

- "Open map file" loads a JSON file from the phone into the app. GitHub is not involved.
- The app checks the file first (section 10.3). A file with errors is not opened, and the app lists what is wrong.
- A map opened from a file is a **local map**. It is stored on that phone only and appears in "My maps".
- A local map can be passed on by sending the file itself, for example through a messaging app. The receiver opens it the same way.
- A local map has no owner on GitHub, so it has no proposals, approvals, or update notices. An advanced user can publish it as a public map (section 12.1). The app owner can also publish it as a locked map.

| | Local map | Locked map | Public map |
| --- | --- | --- | --- |
| Comes from | A file opened in the app | A share link | The list of public maps, or a link |
| Stored | On the phone | Locked maps repository, encrypted | Public maps repository, readable |
| Passed on by | Sending the file | Sending the link | Anyone can find it |
| Updates for everyone | No. Each copy is separate. | Yes, after the app owner approves | Yes, after the contributor approves |

### 10.3 Checking a trip file

One set of rules is used everywhere, so that a file accepted in one place is accepted in all.

What is checked:

- The file is valid JSON and has a format version the app can read.
- Required fields are present and of the right kind.
- IDs are unique.
- Every icon ID belongs to the icon set version the map names in `iconSetVersion`.
- Every site listed in a legend group exists.
- Every group has a valid color.
- Coordinates, opening hours, time zone, and links are well formed.
- No private information appears in text fields or links, and in a public map, "Home / accommodation" sites have an approximate location (section 14.2).

The report lists each problem with its location in the file and a plain explanation, for example: group "Fri 11" lists site "sagarda", which does not exist.

Where the check runs (decided 2026-11-21: no server is needed, and no trip file is ever uploaded or stored):

| Place | Who uses it | How |
| --- | --- | --- |
| **In the app** | Everyone | Automatically, whenever a trip is added (trip list, group, "Add local trip", "Paste trip") and before any request is sent. A trip that fails is not added; the app shows the report in plain words and, for a trip made by AI, a ready "please fix" text to paste back to the AI |
| **Checker scripts**, `https://projects-rs.github.io/trip-map/ai/checker/` | AI agents that can run code (ChatGPT and Claude, for example), and advanced users | `check-trip.py` (Python) and `check-trip.mjs` (JavaScript). The agent downloads one and runs it on its own file: nothing is sent anywhere |
| **Checker page**, `https://projects-rs.github.io/trip-map/check/` | People | Paste or open a trip file; the check runs inside the person's own browser. Nothing is uploaded |
| **The schema** | JSON editors and AI agents | Part of the AI toolkit (section 10.1), to check a file while writing it |
| **Automatic check on GitHub** | The Trips repository | Every pull request that adds or changes a trip is checked before it can be merged (goal 10) |

All of them use the same rules, generated from the schema and the trip guide, so a trip accepted in one place is accepted in all.

How AI agents are directed to the check: the toolkit's entry page (`ai/index.md`) and the skill both end with this step:

> **Final step: check the trip before you give it to the user.**
>
> 1. **If you can run code:** download `https://projects-rs.github.io/trip-map/ai/checker/check-trip.py` (Python) or `check-trip.mjs` (JavaScript), and run it on your file, for example `python check-trip.py trip.json`. Fix every error it lists and run it again, until it prints **"OK: the trip is valid"**.
> 2. **If you cannot run code:** go through the checklist below yourself, line by line. Then tell the user: "Add this file in Trip Map with **Add local trip**. The app will check it, and if anything is wrong, it gives you a text to paste back to me." People can also paste it into `https://projects-rs.github.io/trip-map/check/`.
>
> Checklist: every legend entry has a color · every site in an entry exists in `sites` · every `icon` is in `icons.json` · hours written like `09:00-18:00` · `timezone` set · no `uid` (the app adds it) · descriptions in your own words · no names, phone numbers, emails, or exact home addresses.

The checklist is generated from the same rules as the checker, so the two never disagree.

Possible later, only if many agents without code tools need it: an upload address where any agent sends a trip and gets the report back. It would need a small server (for example a free "serverless" function), and would store nothing. It is not part of this version.

## 11. Versioning

Four separate numbers are used. Each answers a different question.

| Number | Where | Answers | Changes when |
| --- | --- | --- | --- |
| Format version | `formatVersion` in each map file | Can this app read this file? | The file format changes |
| Icon set version | In the app's icon set file, and as `iconSetVersion` in each map file | Does this app know all the icons this map uses? | Icons are added or changed |
| Map revision | `revision` in each map file | Has this map's content changed? | A change to the map's content is published |
| App version | Shown in the app's Settings | Which app release is this? | Every app release |

### 11.1 Format version

Written as `major.minor`, for example `"2.0"`.

- **Major** (2.0 → 3.0): a breaking change. An app that does not know the new format would show the map wrongly or fail. Examples: a field is renamed or removed, the legend structure changes, a field's meaning changes.
- **Minor** (2.0 → 2.1): an addition that older apps can safely ignore. Example: a new optional field.

New icons do not change the format version. They change the icon set version (section 11.4).

The test for deciding: would an app that does not know about this change show the map wrongly? If yes, the change is major. If no, it is minor.

How the app behaves:

| Map file compared with the app | Behavior |
| --- | --- |
| Same major, same or older minor | Opens normally |
| Same major, newer minor | Opens. Unknown fields are ignored. |
| Older major | Opens. The app converts the file to the current format when loading. |
| Newer major | Does not open. Shows "This map needs a newer version of the app", with an Update button. |

Process:

- The format changes only when an app feature needs it. The change is decided as part of designing that feature.
- Every change is recorded in the format history below.
- The map guide (section 10.1) states the current format version. An AI tool always writes the current format.

Format history:

| Version | Date | Change | Why major or minor |
| --- | --- | --- | --- |
| 1.0 | 2026-11-14 | First format: sites carry `category` and `day`; legends hold colors | First version |
| 2.0 | 2026-11-14 | Sites own an `icon`; legends are lists of groups, each with a `color`, that refer to site IDs; `id`, `iconSetVersion`, `revision`, `timezone`, `start`, `address`, `url`, `hours` added | Major: the legend structure changed |

### 11.2 Map revision

- A whole number that starts at 1 and goes up by one with every change to the map's content.
- The app compares it with the revision it last saw, to detect "this map was updated" and show what changed.
- When the map owner approves a proposal, the newest file is fetched, the approved sites are added, and the revision is raised by one.
- It describes the map's content only. It is unrelated to the format version.

### 11.3 App version

- Written as `major.minor.patch`, for example `2.1.0`.
- Major: a redesign, or a new format major. Minor: a new feature. Patch: a fix.
- Each app release states the highest format version it reads and the icon set version it carries.

### 11.4 Icon set version

Written as `major.minor`, for example `"1.0"`.

- **Minor** (1.0 → 1.1): icons are added. Existing maps are not affected.
- **Major** (1.0 → 2.0): an icon's meaning changes, or the set is reorganized. This should be rare, because icon IDs are never reused or deleted.

A map's `iconSetVersion` is the icon set version the map was written for. The map may use any icon that existed in that version.

Example: an old map written for icon set 1.2 and a new map written for icon set 2.6 are both opened in an app that carries icon set 2.6.

- The old map shows correctly. Every icon from 1.2 still exists in 2.6, directly or through an alias. The old map does not need to be changed.
- The new map can use every icon up to 2.6.
- If the old map is later edited to use an icon added after 1.2, its `iconSetVersion` is raised at that time. The checking tool reports an icon that is newer than the version the map names.

| Map's icon set version compared with the app's | Behavior |
| --- | --- |
| Same or older | Opens normally. Retired icons are shown through their aliases. |
| Newer minor | Opens. An icon the app does not know shows a default pin, and the app suggests an update. |
| Newer major | Opens with default pins for unknown icons, and the app asks for an update. |

Icon set history:

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-15 | First set: 31 icons |

The checking tool (section 10.3) checks a map's icons against the icon set version the map names.

## 12. Repositories, roles, and access

### 12.1 Repositories

Decision (2026-11-21): three public repositories in the `projects-rs` organization on GitHub. Locked maps and the separate Public maps repository are dropped (section 9).

| # | Repository | Name | Contains | Who approves changes |
| --- | --- | --- | --- | --- |
| 1 | App | `trip-map` | The app, the icon set, the checker page, the AI toolkit (section 10.1), this document | The app owner only |
| 2 | Trips | `trip-db` | All public trips, one file per trip, and the registry for the trip list (below). Content under CC BY 4.0 (section 14.1). | The app owner only |
| 3 | Test | `trip-map-test` | Test versions of the app, test trips, and test data | The app owner; Claude publishes test versions to it directly (section 12.5) |

- All three use the same settings: squash merging only, and a ruleset on the main branch that requires a pull request and lets only the app owner merge (section 12.5). `trip-db` is also left out of GitHub's long-term archive ("Preserve this repository" off), so that a trip removed for privacy reasons is not kept in an archived copy (section 14.2).
- The app owner's access key, used by the app owner's app to open pull requests with approved trips, is limited to `trip-db`. It gives no access to the app.
- Claude's GitHub app is installed on these three repositories only.

How `trip-db` is organized:

- Each trip is stored as one file named by its `uid` (for example `trips/6f1c2a9e-….json`), so a renamed trip keeps its file and its history.
- A registry file lists each trip's `uid`, title, country, city, and dates. The trip list in the app is built from it (section 3.1). The automatic checks update it on every merge.
- `requests.json` lists the result of each request by its random request number: accepted, partly accepted, or not accepted, the date, and an optional short reason. No personal data (section 8.6).
- The repository is published with GitHub Pages at `https://projects-rs.github.io/trip-db/`, where the app downloads trips from.

### 12.2 Who can change the app

Decision: the app has a single owner. Only the owner approves and merges changes, and only the owner publishes a new version. There are no other maintainers.

| Role | Who | Can do |
| --- | --- | --- |
| Owner | The app's owner | Approve and merge changes, publish a new version |
| Anyone else | Any person, including advanced users and map contributors | Propose a change as a change request. Cannot merge. |
| AI agent (Claude) | Works for the owner | Prepares a change and opens a change request. Does not merge (section 12.4). |

Rules for the app's repository:

- Nothing is changed directly. Every change arrives as a change request (a GitHub pull request).
- A change request is merged only after the owner approves it.
- Automatic checks must pass before merging: the app's tests, and the check of the example map and the icon set.
- Merging is not publishing. The version that users receive is published separately, by the owner, as a deliberate step. A merged change therefore cannot reach users by accident.

### 12.3 Access control

Access is controlled in two places: GitHub's own settings on each repository, and the automatic checks. There is no server of our own.

| Who | App | Locked maps | Public maps |
| --- | --- | --- | --- |
| App owner | Approve, merge, publish | The only writer: approves proposals and publishes from the app | Hide or remove a map that breaks the rules. Approve a new contributor's first map. |
| Contributor | Propose (pull request) | No access | Own maps only: change, approve proposals |
| Simple user | Report a problem from the app | Read with a share link, send proposals | Read, send proposals to a contributor they can reach, "Report this map" |
| Claude | Prepare changes and propose (pull request). Review. | No access to the locked files. Works on a readable copy that the app owner exports and gives it. | Run checks and the adaptation tool, and propose |

Settings on GitHub:

- **App repository:** a rule on the main branch requires a pull request, and passing checks (once they exist) before anything is merged. Only the owner can merge: the rule's "Restrict updates" allows changes to main only for the organization admin (the owner). Required approvals are 0, because GitHub does not let anyone approve a pull request that counts as their own; the owner's merge is the approval. Direct changes, deletions and force-pushes are blocked.
- **Test repository:** deletions and force-pushes are blocked; Claude publishes test versions to it directly, without a pull request (section 13.2).
- **Locked maps repository:** only the app owner has write access. The app owner's app publishes to it directly with an access key limited to this repository (section 12.1).
- **Public maps repository:** only the owner has write access. Contributors send pull requests from their own copy. An automatic check accepts a pull request only if it changes the author's own maps and the map passes the checker. The owner then reviews and merges every pull request; nothing is merged automatically.
- **Access keys and tokens** are limited to the one repository they are for, and to the permissions they need.
- **The owner's GitHub account** uses two-step sign-in, with recovery codes kept safe.

### 12.4 Claude as a working tool

- Claude is connected through the Claude GitHub App, installed on the organization with access to the selected repositories only (today `trip-map` and `trip-map-test`). Its commits carry a "Co-Authored-By: Claude" line, and its pull requests say they were made with Claude, so its work is always recognizable.
- Claude can prepare changes on a branch, open pull requests, review pull requests, run the map checks and the adaptation tool, and answer questions about the code.
- Claude cannot merge into the App repository's main branch or publish. The branch rule in section 12.3 lets only the owner update main.
- Claude has no access to account, organization or repository settings, and no keys or tokens.
- Emergency stop: uninstalling the Claude GitHub App in the organization's settings removes all of Claude's access at once.
- Claude is not a maintainer. It works for the owner, and the owner decides.

### 12.5 GitHub setup as built (2026-11-21)

The setup steps, with every setting and its reason, are in the separate "Trip Map: GitHub setup plan (new account)" document.

| Part | As built |
| --- | --- |
| Owner's account | A personal GitHub account on the owner's private email, used only on the owner's private laptop and phone, with nothing connecting it to work. Two-step sign-in with an authenticator app; recovery codes printed. |
| Organization | `projects-rs`, on the GitHub Team plan, owned by that account. Membership private, two-step sign-in required, members cannot create, delete or change the visibility of repositories, only GitHub's own and our own Actions may run. |
| App repository | `projects-rs/trip-map`, public, MIT. Ruleset `Protect main` (section 12.3). Squash merging only. Published at `https://projects-rs.github.io/trip-map/`. |
| Test repository | `projects-rs/trip-map-test`, public, MIT. Ruleset `Protect test`. Published at `https://projects-rs.github.io/trip-map-test/`. |
| Claude | Claude GitHub App on `projects-rs`, only these two repositories. |
| Not yet created | Locked maps repository (build step 6), Public maps repository (release C) |
| Optional later | "Require signed commits" on `trip-map`, kept only if squash merging still works with it. "Require status checks" once the Check workflow exists (build step 2). |

## 13. Implementation plan

This section describes how the app is built and tested, in small steps that can each be tried on a phone.

### 13.1 Roles while building

| Who | Does |
| --- | --- |
| Claude | Writes the code, the automated tests, the map guide, and the documentation. Converts the Barcelona data to the map format. Fixes reported problems. Opens a change request for every step. |
| App owner | Makes the decisions, does the setup steps that need the owner's identity (accounts, repositories, keys), tests each step on a real phone, approves and merges, and publishes. |
| Testers | The trip group. Try the test version on their own phones and report what they find. At least one Android phone and one iPhone. |

What sets the pace is not writing code but decisions, setup, and testing on real phones.

### 13.2 How each step works

1. Claude builds the step and opens a change request in the App repository.
2. The automated tests run (section 13.4). They must pass.
3. The step is published to the **test address**, a separate address used only for testing.
4. The app owner, and testers where useful, try it on real phones, using the step's "Try on the phone" list.
5. Problems are reported to Claude, with a screenshot where possible, and fixed in the same change request.
6. The app owner approves and merges. Publishing to everyone is a separate decision (section 12.2).

A step is done when its automated tests pass, it works on the test address on both an Android phone and an iPhone, and this document is updated where the step changed a decision.

### 13.3 Steps

#### Release A: trip-ready version

Target: ready and field-tested before the Barcelona trip (December 10, 2026). Rough effort with Claude building: one to two weeks, if the app owner can test every day or two.

| Step | Build | Try on the phone |
| --- | --- | --- |
| 0. Setup (done 2026-11-21) | The app owner creates a GitHub account with two-step sign-in, the organization, the App and test repositories, and the test address (section 12.5). The Locked maps repository follows in step 6. The notices file (section 14.1) is added with the first code. Claude is connected to the two repositories. | The test address opens on both phones. |
| 1. App and map | Full-screen map with street names, "My location", the app's icon and name for the home screen | The map loads and moves smoothly. The blue dot appears after allowing location. The app can be added to the home screen. |
| 2. Trip files, the checker, and the trip-author skill | Loading a trip file, the checker with its report and privacy checks, the trip guide, the schema, the trip-author skill (section 10.1), an example trip. The Barcelona trip converted to format 2.0. | "Open map file" opens the Barcelona map. A file with a deliberate mistake shows a clear report. |
| 3. Pins and legends | The icon set file, pin color from the group, pie-chart pins, the "Other" chip, the legend switch, filtering by chips | Switching legends recolors the pins. A site in two groups shows a split pin. Turning a chip off hides its sites. |
| 4. Site card and opening hours | The site card (text shown only as plain text, links limited to https), opening hours with open, closing-soon, and closed marks, native copying, the Share button and "Share a group", the navigation panel with "In another app" (Google Maps, Apple Maps). The "In this app" choice is added in release B. | Status text and pin marks are right at different times of day. Copying and sharing work. Navigation opens in Google or Apple Maps. |
| 5a. Offline maps | The offline region catalog with a Barcelona region built by the automatic check, choosing the area with km² and MB, at most 2 areas on the phone, "Download map for offline use", the offline map display, Settings → Offline maps, the direction and distance to a site without a connection (section 7.4) | In airplane mode, the Barcelona trip shows streets and street names everywhere in its area, all pins and cards, and the blue dot. |
| 5. My maps and local sites | Several maps and switching between them, each map's saved view, the data protections of section 3.3 (persistent storage, restore link, one-tap backup, recovery after a wipe), Add site, search (section 8.5), local sites, local legends and groups, Export map | Searching "Sagrada Família" in Add site fills in its name, address, and location. A search of the user's own map works offline. Two maps can be switched without losing each one's view. An added site survives closing the app. Export produces a file that opens again. |
| 6. Locked maps and share links | Locking and unlocking, publishing from the app owner's app to the Locked maps repository, share links, the first-visit and later-visit flows, the iPhone "Add map" flow, saved copies for offline use, "Share this map", "Start a new map" (empty) | A share link sent to each tester opens the Barcelona map on their phone, also from the home-screen app on iPhone. The map opens without a connection after the first visit. A forwarded link opens the same map on a third phone. |
| 7. Updates, feedback, and field test | The browser security policy (section 14.3). Automatic app updates with the "New version available" notice. Settings → About with the notices list. "Send feedback" in its first form: a prepared message through the phone's share menu (section 13.5). A walk-through of the whole app. | An update reaches all phones. The app owner walks a route in their own city with the app, on both phone types. |

Not in release A: in-app turn-by-turn navigation, proposals to the map owner, error reports, public maps, "Create a map with AI", the full AI toolkit, and group trips.

Fallback: the trip is 25 days after this plan was approved, and setup finished on November 21, leaving 14 days. If release A is not field-tested by December 5, 2026, the trip uses version 1 and the map already published for it, and release A continues after the trip.

On the trip, each member adds sites locally. To pass them on, a member uses "Export map" with their local sites and sends the file through WhatsApp. The others open it with "Open map file", as a separate local map (section 10.2). Putting sites from several members into one shared map is an open gap, for later (section 15, open question 11).

#### Release B: in-app navigation

| Step | Build | Try on the phone |
| --- | --- | --- |
| 8. Route | Walking route on the app's map, with distance and time, from the "In this app" choice | A route is drawn from the blue dot to a site. |
| 9. Turn by turn | Follow mode, the turn-by-turn banner and step list, re-routing, the arrival message, keeping the screen on | On a real walk, the banner gives the right turns, and leaving the route triggers a new one. |
| 10. Voice | Spoken directions with an on/off button | Directions are spoken on both phone types, with the screen on. |

#### Release C: proposals, reports, and public maps

| Step | Build | Try on the phone |
| --- | --- | --- |
| 11. Proposals for locked maps | "Send my changes" through WhatsApp, "Pending proposals", approval and rejection in the app owner's app, publishing after approval, "Tell the group" | A tester sends a site through WhatsApp. The app owner approves it. All phones show the site and the "Map updated" notice. |
| 12. Reports | Error reports with consent, sent through the share menu (section 13.5) | An error report reaches the app owner. |
| 13. Public maps | "Publish as a public map" with the contributor's access key, pull requests from the app, the registry, the automatic checks and merging in the Public maps repository, the list of public maps, "Report this map" | A second person publishes a public map, and updates it. A report of a map reaches the app owner. |

#### Release D: AI toolkit

| Step | Build | Check |
| --- | --- | --- |
| 14. Toolkit and "Create a map with AI" | The full map guide, the schema, the entry-point files for AI tools, the architecture description, the Claude skill, "Copy request for AI", the format converter, "Paste trip" and the "not yet verified" mark (section 8.4) | A new map made by an AI tool other than Claude, from the toolkit alone, passes the checker and opens in the app. A simple user makes a trip by asking a free AI chat and pasting the answer. |

#### Release E: group trips

Decision (2026-11-15, confirmed by the app owner): group trips (section 9) are the last feature to be built, because they are the most complex part of the app. Release E starts only after releases A to D are published.

| Step | Build | Try on the phone |
| --- | --- | --- |
| 15. Starting and joining | "Start a group" with the WhatsApp guide and the WhatsApp group's link, the group key, QR invites (15 minutes) and invite links (15 minutes, several people), joining and declining, the internal database for group details | A group of four is started. Members join by QR code and by a link in the WhatsApp group. A person who declines leaves no trace. |
| 16. Sharing in the group | "Share with my group" (always the whole trip, compressed) through WhatsApp, "Share my location" (section 9.4), the seal on every share (AES-GCM), merging, taking or skipping new legend entries, "3 new sites added", privacy checks on both sides, the match code | A site shared in the group chat appears on the other phones after tapping the link. The same link tapped twice adds nothing twice. |
| 17a. Google Drive sharing (built after steps 15 to 17 work with WhatsApp, and after the two tests, section 9.5) | "Share through Google Drive" when starting a group, Google sign-in with the narrow permission, the group's shared trip file (locations stay on WhatsApp), sync on open, on change, every minute, and when back online, the version check and self-healing | Four phones, two of them offline for a while, end with the same trip. Two phones changing at the same second both keep their changes. |
| 17. Leaving and catching up | "Leave group", catching up with the next share, a new phone with a fresh invite, a new group to exclude someone | A member who leaves keeps the trip as a local trip. A share altered by one character is rejected. A new phone gets everything shared so far. |

Rough effort for releases B to E together: about four to five weeks, mostly set by testing on real phones. These are planning estimates, not promises.

### 13.4 Testing

Automated tests run on every change request and must pass before merging:

- **Unit tests** for the logic that is easy to get subtly wrong: the map checker, opening hours (time zones, daylight saving time, hours past midnight, closed dates), pin colors and pie-chart segments, legend filtering, the format converter, the icon set version rules, and locking and unlocking a map.
- **Browser tests** that walk through the main screens at phone size, in both Chrome's engine and Safari's engine: open a map, switch legends, filter, open a card, add a site, export.
- **Map checks:** the example maps and the icon set file are checked with every change.
- **Security tests** (section 14.3): harmful content in every field, broken and oversized links and messages, and the browser security policy.
- **A security review before each release** (section 14.3).

Testing on real phones is required for each release, because GPS, voice, home-screen install, sharing to WhatsApp, and iPhone's storage rules only behave truly on a device:

- Each release has a short checklist, run on at least one Android phone and one iPhone.
- Each release is used first on the test address, and published to everyone only after the checklist passes.

Usability:

- Give the app to someone who was not involved, without explanation, and watch where they hesitate.
- Check large tap targets, text that is readable in bright sunlight, and one-handed use while walking.
- Check the app with the phone's larger text setting.

### 13.5 Feedback and error reports

- **"Send feedback" in the menu.** The user writes a message. The app adds technical details: the app version, the phone type, and the browser. The user sees everything that will be sent before sending it.
    - The message opens in the phone's share menu, ready to send to the app owner by WhatsApp or email. The app owner's feedback address is shown in the app: a dedicated email address for the app, not the owner's personal one.
    - Advanced users can also report a problem directly as an issue in the App repository.
- **Error reports, with consent.** When something fails, the app records the error on the phone and offers to send it, through the same share menu. Without a server, sending is never fully automatic: the user sees the report and taps Send.
- **Privacy.** Feedback and error reports never include the user's location, their local sites, or the content of a locked map.
- **Map problems are not app problems.** A report such as "this restaurant has closed" is sent to the map owner as a proposal (section 8.6). The feedback screen points users to the right place.

### 13.6 Documentation

Every part of the project is documented, so that the app owner, testers, contributors, and AI tools can understand it without asking.

| Document | Where | Explains |
| --- | --- | --- |
| README | App repository, first page | What the app is, who it is for, how to open it, how to make a map, how to contribute, the license, and links to the other documents |
| This design document | App repository | What the app does, and why |
| Architecture description | App repository | How the app is built, and how its parts work together (section 10.1) |
| Dependencies and notices | App repository, and Settings → About in the app | Everything the app relies on, as listed below, with each license and credit (section 14.1) |
| Map guide | App repository | How to write a map file (section 10.1) |
| Contribution guide | App repository and Public maps repository | How to propose a change or contribute a map, and the rules that apply (section 12) |
| Help in the app | Inside the app | Short, plain explanations on the screens where they are needed, such as the welcome note and the iPhone install guide (section 3.1) |
| Comments in the code | Every code file | See below |

Comments in the code:

- Every code file starts with the license notice (section 14.1), and a short comment that says what the file is for.
- Every function has a short description of what it does, what it receives, and what it returns. JavaScript uses the standard JSDoc form, which editors and AI tools can read.
- Where the code follows a rule from this document, the comment names the section, for example "Pie-chart pins, DESIGN.md section 5.1".
- Comments explain why, not only what, wherever a choice is not obvious.
- The automated checks warn when a function has no description.

#### Everything the app relies on

This list is kept up to date in the dependencies document. An item marked "to be chosen" is decided in the step that first needs it.

| Kind | Item | Used for | Cost | License or terms |
| --- | --- | --- | --- | --- |
| Library | Leaflet | Showing the map, pins, and routes | Free | BSD-2, open source |
| Icons | Material Design Icons (Pictogrammers) | The icon set | Free | Apache 2.0 (a few icons under their own licenses) |
| Map data | OpenStreetMap | Streets, names, and the data behind routes | Free | ODbL, credit required |
| Online service | OpenStreetMap tile server | Map images | Free | Tile usage policy: light use only |
| Online service | FOSSGIS routing server (OSRM) | Walking routes | Free | Usage terms: one request per second, no heavy use |
| Online service | OpenStreetMap search service (Nominatim) | Searching places, streets, and addresses (section 8.5) | Free | Usage policy: at most one request per second for the whole app, no search-as-you-type, credit required. Fallback: another search provider. |
| Online service | GitHub and GitHub Pages | Storing the code and maps, hosting the app | Free | GitHub terms of service |
| Other apps | WhatsApp, or another messaging app | Carrying group changes, proposals, invites, and feedback (sections 8.6, 9) | Free | Used through the phone's share menu. The app's messages are locked before they leave the phone. |
| Other apps | Google Maps, Apple Maps, and other navigation apps | "Navigate in another app" (section 7.1) | Free | Opened by a link only. No data is copied from them. |
| Browser features | Location, speech, keeping the screen on, encryption, offline storage, the share menu | GPS position, spoken directions, navigation, locked maps, saved maps, sending messages | Built in | Standard web features of the phone's browser |
| Development tool | Automated browser testing tool, for example Playwright | Browser tests (section 13.4) | Free | Apache 2.0 |
| Development tool | JSON Schema checker | The map checker (section 10.3) | Free | To be chosen in step 2, with a permissive license |
| Development tool | Claude | Writing code, tests, and documents | Paid subscription | Anthropic's terms |

Rules:

- Nothing is added to this list without a reason, and every item has a known license or terms of use.
- Each online service has a known fallback, so that the app is not stuck if a free service changes its terms. For example, another map image provider, or running a routing server of one's own.

## 14. Licensing, rights, and privacy

This section is a design guide, not legal advice. Before the app and the Public maps repository are opened to people outside the trip group, the app owner should have it checked by someone qualified.

### 14.1 Respecting other people's rights

Principle: the app uses only components and data whose licenses allow it, follows every condition of those licenses, and gives visible credit.

| Component | Used for | License or terms | What the app must do |
| --- | --- | --- | --- |
| OpenStreetMap data | The street map | Open Database License (ODbL) | Show "© OpenStreetMap contributors" on the map, with a link to OpenStreetMap's copyright page |
| OpenStreetMap tile server | Map images | OpenStreetMap tile usage policy | Light use only. No bulk downloading or pre-loading of areas for offline use; only the browser's normal caching. Heavy use may be blocked without notice. If the app grows beyond light use, switch to another tile provider. |
| FOSSGIS routing server | Walking routes | FOSSGIS usage terms | At most one request per second, no heavy use, credit with a link to report map errors. The app limits how often it asks for a new route, including when re-routing. |
| OpenStreetMap search service (Nominatim) | Searching places and addresses | Nominatim usage policy | At most one request per second for the whole app, no search-as-you-type, identify the app, show credit. Results kept on the phone to avoid repeated searches. |
| Leaflet | Map display code | BSD-2 | Keep its license notice |
| PMTiles and its Leaflet reader (Protomaps) | Reading the offline map files (section 7.4) | BSD-3 | Keep their license notices |
| The source of the offline map data | Building each trip's offline map file | To be checked in build step 5a: OpenStreetMap data (ODbL) prepared in PMTiles form | Credit "© OpenStreetMap contributors" and the provider, on the map and in Settings → About |
| Material Design Icons (Pictogrammers) | The icon set | Icons under Apache 2.0, a few under their own licenses | Keep the license text and notice. Check the license of each icon in the set before each release. |

Rules:

- **A notices file.** The App repository has a dependencies and notices file (section 13.6) listing every outside component, its source, its license, and its license text. The app shows the same list under Settings → About.
- **New components only with a compatible license.** A new outside component is added only if its license is permissive and compatible with the app's own license. An automatic check on every change request lists the licenses of all components and stops the merge if an unknown or incompatible license appears.
- **No copied code.** Code is written for this project, or taken from a component under its license. Claude is instructed not to copy code from other projects.
- **The app's own license.** Decision (2026-11-15): the app is published under the **MIT license**. The license file is added before the App repository becomes public.
- **A license notice in every file.** Every code file of the app starts with a short notice: the copyright line, "Copyright (c) 2026 The Trip Map authors", and the license name, in the standard short form `SPDX-License-Identifier: MIT`. The automated checks stop a merge if a code file has no notice. Files from outside components keep their own notices (section 13.6).
- **Contributions to the app.** Anyone who sends a change request agrees that it is published under the app's license. This is stated in the repository's contribution guide.
- **The name.** Before the app is announced publicly, check that "Trip Map", or the final name, is not a registered trademark of someone else.

Data in maps:

- **Write in your own words.** Descriptions are written by the map's author. They are not copied from websites, guidebooks, or review sites.
- **Never copy from Google Maps.** Its place data, descriptions, reviews, opening hours, and photos may not be copied into maps.
- **OpenStreetMap data.** Facts such as addresses and opening hours may be taken from OpenStreetMap. A map that does so must credit "© OpenStreetMap contributors", and a public map built substantially from OpenStreetMap data may have to be shared under the ODbL. The map guide explains this.
- **No photos** are part of the map format, so no image rights arise.
- **Public map content.** When publishing, the contributor confirms that they have the right to share the map's content, and that it is published under the **CC BY 4.0** license: anyone may reuse it, with credit to the contributor. The notice is kept in the trip file itself, in its `copyright`, `license`, and `credits` fields (section 10).

### 14.2 Keeping private information out of maps

Principle: no map, locked or public, contains private information. A locked map is protected from outsiders, but its share link can be forwarded, so the same rule applies to both. The one exception, decided by the app owner, is the location of a "Home / accommodation" site in a map only the group sees (layer 2 below).

Private information includes:

- People's home addresses, and the exact location of someone's home.
- Phone numbers, email addresses, and names of private people. (Group trips store no phone numbers, and members' names never leave their phone: section 9.)
- Booking and confirmation codes, ticket numbers, door, key-box, and safe codes, and Wi-Fi passwords.
- Payment card numbers, bank details, and passport or identity numbers.
- Links that carry personal tokens, such as a link to a personal booking page.

No single measure can guarantee this, because descriptions are free text. The app therefore uses several layers:

| Layer | What it does |
| --- | --- |
| 1. The format | The map format has no fields for personal data: no phone, email, or people's names. |
| 2. Home locations | A site with the "Home / accommodation" icon may have its exact location in locked maps, group trips, and local maps, which only the group sees. Because a locked map's link can be forwarded, the review before publishing (layer 4) reminds the owner that the exact location is included. In a public map, it is always stored with an approximate location, rounded to about 150 m, and the checker blocks an exact one. |
| 3. The checker | The map checker (section 10.3) scans every text field and link for private information: email addresses, phone numbers, card and bank numbers, identity numbers, codes next to words such as "booking", "door", "code", or "password", and links with personal tokens. A finding is either an error, which blocks publishing, or a warning, which the person publishing must confirm one by one. |
| 4. Review before publishing | Before any map is published, locked or public, the app shows all of its text and the checker's findings, and the person publishing confirms. |
| 5. Proposals | Sites proposed by other users pass the same checks before they reach the map owner, and again before approval. |
| 6. The AI toolkit | The map guide tells AI tools never to include private information, and to run the checker before handing a map back. |
| 7. Public map oversight | The app owner reviews a new contributor's first map (section 12.1). Anyone can tap "Report this map". The app owner can hide a map at once. |
| 8. Reports and feedback | Feedback and error reports never include the user's location, local sites, or map content (section 13.5). |

Location and other data sent to outside services:

- The user's GPS position stays on the phone, with four exceptions that the app explains when location is first used:
    - **In-app walking routes** send the start point (the user's position) and the destination to the routing server (section 14.1), which keeps the request in its log.
    - **Map images** are requested from the map image server for the area being viewed, which reveals roughly where the user is looking.
    - **Searching OpenStreetMap** sends the search words and the area shown on the map to OpenStreetMap's search service (section 8.5).
    - **"Navigate in another app"** hands the destination, and the app's own location access, to Google Maps, Apple Maps, or the chosen app, under that company's privacy terms.
- Nothing else about the user, their maps, or their group is sent anywhere, except what the user chooses to send themselves through a messaging app: a shared site or group, a shared location, a proposal, group changes, or feedback (sections 9, 8.6, 13.5).

Limits of removal:

- **Prevention is the main protection.** Once something is published, it may already have been seen or copied.
- **Public maps.** GitHub keeps the history of every file. Removing private information that was published means rewriting the repository's history and asking GitHub to clear its cached copies. Copies that others made cannot be recalled. The app owner has a written procedure for this.
- **Locked maps.** Old versions stay encrypted in the repository's history, and anyone with an old share link could read an old version. Decision: the Locked maps repository keeps only the latest published version of each map, so old versions cannot be read later. Exports serve as backups (section 10.2).

### 14.3 Security

Principle: the app must be safe to use. Nothing a user receives, whether a map, a link, a shared change, or an app update, may harm the user's phone or expose their data.

What the app can and cannot reach:

- The app runs inside the phone's browser, in the browser's protective sandbox. It cannot read the phone's files, photos, contacts, messages, or other apps, and it cannot install anything.
- It can reach only what the browser allows: location, after the user agrees, and its own storage on the phone.
- So the worst case of a successful attack on the app is limited to the app's own data on that phone, such as maps, local sites, group details, and keys. That data is still worth protecting, and the measures below do so.
- WhatsApp protects messages while they travel. It does not protect the app from harmful content inside a message. The app protects itself, whatever way the content arrives.

Threats and protections:

| Threat | Protection |
| --- | --- |
| A harmful map, link, or shared change that tries to run code inside the app | Everything received is checked against the format before use (section 10.3). Text is always shown as plain text, never as code. A strict browser security policy forbids running any code that is not part of the app. Size limits on everything received. |
| A link on a site card that leads somewhere harmful | Only ordinary web links (https) are allowed. The card shows the link's address before it is opened. |
| Someone outside the group reading or faking group messages | Every message is locked and sealed with the group key. A message that fails the seal is rejected. |
| A share that was altered, or made by someone outside the group | Every share is locked and sealed with the group key (AES-GCM). A share that does not open with the key, or was changed, is rejected. Members are not told apart; WhatsApp shows who sent each message (decided 2026-11-21, section 9). |
| A harmful app update reaching all users | Only the app owner can publish (section 12.2). Two-step sign-in on the owner's GitHub account. Every change is reviewed and tested before merging. Outside libraries are stored in the App repository at fixed versions, not loaded from other websites. |
| A known weakness in an outside component | Automatic alerts for known weaknesses in the components the app uses, and prompt updates. |
| Someone using an unlocked phone | The app relies on the phone's own screen lock. An optional app lock with the phone's fingerprint or face check, where the browser supports it. |
| Keys or messages kept in WhatsApp chat history or WhatsApp backups | QR invites keep the key out of the chat. Members are told this when joining, with a tip to turn on WhatsApp's encrypted backup. A new group, with a new key, stops anyone holding an old invite from reading new messages (section 9.6). |
| Data lost or damaged on a phone | Saved data is checked when it is loaded. Export gives a backup (section 10.2). |

Process:

- **Security tests** are part of the automated tests: harmful content in every text field, broken and oversized links and messages, and checks that the security policy is in place.
- **A security review before each release,** by a reviewer who did not write the code: a separate Claude session with only this section and the code. Its findings are fixed before publishing.
- **A human security expert** reviews the app once before it is opened to the public. This may cost money (decided 2026-11-15).
- **Reporting a weakness:** the App repository says how to report a security problem privately to the app owner, and promises a reply.
- **No absolute guarantee.** No app can promise to be completely safe. These measures make an attack hard and limit the damage if one happens.

### 14.4 Security checklist

For the app owner, when setting up (once):

1. **GitHub account:** a strong, unique password kept in a password manager, and two-step sign-in with an authenticator app, not text messages.
2. **Recovery codes:** GitHub's recovery codes kept somewhere safe and offline.
3. **Email account** linked to GitHub: two-step sign-in, since it can reset the GitHub password.
4. **Repository settings:** branch rules, security alerts for outside components, and warnings for keys pushed by mistake, turned on with Claude's step-by-step guide.
5. **Claude account:** a strong password. Every few months, check which apps have access to GitHub, and remove those no longer used.

For the app owner's devices:

6. **Phone:** screen lock with a PIN, fingerprint, or face, since it holds the key for publishing locked maps. Phone and browser kept updated.
7. **Computer** used for GitHub: updated, with a screen lock.

For every change:

8. Merge only when the automated tests pass.
9. Read Claude's summary of the change. Ask for an explanation of anything that touches security (keys, links, the security policy) before merging.
10. Never turn off the branch rules, not even once.
11. Never put a password or key in the repository.

For every release:

12. Test on the test address, on an Android phone and an iPhone.
13. Run the security review (section 14.3), and fix what it finds.
14. Publish deliberately, at a time when problems can be watched and fixed.

Ongoing:

15. Act on GitHub's security alerts: ask Claude to update the component and publish a fix.
16. Answer reports of weaknesses.
17. Keep backups of the repositories and exported maps.
18. Never give anyone, including Claude, the GitHub password or the publishing key.

If something goes wrong, follow a one-page plan kept in the App repository:

19. Change the GitHub password and sign out all sessions.
20. Replace the access keys.
21. Publish the last good version again.
22. Tell the users through WhatsApp.

For users (shown in the app's help):

- Open the app only from its official address. A look-alike address may be a fake copy.
- Tap map and group links only from people you know.
- Turn on two-step verification in WhatsApp.
- Keep the phone locked and updated.

## 15. Open questions

1. ~~Navigation panel~~: decided, the app always asks (section 7.1).
2. ~~Icon 14~~: decided, it stays "History / monument" and also covers archaeological sites.
3. ~~After approval~~: decided, an approved site becomes a regular map site, and the sender's local copy is removed (section 8.6).
4. ~~Sharing extras~~: decided, both "Share a group" and "Share my location" are included (section 9).
5. ~~New groups~~: decided, users can add local legends and groups in the app (section 5.3).
6. ~~New contributors~~: decided, a new contributor's first map waits for the app owner's approval (section 12.1).
7. ~~App license~~: decided, MIT, with a license notice in every code file (section 14.1).
8. ~~Public map content license~~: decided, CC BY 4.0 (section 14.1).
9. ~~Accommodation location~~: decided, "Home" and "Accommodation" are one icon, "Home / accommodation". Its exact location is fine in maps that only the group sees, and approximate in public maps (section 14.2).
10. ~~Locked map history~~: decided, keep only the latest version of each locked map (section 14.2).
11. **Combining members' sites during a trip (open gap):** release A has no way to put sites added by several members into one shared map. Members pass whole maps as files instead. Later options: proposals to the map owner (release C) or group trips (release E).
12. ~~Icon details~~: decided, the underground station shows a train in a tunnel. Decided: the transport icon became "Airport" (airplane, now icon 17), and a new icon "Ferry" (boat, now icon 31) is added. "Home" and "Accommodation" are merged into one icon (open question 9). After the merge the set has 31 icons, numbered as in section 5.4.
13. ~~Members' display names~~: replaced on 2026-11-21: there are no member numbers or names at all; WhatsApp shows who sent each message (section 9).
14. ~~Security review~~: decided, a separate Claude session before each release, and a human security expert before the app is opened to the public (section 14.3).
15. ~~Security checklist~~: decided, section 14.4. The copyright line is "The Trip Map authors" (section 14.1).
16. **A distinctive name (open):** "Trip Map" is a common name, so a web search for "Trip Map app" may not find our AI toolkit. Before the app is announced, choose a name that a search finds uniquely, and check it as in section 14.1. Then "Plan a trip for the <name> app" works by itself (section 8.4).
17. **Google Drive test 1 (open):** confirm that, with Google's narrow permission, a member who picked the group's shared file once can keep reading and writing it after other members' apps have written it (section 9.5).
18. **Google Drive test 2 (open):** confirm that Drive can write a file only if it is still a given version, in one step (section 9.5).

Approved: simple users can add local sites and send proposals (section 2.1).

### 15.1 Ideas raised on 2026-11-15

Three ideas raised during the design, and what was decided about each.

**A. "Create a map with AI".** Accepted on 2026-11-15. Now section 8.4.

**B. Live group trips: editing together through a server.** Postponed on 2026-11-15. Group trips that share changes through messages (section 9) are used instead. Live group trips may be added later, only if they turn out to be needed. The full proposal is kept in the file `group-maps-proposal.md` next to this document. Reconsidered on 2026-11-21, when the manual WhatsApp steps felt frustrating: decided to keep group trips fully on WhatsApp, with no server.

**C. A server of our own (relay service).** Removed on 2026-11-15. The app works without one: proposals, invites, and feedback travel through WhatsApp or another messaging app, and public map contributions arrive as pull requests. A server would be needed only for: live group trips, phone notifications when the app is closed (not needed, decided 2026-11-15), fully automatic error reports, and proposals to contributors the user does not know (not needed, decided 2026-11-15). If one of these becomes necessary, a server can be added later (for example Cloudflare Workers, free plan; see `group-maps-proposal.md`).

**D. Community trips: a repository where each contributor owns their trips.** Raised on 2026-11-21, for later. A separate repository, next to `trip-db`, where each contributor owns their trips and approves update requests for them. The app owner keeps only a safety role: hiding or removing a trip that breaks the rules. The trip list in the app would show both, marked by where each trip comes from. The `uid`, the request flow (section 8.6), and the `copyright`, `license`, and `credits` fields (section 10) already work for this, so nothing built now has to change.

## 16. Version history

| Version | Date | Change |
| --- | --- | --- |
| 1 | 2026-11-14 | Built: basic map, two legends, GPS position, walking route, buttons to Google and Apple Maps |
| 2 (design) | 2026-11-14 | Site-owned pins, icon set, site card, in-app navigation |
| 2 (design) | 2026-11-14 | App separated from trips; sharing, Add site, local sites, map sync with owner approval, automatic app updates |
| 2 (design) | 2026-11-14 | Notifications after approval; versioning (format version, map revision, app version) |
| 2 (design) | 2026-11-14 | Decided: maps readable only by the users they were shared with (locked map files) |
| 2 (design) | 2026-11-14 | Decided: nothing preinstalled for users; proposals through a relay service with one-tap approval in the app |
| 2 (design) | 2026-11-14 | Opening hours for all sites, with closed and closing-soon marks; pin color comes from the legend group, with pie-chart pins |
| 2 (design) | 2026-11-14 | Legends belong to the map, not the app; map files can be exported, opened directly in the app, and checked |
| 2 (design) | 2026-11-14 | Icon set extendable and versioned; grown to 31 icons (maximum 50) in a solid style; no private icons per map |
| 2 (design) | 2026-11-14 | First-visit and later-visit flows; switching between maps; saved copies of removed maps; single app owner |
| 2 (design) | 2026-11-14 | Repositories for the app, locked maps, and public maps; public maps controlled by their contributors |
| 2 (design) | 2026-11-14 | Two kinds of user; contributors sign in with GitHub; access control; Claude as a working tool; AI toolkit; "Map sources" removed |
| 2 (design) | 2026-11-14 | Coherence review: terms defined (locked, public, local map; app owner, map owner); goals updated; governance moved to section 13; contradictions resolved |
| 2 (design) | 2026-11-14 | Implementation plan with testable steps and a trip-ready release; testing; feedback and error reports (section 14) |
| 2 (design) | 2026-11-14 | Licensing and rights of others; keeping private information out of locked and public maps (section 15) |
| 2 (design) | 2026-11-14 | Documentation plan, code comments, and the list of everything the app relies on (section 14.6) |
| 2 (design) | 2026-11-15 | Decided: "Create a map with AI" wizard for simple users (section 9.3).  |
| 2 (design) | 2026-11-15 | Decided: group members share local sites through WhatsApp or another messaging app, with no server (section 10.8). Live group trips on the relay postponed. |
| 2 (design) | 2026-11-15 | Group trips: details stored, starting, inviting, joining, declining, sharing, leaving, with flowcharts (section 10.9) |
| 2 (design) | 2026-11-15 | Privacy check of group trips: no phone numbers in invite links, data only after the '#', author names removed when sites leave the group. Location data sent to outside services listed. Security section added (section 15.3). |
| 2 (design) | 2026-11-15 | Group trips: no phone numbers stored; members identified by member numbers, with personal names kept on each phone only; group details in the app's internal database (section 10.9) |
| 2 (design) | 2026-11-15 | Decided: no server of our own (no Cloudflare). Proposals and feedback through WhatsApp; public map contributions as pull requests; phone notifications dropped (sections 10.4, 10.5, 10.7, 13.3, 14) |
| 2 (design) | 2026-11-15 | Group trips moved to the last release (release E). Proposals to strangers' public maps and phone notifications not needed. |
| 2 (design) | 2026-11-15 | Release A keeps proposals out: members pass maps as files (Export map, Open map file). Combining members' sites left as an open gap (open question 11). |
| 2 (design) | 2026-11-15 | Decided: users can add local legends and groups in the app; in group trips each member chooses whether to take them (sections 5.3, 10.8) |
| 2 (design) | 2026-11-15 | Icons: underground station as a train in a tunnel, icon 18 renamed Airport, new icon 32 Ferry. Decided: "Share a group" through WhatsApp (section 7). |
| 2 (design) | 2026-11-15 | Decided: "Share my location"; "Home" and "Accommodation" merged into one icon, exact location allowed in maps only the group sees (sections 5.4, 7, 15.2) |
| 2 (design) | 2026-11-15 | Search added: the user's own map, and OpenStreetMap places, streets, and addresses, mainly for Add site (section 9.4). Navigation panel always asks. |
| 2 (design) | 2026-11-15 | Group trips: approved sites replace the sender's copy; first public map waits for approval; names kept on each phone; invite links valid 7 days; all members equal, removal by vote (sections 10.4, 10.7, 10.9) |
| 2 (design) | 2026-11-15 | Decided: signed changes and votes; MIT license with a notice in every code file; new group key after leaving, match code, CC BY 4.0 for public maps, latest-only locked map history. |
| 2 (design) | 2026-11-15 | Decided: security review by Claude before each release and a human expert before going public. Security checklist added (section 15.4). |
| 2 (design) | 2026-11-15 | All proposals approved by the app owner. Confirmed: group trips are the last feature (release E). Second coherence review: new group key locked per member; proposals can carry notes on existing sites; `verified` and `source` fields; every feature placed in a release step; trip fallback; search limit per phone; home-location exception stated in section 15.2; icon numbering in open question 12; hours past midnight defined (section 11). First test map: `maps/barcelona-2026.json` |
| 2 (design) | 2026-11-21 | GitHub setup as built: new private account, organization `projects-rs` on Team, `trip-map` and `trip-map-test` repositories, "Restrict updates" so only the owner merges, Claude on two repositories only (sections 13.3, 13.4, 13.5). Step 0 done. This document moves to `docs/DESIGN.md` in the App repository. |
| 2 (design) | 2026-11-21 | Review of pull request #1: new goal 2 (several maps); goal 8 (AI creates maps from scratch); goals 10, 11, 15 (user accepts map and app updates; every map update is checked first); goal 16 (cost) clarified; goal 20 (checker runs in CI); advanced user defined; installation explained in detail (sections 3.1.1–3.1.4); "Public maps" and "Start a new map" on the opening screen; one Share button with two choices; "Share my location" limited to group maps (release E); every public map change approved by the app owner (section 10.7); `icons/icons.json`. |
| 2 (design) | 2026-11-21 | Section review: goal 2 (each map keeps its own edits), goal 6 (share a map, a site, a group, my location safely), "Share this map" (section 7); map `uid` and section 10.4.1, how a proposal finds the right map and version, and where public map proposals go. |
| 2 (design) | 2026-11-21 | Decision: the trip model. All trips public in one Trips repository, downloadable by anyone; local changes only; only the app owner approves changes; locked maps dropped; sharing within predefined groups. Goals rewritten as 16 goals in four groups, including publishing a new trip with a personal-data check (goal 9). |
| 2 (design) | 2026-11-21 | Section 3.1.5 (known platform limits) and section 3.3 (your data on the phone: where it is stored, what deletes it, eight protections). |
| 2 (design) | 2026-11-21 | Section 8.4: offline maps per trip area, built automatically when a trip is approved, in release A (step 5a). Section 3.1.1 rewritten: how the app and trips reach the phone (seven ways). |
| 2 (design) | 2026-11-21 | Section 3.1: first use rewritten for install first, then the trip list; ways to get a trip; later visits and error tables for trips. |
| 2 (design) | 2026-11-21 | Section 3.1: receiving a trip shared in a group, with and without the app installed, on Android and iPhone. |
| 2 (design) | 2026-11-21 | Section 4: layout is a first version, improved in iterations; menu as a table for trips. Section 4.1 "My trips": no locked maps; each entry shows where it came from, the published version date, and the date and count of local changes. |
| 2 (design) | 2026-11-21 | Section 11.1: every trip, pin, and legend rule written for agents; the trip-author skill (`skills/trip-author/SKILL.md`), one source for the rules, built in step 2. Section 5: card lists every legend entry; the "+N" hint explained. |
| 2 (design) | 2026-11-21 | Section 9.3: two ways to create a trip with AI without knowing skills or GitHub: copy-and-paste with any AI chat (rules generated from the skill), or adding the skill to Claude once with a picture guide. |
| 2 (design) | 2026-11-21 | Section 4: the user interface map (sections 4 to 8.1) and the iteration decision for all of it. New section 4.2: every control with an ID (UI-01 to UI-42), its action, and its result; ARCHITECTURE.md maps IDs to code, tests name the IDs. |
| 2 (design) | 2026-11-21 | Sharing brought together: sharing happens only inside a group, through WhatsApp. Section 7 now covers copying only; section 10.8 points to the new "Sharing in the group" in section 10.9: what can be shared (whole trip, legend entry, site, changes, my location), how every share travels, merge rules, "Group only" sites, receiving a whole trip, "Share my location", and limits. |
| 2 (design) | 2026-11-21 | Section 7 (copying and sharing) removed: copying is in section 6.1, sharing in section 9.9. Sections 8 to 17 renumbered as 7 to 16; references updated (older rows of this table keep the numbers of their time). |
| 2 (design) | 2026-11-21 | Section 7.3: what happens to in-app navigation when the app is minimized or the phone is locked, and when the user returns. |
| 2 (design) | 2026-11-21 | Section 7.3.1 (saving battery during navigation, five measures); section 7.4: the blue dot always works, also outside the offline area; section 4.2: UI-33 (download an offline map) and UI-34 (Settings → Offline maps). |
| 2 (design) | 2026-11-21 | Section 7.4: offline regions in a catalog approved by the app owner, usable by any trip; choosing the area as with Google Maps (adjustable rectangle, km² and exact MB, at most 150 MB); at most 2 offline areas on the phone, each tied to a trip; UI-33 and UI-34 updated. |
| 2 (design) | 2026-11-21 | Section 7.4: "How the download works", six steps from OpenStreetMap data to the phone. |
| 2 (design) | 2026-11-21 | New section 8.1, Start a new trip (title, place, dates, starting legends; no GPS needed). Sections 8.1 to 8.4 renumbered as 8.2 to 8.5. Section 8.3: users can change and remove a trip's own sites on their phone, marked for update requests, with Undo. |
| 2 (design) | 2026-11-21 | Section 10.1: the AI toolkit's public address, `https://projects-rs.github.io/trip-map/ai/`, its folder layout, plain files, one source, versioned addresses, and where the address is published. |
| 2 (design) | 2026-11-21 | Section 10.3: where the check runs without a server (app, checker scripts for AI agents, checker page for people, schema, GitHub), and the final step that directs AI agents to the check, with a checklist for agents that cannot run code. |
| 2 (design) | 2026-11-21 | Section 8.4 rewritten: for organizers; way 1 opens ChatGPT or Claude with a short request pointing to the toolkit, or copies it for any AI; way 2 adds the skill to Claude; "Ask for a trip" for users without AI. Section 10.1: making the toolkit easy to find for search engines and AI agents. |
