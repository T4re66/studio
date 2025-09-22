# OfficeZen - Dein smarter Büro-Assistent

OfficeZen ist eine Next.js-Anwendung, die entwickelt wurde, um den Büroalltag zu vereinfachen und die Zusammenarbeit im Team zu fördern.

## Lokales Setup & Ausführung

Folge diesen Schritten, um die Anwendung lokal auf deinem Computer auszuführen.

### 1. Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 20 oder höher)
- [npm](https://www.npmjs.com/) oder ein anderer Paketmanager
- [Firebase-Konto](https://firebase.google.com/) und ein neues Firebase-Projekt.
- [Firebase CLI](https://firebase.google.com/docs/cli) installiert und eingeloggt (`firebase login`).

### 2. Abhängigkeiten installieren

Öffne ein Terminal im Hauptverzeichnis des Projekts und installiere alle notwendigen Pakete:

```bash
npm install
```

### 3. Firebase-Projekt einrichten

#### 3.1. Firebase-Dienste aktivieren

1.  Gehe zur [Firebase Console](https://console.firebase.google.com/) und wähle dein Projekt aus (oder erstelle ein neues mit der Projekt-ID `officezen-prod`, falls gewünscht).
2.  **Authentication**:
    - Gehe zum Tab "Sign-in method".
    - Aktiviere den **Google**-Anbieter.
    - Gehe zum Tab "Settings" -> "Authorized domains" und füge die Domains hinzu, von denen aus du dich anmelden möchtest (z.B. `localhost`).
3.  **Firestore Database**:
    - Erstelle eine neue Datenbank im **Produktionsmodus**.
    - Wähle als Standort `europe-west`.
4.  **Functions**:
    - Gehe zum Functions-Dashboard und klicke auf "Erste Schritte", um das Setup abzuschliessen. Die Functions selbst werden wir per CLI deployen.

#### 3.2. Web-App-Konfiguration abrufen

1.  Gehe in deinem Firebase-Projekt zu den **Projekteinstellungen** (Zahnrad-Symbol oben links).
2.  Im Tab "Allgemein", scrolle nach unten zu "Deine Apps".
3.  Klicke auf das Web-Symbol (`</>`), um eine neue Web-App zu erstellen (oder wähle die bestehende aus).
4.  Gib der App einen Spitznamen (z.B. "OfficeZen Web").
5.  Kopiere das `firebaseConfig`-Objekt. **Es ist bereits in `src/lib/firebase.ts` eingefügt.** Du musst nichts weiter tun.

### 4. Firebase Backend deployen

Die App enthält vordefinierte Security Rules und Cloud Functions im `firebase/`-Verzeichnis.

1.  **Firebase-Projekt verbinden:**
    Stelle sicher, dass du mit dem richtigen Projekt verbunden bist.
    ```bash
    firebase use officezen-prod 
    ```

2.  **Abhängigkeiten der Functions installieren:**
    Navigiere in das `functions`-Verzeichnis und installiere die Pakete.
    ```bash
    cd firebase/functions
    npm install
    cd ../.. 
    ```

3.  **Backend bereitstellen:**
    Führe den folgenden Befehl im Hauptverzeichnis des Projekts aus, um die Rules und Functions zu deployen:
    ```bash
    firebase deploy --only firestore:rules,functions
    ```
    Nach dem Deployment sind dein Backend und deine Regeln live.

### 5. Anwendung starten

Sobald alles eingerichtet und deployed ist, kannst du den lokalen Entwicklungsserver starten:

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:9002](http://localhost:9002) erreichbar. Du solltest dich jetzt mit deinem Google-Konto anmelden können.
