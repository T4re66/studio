# OfficeZen - Dein smarter Büro-Assistent

OfficeZen ist eine Next.js-Anwendung, die entwickelt wurde, um den Büroalltag zu vereinfachen, die Zusammenarbeit im Team zu fördern und durch Gamification für mehr Spass bei der Arbeit zu sorgen.

## Features

- **Team-Zentrale:** Behalte den Überblick über dein Team, plane Pausen und feiere Geburtstage.
- **Büro-Helfer:** Organisiere den Kühlschrank, finde freie Plätze und nutze Fokus-Tools.
- **Tages-Briefing:** Starte organisiert in den Tag mit smarten Zusammenfassungen deiner E-Mails, Termine und Notizen.
- **Gamification:** Sammle Punkte, steige im Leaderboard auf und löse Prämien im Shop ein.
- **Firebase User Management:** Sichere Authentifizierung mit Google und Verwaltung von Benutzerdaten in Firestore.
- **Intelligente KI-Funktionen:** Nutze den Chatbot für Fragen und lasse deine Dateien automatisch organisieren.

## Lokales Setup & Ausführung

Folge diesen Schritten, um die Anwendung lokal auf deinem Computer auszuführen.

### 1. Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [npm](https://www.npmjs.com/) oder ein anderer Paketmanager
- [Firebase-Konto](https://firebase.google.com/) und ein neues Firebase-Projekt.
- [Firebase CLI](https://firebase.google.com/docs/cli) installiert und eingeloggt (`firebase login`).

### 2. Abhängigkeiten installieren

Öffne ein Terminal im Hauptverzeichnis des Projekts und installiere alle notwendigen Pakete mit dem folgenden Befehl:

```bash
npm install
```

### 3. Firebase-Projekt einrichten

#### 3.1. Firebase-Dienste aktivieren

Gehe zur [Firebase Console](https://console.firebase.google.com/) und aktiviere die folgenden Dienste für dein Projekt:
1.  **Authentication**: Aktiviere die **Google**-Anmeldemethode.
2.  **Firestore Database**: Erstelle eine neue Datenbank im **Produktionsmodus**. Wähle einen Standort (z. B. `europe-west`).
3.  **Functions**: Aktiviere Cloud Functions.

#### 3.2. Web-App-Konfiguration abrufen

1.  Gehe in deinem Firebase-Projekt zu den **Projekteinstellungen** (Zahnrad-Symbol oben links).
2.  Scrolle nach unten zum Abschnitt "Deine Apps".
3.  Klicke auf das Web-Symbol (`</>`), um eine neue Web-App zu erstellen oder wähle eine bestehende aus.
4.  Kopiere das `firebaseConfig`-Objekt. Du benötigst es im nächsten Schritt.

### 4. Umgebungsvariablen und Firebase-Konfiguration einrichten

1.  Erstelle eine neue Datei im Hauptverzeichnis des Projekts mit dem Namen `.env.local`.
2.  Füge die **Firebase-Konfiguration** in diese Datei ein. **Ersetze die Platzhalter** mit den Werten aus deinem `firebaseConfig`-Objekt.

    ```
    # Firebase Web App Configuration
    # Ersetze die Platzhalter mit deinen tatsächlichen Werten
    NEXT_PUBLIC_FIREBASE_API_KEY="DEIN_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="DEIN_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="DEIN_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="DEIN_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="DEIN_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="DEIN_APP_ID"
    ```

    **Wichtig:** Der `NEXT_PUBLIC_`-Präfix ist notwendig, damit Next.js diese Variablen auf der Client-Seite verfügbar macht.

### 5. Anwendung starten

Sobald die Installation abgeschlossen und die `.env.local`-Datei konfiguriert ist, kannst du den lokalen Entwicklungsserver starten:

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:9002](http://localhost:9002) erreichbar. Du solltest dich jetzt mit deinem Google-Konto anmelden können.

### 6. Firebase-Backend bereitstellen (Optional, für volle Funktionalität)

Die App enthält vordefinierte Security Rules und Cloud Functions im `firebase/`-Verzeichnis. Um diese bereitzustellen:

1.  **Firebase-Projekt verbinden:**
    ```bash
    firebase use DEIN_PROJEKT_ID
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
    firebase deploy
    ```

### 7. KI-Funktionen (Optional)

Die Anwendung nutzt Genkit für KI-gesteuerte Funktionen. Um diese lokal zu entwickeln und zu testen, kannst du den Genkit-Entwicklungsserver in einem separaten Terminal starten:

```bash
npm run genkit:dev
```

Dies startet den Genkit-Inspektor, in dem du die KI-Flows überwachen und testen kannst.
