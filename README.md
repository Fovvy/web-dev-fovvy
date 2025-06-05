# Gondwana Unit Rate Checker ✨ By Parastus Nghiilwamo

Welcome to the Gondwana Unit & Rate Checker! This application allows users to check accommodation rates and availability by interacting with an external API.

💡This summary was confirmed by Parastus ✔️

## Purpose of the platform

The primary purpose of this tool is to provide a user-friendly interface for querying unit rates based on selected criteria such as unit type, dates, and number of occupants. It acts as a bridge, simplifying the interaction with a more complex backend service.

## Functionality

*   **User-Friendly Form:** Input fields for Unit Name (selection), Arrival Date, Departure Date, and Number of Occupants.
*   **Dynamic Age Inputs:** Based on the number of occupants, the form dynamically generates input fields for each person's age.
*   **API Interaction:** Submits the collected data to a local PHP backend (`public/api/index.php`).
*   **Data Transformation:** The PHP backend transforms the frontend data (e.g., date formats, guest age groups) to match the requirements of an external Gondwana Collection API.
*   **Results Display:**
    *   Shows the selected Unit Name and Date Range.
    *   Displays the retrieved Rate.
    *   Indicates Availability with a clear icon (✔️ for available, ❌ for not available, ⚠️ for errors).
    *   Provides a toggle button (`</>`) to show/hide the raw JSON response from the API for debugging or detailed inspection.
*   **Responsive Design:** The user interface is designed to adapt to different screen sizes for a good experience on desktop and mobile devices.
*   **Glassmorphic UI:** Features a modern, warm, brown-themed glassmorphic design aesthetic.

## Project Structure

```
.
├── .devcontainer/        # Optional: For GitHub Codespaces configuration
│   └── devcontainer.json
├── .github/
│   └── workflows/        # Optional: For CI/CD like SonarCloud
│       └── sonarcloud.yml
├── .gitignore
├── public/
│   ├── api/
│   │   └── index.php     # The PHP API endpoint
│   ├── images/
│   │   ├── gondwana-logo.png
│   │   └── savannah-background-4.jpg
│   ├── index.html      # Main frontend page
│   ├── script.js       # Frontend JavaScript logic
│   └── style.css       # CSS for styling
└── README.md
```

## Setup and Running

This project is designed to be straightforward to set up and run, especially using environments like GitHub Codespaces or a local PHP server.

### Prerequisites

*   **PHP:** Version 7.4 or higher is recommended, with the `curl` and `json` extensions enabled (these are commonly enabled by default).
*   **Web Browser:** Any modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   **Git:** For cloning the repository (optional if downloading as a ZIP).

### Running Locally

1.  **Get the Code:**
    *   Clone the repository: `git clone <repository-url>`
    *   Or download and extract the ZIP file.
2.  **Navigate to the `public` Directory:**
    Open your terminal or command prompt and change to the `public` directory within the project:
    ```bash
    cd path/to/project/public
    ```
3.  **Start the PHP Built-in Web Server:**
    From within the `public` directory, run:
    ```bash
    php -S localhost:8000
    ```
    This will start a web server. The `index.html` file will be served as the main page, and the API endpoint will be accessible at `http://localhost:8000/api/` (e.g., `http://localhost:8000/api/index.php`).
4.  **Open in Browser:**
    Open your web browser and go to `http://localhost:8000`.

### Running with GitHub Codespaces

This repository can be easily run in GitHub Codespaces, providing a pre-configured development environment.

1.  **Open in Codespaces:**
    *   Navigate to the repository on GitHub.
    *   Click the `Code` button.
    *   Select the `Codespaces` tab.
    *   Click `Create codespace on main` (or your desired branch).
2.  **Run the Application:**
    *   Once the Codespace is ready, a terminal should be available.
    *   Navigate to the `public` directory: `cd public`
    *   Start the PHP server: `php -S localhost:8000 -t .` (The `-t .` ensures it serves from the current directory, which is `public`).
    *   Codespaces should automatically detect the running application and provide a button or link to open it in a browser tab (Port Forwarding).

## API Endpoint (`public/api/index.php`)

The PHP script at `public/api/index.php` serves as the backend.
*   **Accepts POST requests** with a JSON payload.
*   **Validates** the incoming data.
*   **Transforms** the data to the format required by the external Gondwana API (e.g., date formats, guest age categorization).
*   **Communicates** with the external API: `https://dev.gondwana-collection.com/Web-Store/Rates/Rates.php` using cURL.
*   **Handles responses** and relays them (or any errors) back to the frontend in JSON format.
*   Includes basic CORS headers to allow requests from the frontend.

**Note on SSL (for `api/index.php`):** The cURL request within the PHP script now has `CURLOPT_SSL_VERIFYPEER` set to `true` and `CURLOPT_SSL_VERIFYHOST` set to `2` by default, enabling proper SSL certificate and hostname verification. This is the recommended secure configuration. In some specific local development environments with outdated CA bundles or particular SSL issues, these might need to be temporarily adjusted for testing, but the default is now secure.

## Code Quality (SonarQube)

This project aims for clean and maintainable code. If integrating with SonarQube:
*   Ensure your SonarQube instance is configured to analyze PHP, JavaScript, HTML, and CSS.
*   The `.github/workflows/sonarcloud.yml` (if present and configured with your `SONAR_TOKEN`) provides an example of how to integrate with SonarCloud for automated analysis.
*   Strive for clear logic, meaningful variable names, and appropriate comments where the code's intent isn't immediately obvious.

I hope you are satisfied with my Work! ✨✨✨
---
