# 🧩 **Puzzle Game**

Welcome to **Puzzle Game** – a fun, interactive memory and puzzle experience built with **Angular + Springboot**.  
This project demonstrates a real-time puzzle gameplay with sound effects, music controls, and customizable settings.

---

## ✨ Features

**&#x2713;**   🎮 Interactive Puzzle Gameplay  
**&#x2713;**   🔊 Background Music & SFX with volume control  
**&#x2713;**   ⚙️ Settings dialog with live changes  
**&#x2713;**   🌓 Clean and responsive UI with Angular Material  
**&#x2713;**   🚀 Scalable codebase with Angular standalone components  

---

## 📦 Tech Stack

- **Frontend:** Angular 20+, TypeScript
- **Backend:** Springboot 3+, Java 21
- **UI Components:** Angular Material  
- **Styling:** SCSS  
- **Build Tool:** Angular CLI 
- **Version Control:** Git & GitHub  

---

## 🛠️ Installation & Setup

Follow these steps to set up the project locally:

## Clone the repository

```bash
git clone https://github.com/Reddy2315/puzzle-game.git
cd puzzle-game
```

## Install dependencies
```bash
npm install
```

## Run the development server
```bash
ng serve
```

---

## Open the app in your browser:
```bash
http://localhost:4200/
```

---

## 📂 Project Structure
```bash
puzzle-game/
├── puzzle-game-ui/                           # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── game/                         # Core puzzle game logic
│   │   │   ├── settings-dialog/              # Sound & settings UI
│   │   │   ├── services/                     # API calls to backend
│   │   │   └── app.component.ts              # Root component
│   │   ├── assets/                           # Images, sounds, fonts
│   │   └── styles.scss                       # Global styles
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── puzzle-game/                              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/reddy/puzzlegame/
│   │   │   │   ├── config/                   # Bean configurations
│   │   │   │   ├── controller/               # REST Controllers (APIs for auth, scores, levels, etc.)
│   │   │   │   ├── dto/              
│   │   │   │   ├── entity/                   # Entities (Player, GameSession, Score, etc.)
│   │   │   │   ├── exception                 # Exceptions handling
│   │   │   │   ├── service/                  # Business logic
│   │   │   │   ├── repository/               # Spring Data JPA repositories
│   │   │   │   └── util/                     # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.yml           # Spring Boot config (DB, profiles)
│   │   │       └── static/                   # (Optional) Static files if serving Angular build
│   │   └── test/java/com/reddy/puzzlegame/   # JUnit + MockMVC tests
│   └── pom.xml                               # Maven build config (or build.gradle if Gradle)
│
├── docs/                                     # Documentation (design, API specs, README images)
├── .gitignore
└── README.md

```

---

## 🎵 Sound & Settings

- Enable/Disable Sound – Toggle on/off in settings

- Music Slider – Adjust background music volume (0% – 100%)

- SFX Slider – Adjust sound effects volume (0% – 100%)

 #### ✅ Changes apply instantly while playing! 🎧

---

## 🧪 Running Tests

Run unit tests with:

```bash
ng test

Run end-to-end tests with:

ng e2e
```

---

## 📦 Build for Production

To create a production build:

```bash
ng build --configuration production
```

The build artifacts will be stored in the dist/ folder.

---

## 🚀 Deployment

You can easily deploy using GitHub Pages:

Build the project:

```bash
ng build --configuration production --base-href "/puzzle-game/"
```

Push dist/ contents to the gh-pages branch:
```bash
npx angular-cli-ghpages --dir=dist/puzzle-game
```

---

** Puzzle Game game will be live at:**

https://your-username.github.io/puzzle-game/

---

## 🤝 Contributing

Contributions are welcome! 🎉

If you’d like to improve this project:

Fork the repo

- Create your feature branch (git checkout -b feature/my-feature)

- Commit changes (git commit -m 'Add new feature')

- Push to branch (git push origin feature/my-feature)

- Create a Pull Request

---

## 📧 Support

If you have any questions, issues, or suggestions, feel free to open an Issue

**We’ll be happy to help! 💬**


---


## 🎉 Thank you for checking out Puzzle Game!


We hope you enjoy playing it as much as we enjoyed building it.


