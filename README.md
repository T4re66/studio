
# OfficeZen - Dein smarter Büro-Assistent

OfficeZen ist eine Next.js-Anwendung, die entwickelt wurde, um den Büroalltag zu vereinfachen und die Zusammenarbeit im Team zu fördern. Sie integriert sich mit Google-Diensten, um personalisierte Informationen wie E-Mails und Kalendereinträge direkt in der App anzuzeigen.

## Lokales Setup & Ausführung

Folge diesen Schritten, um die Anwendung lokal auf deinem Computer auszuführen.

### 1. Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 20 oder höher)
- [npm](https://www.npmjs.com/) oder ein anderer Paketmanager
- Ein [Google Cloud-Konto](https://cloud.google.com/) mit einem aktiven Projekt.
- [Firebase-Konto](https://firebase.google.com/) und ein neues Firebase-Projekt, das mit deinem Google Cloud-Projekt verknüpft ist.

### 2. Umgebungsvariablen einrichten

Erstelle eine Datei namens `.env.local` im Hauptverzeichnis des Projekts und füge deine Firebase-Konfigurationsdaten hinzu. Du findest diese in den Projekteinstellungen deines Firebase-Projekts unter "Web-App".

```bash
# .env.local

NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
```

### 3. Google Cloud & Firebase Konfiguration

#### 3.1. APIs aktivieren
Aktiviere die folgenden APIs in deiner Google Cloud Console für dein Projekt:
- **Gmail API**
- **Google Calendar API**

#### 3.2. OAuth-Zustimmungsbildschirm konfigurieren
1. Gehe in der Google Cloud Console zu "APIs & Dienste" -> "OAuth-Zustimmungsbildschirm".
2. Wähle "Extern" und erstelle einen neuen Zustimmungsbildschirm.
3. Gib einen App-Namen an (z.B. "OfficeZen") und eine Nutzer-Support-E-Mail.
4. **Scopes hinzufügen:** Füge die folgenden Scopes hinzu:
   - `.../auth/userinfo.email` (wird standardmässig hinzugefügt)
   - `.../auth/userinfo.profile` (wird standardmässig hinzugefügt)
   - `.../auth/gmail.readonly`
   - `.../auth/calendar.readonly`
5. Füge deine E-Mail-Adresse als Testnutzer hinzu, während sich die App im Testmodus befindet.

#### 3.3. Firebase Authentication einrichten
1. Gehe zur [Firebase Console](https://console.firebase.google.com/) und wähle dein Projekt.
2. Gehe zu "Authentication" -> "Sign-in method".
3. Aktiviere den **Google**-Anbieter.
4. **Autorisierte Domains:** Gehe zu "Authentication" -> "Settings" -> "Authorized domains" und füge die Domains hinzu, von denen aus du dich anmelden möchtest.
   - Für die lokale Entwicklung: `localhost`
   - Für die Entwicklung in Firebase Studio / Cloud Workstations: Kopiere die Domain aus der Fehlermeldung in der Browser-Konsole (z.B. `....cloudworkstations.dev`)

### 4. Abhängigkeiten installieren & App starten

1.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```
2.  **Entwicklungsserver starten:**
    ```bash
    npm run dev
    ```

Die Anwendung ist nun unter [http://localhost:9002](http://localhost:9002) oder deiner Cloud Workstation URL erreichbar.

### 5. Fehlerbehebung

- **`auth/unauthorized-domain`**: Dieser Fehler tritt auf, wenn du versuchst, dich von einer Domain aus anzumelden, die nicht in der Firebase-Liste der autorisierten Domains enthalten ist. Füge die Domain in den Firebase Authentication-Einstellungen hinzu (siehe Punkt 3.3).
- **Fehlende Scopes / 403-Fehler bei API-Aufrufen**: Wenn du nach der Anmeldung Fehler beim Abrufen von Gmail- oder Kalenderdaten erhältst, stelle sicher, dass die Scopes (`gmail.readonly`, `calendar.readonly`) korrekt im OAuth-Zustimmungsbildschirm in der Google Cloud Console konfiguriert sind.
- **`auth/popup-closed-by-user` oder Pop-up blockiert**: Der Google-Anmeldevorgang verwendet ein Pop-up-Fenster. Stelle sicher, dass dein Browser Pop-ups für deine Entwicklungsdomain (`localhost` oder die Cloud Workstation URL) nicht blockiert.
