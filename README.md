# MOB25
# What's Cookin'?


“What’s Cookin’?” is a Progressive Web App (PWA) that helps users find suitable recipes based on available ingredients. The goal of the app is to prevent food waste and make everyday kitchen life more sustainable – quickly, easily, and directly in the browser.


---


## Live-Demo


[https://whats-cookin.s2310456005.student.kwmhgb.at](https://whats-cookin.s2310456005.student.kwmhgb.at)


The app can be used directly in the browser as a PWA and can be launched from the home screen on mobile devices.


---


## Features

· Ingredient entry via text input

· Recipe suggestions based on available ingredients

· Ingredient match display (percentage indicating how well a recipe matches)

· Recipe details with description, time, ingredients list & instructions

· Save recipes using the heart button (locally via IndexedDB)

· My saved recipes in a separate overview

· PWA support: offline-capable, home screen integration



---


## Technologies


Frontend: HTML, CSS, Vanilla JavaScript

API: [Spoonacular API](https://spoonacular.com/)

Storage: IndexedDB (for saving local favorite recipes)

Offline capability: Service Worker + Cache Platform: Progressive Web App (PWA)


---


## Project Structure


/index.html → Home page with logo & entry point

/pages/

├─ ingredients-input.html → Ingredient entry

├─ recipe-suggestions.html → Suggestions based on ingredients

├─ recipe-detail.html → Detail view of individual recipes

└─ saved-recipes.html → Favorites overview (saved locally)


js/

├─ app.js → Service Worker registration

├─ api-config.js → API key configuration

├─ recipe-suggestions.js → Main logic for recipe display

├─ recipe-detail.js → Display and save recipes

└─ indexedDB.js → Save/load favorites locally


sw.js → Service Worker

manifest.webmanifest → PWA configuration

styles/ → CSS files


---


## Local Development


For development and testing, a local server must be used, as the Service Worker does not function otherwise. Here's how:


**1. Clone the project**
git clone https://github.com/Johanna299/MOB25.git
cd MOB25


**2. Open the project in WebStorm**


**3. Run a local server**
- Right-click on index.html and choose "Open in Browser"
   (WebStorm will automatically use its built-in server).
- Or go to index.html, click the browser icon in the top right corner.

---

### API Configuration

The app uses the Spoonacular API to fetch recipes.


The API key is stored in the file js/api-config.js:
const SPOONACULAR_API_KEY = '...';

---

## Project Goal

The app was developed as part of the course Mobile Web Applications. The goal was to create a practical, progressive web solution that combines modern technologies such as:

· IndexedDB

· Service Worker

· Web Manifest

· API Integration

to develop a meaningful digital product with a focus on sustainability.

---

## Test PWA Behavior

You can test the app on a mobile device as follows:

1. Open the live demo in the Chrome browser

2. Open the browser menu → "Add to Home Screen"

3. Launch the app via the icon – it now runs like a native app

4. Saved recipes remain available even offline

---

## License

This project was created as part of a university course and is non-commercial. When using the Spoonacular API, their terms of use must be observed.

### Authors

Mobile Web Applications, 2025

Student team (Johanna Hofer, Emily Huber) of the "Communication, Knowledge, Media" degree program at the University Of Applied Sciences Hagenberg.