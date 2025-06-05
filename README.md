# Job Application Assignment - PHP REST API & UI

This project is a solution for the job application assignment, involving a PHP RESTful API and a simple frontend UI to interact with it.

## Objective
- Develop a restful API using PHP.
- Construct a simple UI to interact with the API.

## Project Structure

```
.
├── .devcontainer/       # For GitHub Codespaces configuration
│   └── devcontainer.json
├── .github/
│   └── workflows/
│       └── sonarcloud.yml # SonarCloud GitHub Action
├── .gitignore
├── api/
│   └── rates.php        # The PHP REST API endpoint
├── public/                # Frontend files
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Backend API (`api/rates.php`)

The API ingests a JSON payload, transforms it, queries an external rates API, and relays the response.

**Input Payload (to `api/rates.php`):**
```json
{
  "Unit Name": "String (e.g., one of the test Unit Type IDs like '-2147483637')",
  "Arrival": "<dd/mm/yyyy>",
  "Departure": "<dd/mm/yyyy>",
  "Occupants": "<int>",
  "Ages": ["<int array>"]
}
```

**External API Payload (transformed by `api/rates.php`):
```json
{
  "Unit Type ID": "<int>",
  "Arrival": "yyyy-mm-dd",
  "Departure": "yyyy-mm-dd",
  "Guests": [
    { "Age Group": "Adult" },
    { "Age Group": "Child" }
  ]
}
```

- **Unit Type IDs for testing:** `[-2147483637, -2147483456]`
- **External API Endpoint:** `https://dev.gondwana-collection.com/WebStore/Rates/Rates.php`

## Frontend

A simple HTML, CSS, and JavaScript frontend in the `public/` directory allows users to:
- Input booking details (Unit Name/ID, dates, occupants, ages).
- Send the request to the local PHP API.
- View the results: Unit Name, Rate, Date Range, Availability.

## Setup and Running

### Prerequisites
- PHP (version 7.4 or higher recommended) with `curl` and `json` extensions enabled.
- A web server (Apache, Nginx, or PHP's built-in server).
- Git.

### Local Setup
1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repository-name>
    ```
2.  **Run with PHP's built-in server:**
    Navigate to the `public/` directory and start the server:
    ```bash
    cd public
    php -S localhost:8000
    ```
    Then open `http://localhost:8000` in your browser.
    The API will be accessible at `http://localhost:8000/../api/rates.php`. Ensure your frontend `script.js` points to the correct API path relative to its location or use an absolute path if needed.

    Alternatively, configure a virtual host with Apache/Nginx to point to the `public` directory as the document root, and ensure requests to `/api/` are routed to the `api/` directory (e.g., via `.htaccess` or server config if you move `api` inside `public` or use a router).
    For simplicity with the current structure and PHP's built-in server, the `script.js` will use a relative path like `../api/rates.php`.

### GitHub Codespaces
This repository is configured to run in GitHub Codespaces.
1.  Open the repository in GitHub.
2.  Click on `Code` -> `Open with Codespaces` -> `New codespace`.
3.  Once the Codespace is built, it should automatically forward the port used by PHP's built-in server (if you run it as described above from the terminal within Codespaces).

### SonarCloud Integration

<!-- Triggering SonarCloud workflow -->
1.  Create a free SonarCloud account at [SonarCloud Signup](https://www.sonarsource.com/products/sonarcloud/signup-free/) and link it to your GitHub account.
2.  On SonarCloud, create a new project and select your GitHub repository.
3.  In your GitHub repository settings, go to `Secrets and variables` -> `Actions`.
4.  Add the following repository secrets (obtained from SonarCloud when setting up the project):
    *   `SONAR_TOKEN`: Your SonarCloud project's analysis token.
    *   `SONAR_HOST_URL`: Typically `https://sonarcloud.io`.

The `.github/workflows/sonarcloud.yml` file defines a GitHub Action that will run SonarCloud analysis on every push and pull request to the `main` branch.

## Important Notes for Assignment
- Remember to share your GitHub repository with `GCNam-DevTeam` and `web-dev-github-username`.
- Ensure your code is clean, well-commented, and follows PHP best practices.
