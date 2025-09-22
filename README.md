# OfficeZen - Dein smarter Büro-Assistent

OfficeZen ist eine Next.js-Anwendung, die entwickelt wurde, um den Büroalltag zu vereinfachen, die Zusammenarbeit im Team zu fördern und durch Gamification für mehr Spass bei der Arbeit zu sorgen.

## Features

- **Team-Zentrale:** Behalte den Überblick über dein Team, plane Pausen und feiere Geburtstage.
- **Büro-Helfer:** Organisiere den Kühlschrank, finde freie Plätze und nutze Fokus-Tools.
- **Tages-Briefing:** Starte organisiert in den Tag mit smarten Zusammenfassungen deiner E-Mails, Termine und Notizen.
- **Gamification:** Sammle Punkte, steige im Leaderboard auf und löse Prämien im Shop ein.
- **Intelligente KI-Funktionen:** Nutze den Chatbot für Fragen und lasse deine Dateien automatisch organisieren.

## Lokales Setup & Ausführung

Folge diesen Schritten, um die Anwendung lokal auf deinem Computer auszuführen.

### 1. Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [npm](https://www.npmjs.com/) oder ein anderer Paketmanager

### 2. Abhängigkeiten installieren

Öffne ein Terminal im Hauptverzeichnis des Projekts und installiere alle notwendigen Pakete mit dem folgenden Befehl:

```bash
npm install
```

### 3. Umgebungsvariablen einrichten

Für die Google-Authentifizierung und den Zugriff auf Google-Dienste (Gmail, Kalender) musst du Anmeldeinformationen bereitstellen.

1.  Erstelle eine neue Datei im Hauptverzeichnis des Projekts mit dem Namen `.env`.
2.  Füge die folgenden Umgebungsvariablen in die `.env`-Datei ein:

    ```
    # Google OAuth Credentials
    # Ersetze die Platzhalter mit deinen tatsächlichen Anmeldeinformationen
    GOOGLE_CLIENT_ID="DEINE_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="DEIN_GOOGLE_CLIENT_SECRET"
    ```

    **Wichtig:** Du erhältst diese Anmeldeinformationen aus der [Google Cloud Console](https://console.cloud.google.com/), indem du ein OAuth 2.0-Client-ID für eine Webanwendung erstellst. Stelle sicher, dass die folgenden APIs für dein Projekt aktiviert sind:
    - **Gmail API**
    - **Google Calendar API**

### 4. Anwendung starten

Sobald die Installation abgeschlossen und die `.env`-Datei konfiguriert ist, kannst du den lokalen Entwicklungsserver starten:

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:9002](http://localhost:9002) erreichbar.

### 5. KI-Funktionen (Optional)

Die Anwendung nutzt Genkit für KI-gesteuerte Funktionen. Um diese lokal zu entwickeln und zu testen, kannst du den Genkit-Entwicklungsserver in einem separaten Terminal starten:

```bash
npm run genkit:dev
```

Dies startet den Genkit-Inspektor, in dem du die KI-Flows überwachen und testen kannst.
