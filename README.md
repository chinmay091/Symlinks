# Auto-Symlinker📂

*A file-watching and automatic moving utility built with a Go backend and an Electron + React UI.*

This project was a personal learning journey to understand the fundamentals of building a full-stack desktop application from scratch. The goal was to create a tool similar to a symbolic link (symlink) that automatically moves files from a source folder (like a messy Desktop) to a designated destination, with configurable rules and a user-friendly interface.

---

## 🚀 Features

* **Automatic File Watching:** Uses a Go service to monitor specified folders for new files.
* **Rule-Based Moving:** Moves files from a source to a destination based on rules defined in a `rules.json` file (Which can be set up by the user).
* **File Type Filtering:** Rules can specify which file extensions (e.g., `.jpg`, `.pdf`) should be moved.
* **Smart Cooldown (Debounce):** Waits for a file to be inactive (i.e., you've finished saving it) before attempting to move it.
* **Robust & Resilient:**
    * Handles temporary file locks with a retry mechanism.
    * Works across different disk drives (e.g., from `C:` to `D:`) using a copy-then-delete method.
* **Graphical User Interface (GUI):** An Electron + React application that acts as a control panel to manage the rules.
    * View all active rules.
    * Add new rules via a pop-up form.
    * Delete existing rules.
    * Select folders graphically using the native OS file dialog.

---

## 🛠️ Tech Stack

* **Backend:** Go
    * `fsnotify` for file system notifications.
* **UI (Desktop App):** Electron
* **UI (Frontend):** React with TypeScript & Vite
* **UI Library:** Chakra UI, Lucide React (for icons)
* **Configuration:** JSON
* **Version Control:** Git & GitHub



---

## 📁 Project Structure

This project is organized as a monorepo with two main components:

* `/backend`: The Go service that contains the core file-watching and moving logic.
* `/ui`: The Electron + React application that provides the user interface for managing the rules.

---

## ⚙️ Getting Started (Local Setup)

To run this project locally, you will need to have Go and Node.js installed on your system.

### Prerequisites
* Go (version 1.18 or later)
* Node.js (version 18 or later)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chinmay091/Symlinks.git
    cd Symlinks
    ```

2.  **Set up the Backend:**
    Open a terminal, navigate to the `backend` folder, and set up the dependencies.
    ```bash
    cd backend
    go mod tidy
    ```

3.  **Set up the UI:**
    Open a *second* terminal, navigate to the `ui` folder, and install the npm dependencies.
    ```bash
    cd ui
    npm install
    ```

4.  **Run the Application:**
    You need to have both terminals running simultaneously.

    * In your **first terminal** (for the backend):
        ```bash
        cd backend
        go run main.go
        ```
    * In your **second terminal** (for the UI):
        ```bash
        cd ui
        npm run dev
        ```
    The UI application window will open, and the backend service will be running and logging its activity in its own terminal.

---

## 🎓 My Key Learnings

As a foundational learning project, this taught me a huge amount about building a complete application from the ground up.

* **Go for Backend Services:**
    * **Concurrency:** Learned how to use `goroutines` to handle tasks concurrently (like the file-moving operations) and `sync.Mutex` to handle shared data safely (the debounce timer map).
    * **File System Interaction:** Gained hands-on experience with Go's `os` and `path/filepath` packages for robust file manipulation, and the `fsnotify` library for creating an efficient, event-driven file watcher.
    * **Building Robustness:** Realized that simple operations aren't enough. I learned to implement retry loops for transient errors (like file locks) and debounce logic to handle real-world user behavior.

* **Electron & Full-Stack Desktop Apps:**
    * **The Architecture:** Understood the core concept of Electron's **Main and Renderer processes**.
    * **The Secure Bridge:** The biggest lesson was learning how to securely communicate between the sandboxed UI (Renderer) and the powerful backend (Main) using a **`preload` script**, `contextBridge`, and Inter-Process Communication (`ipcMain` and `ipcRenderer`). This is the key to a secure and functional Electron app.

* **React & Modern Frontend:**
    * **Component-Based Design:** Learned to break down a UI into small, manageable components (`Header`, `RulesList`, `RuleItem`, `RuleForm`).
    * **State Management:** Gained practical experience with React hooks like `useState` and `useEffect` to manage application state, fetch data, and handle loading/error conditions.
    * **UI Libraries:** Discovered the power of a component library like **Chakra UI** to quickly build a professional and attractive UI without writing custom CSS from scratch.

* **The Debugging Journey:**
    * Perhaps the most valuable lesson was in debugging. I encountered and solved numerous issues across the stack:
        * **Git:** Correcting a broken repository state, fixing "embedded repository" errors, and understanding the importance of `.gitignore`.
        * **Node.js/npm:** Battling and finally solving "dependency hell" with incompatible package versions.
        * **Electron:** Tracing down why the `preload` script wasn't loading by using the Developer Tools Console.
    * This taught me the critical skill of reading error messages carefully, forming a hypothesis, and using diagnostic tools to find the root cause of a problem.

---

## 🔮 Future Improvements

* Implement **Edit Rule** functionality in the UI.
* Add **Graceful Shutdown** to the Go backend to ensure in-progress file moves are completed when the app is closed.
* Package the application into a distributable installer using **Electron Builder**.
* Add a status indicator in the UI to show if the Go backend is running.

---

## License

This project is licensed under the MIT License.
