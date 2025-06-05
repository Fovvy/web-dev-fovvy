#Gondwana Unit Rate Checker Project ✨ - by Parastus Nghiilwamo

Good day, Parastus Nghiilwamo here  - I'm excited to share my Gondwana Unit & Rate Checker application. I built this tool to make it easy for users to check accommodation rates and availability by interacting with an external API.

## My Journey & What I Built

My goal was to create a straightforward and user-friendly interface that simplifies querying unit rates. I decided to use **PHP** for the backend API, as it's well-suited for web tasks like this, and standard **HTML, CSS, and JavaScript** for the frontend to create an interactive experience.

Here's a breakdown of the key functionalities I implemented:

*   **User-Friendly Form:** I designed a simple form where users can select a Unit Name, input Arrival and Departure Dates, and specify the Number of Occupants.
*   **Dynamic Age Inputs:** A neat feature I added is dynamic age input fields – these appear based on the number of occupants entered.
*   **Backend API with PHP:** I developed a local PHP script (`public/api/index.php`) that the frontend communicates with.
*   **Data Transformation Logic:** In the PHP backend, I wrote logic to transform the data from the frontend (like date formats and categorizing guests by age) into the format required by the external Gondwana Collection API.
*   **Clear Results Display:**
    *   The app clearly shows the selected Unit Name and Date Range.
    *   It displays the retrieved Rate.
    *   I used icons (✔️ for available, ❌ for not available, ⚠️ for errors) to make availability status immediately clear.
    *   I also included a `</>` toggle button so users can see the raw JSON response from the API, which is handy for a detailed look or debugging.
*   **Responsive & Modern UI:** I focused on making the interface responsive so it looks good and works well on different screen sizes. I opted for a warm, brown-themed glassmorphic design for a modern feel.
*   **Favicon:** Added a `gondwana-favicon.png` for a complete look.

## Project Structure

Here’s how I organized the project files:

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
│   │   └── index.php     # This is my PHP API endpoint
│   ├── images/           # Contains logo, background, and favicon
│   │   ├── gondwana-favicon.png
│   │   ├── gondwana-logo.png
│   │   └── savannah-background-4.jpg
│   ├── index.html      # The main frontend page I created
│   ├── script.js       # My frontend JavaScript logic
│   └── style.css       # The CSS styles I wrote
└── README.md
```

## Getting It Running

I designed this project to be easy to set up. Here’s how you can get it running:

### What You'll Need:

*   **PHP:** I recommend version 7.4 or higher. Make sure you have the `curl` and `json` extensions enabled (they usually are by default).
*   **Web Browser:** Any modern browser will do.
*   **Git:** If you want to clone the repository.

### Running It Locally:

1.  **Get the Code:**
    *   You can clone the repository: `git clone <repository-url>`
    *   Or just download and extract the ZIP file.
2.  **Go to the `public` Directory:**
    Using your terminal, navigate into the `public` directory:
    ```bash
    cd path/to/project/public
    ```
3.  **Start the PHP Server:**
    From inside the `public` directory, I use PHP's built-in server:
    ```bash
    php -S localhost:8000
    ```
    This starts a web server, and my `index.html` will be the main page. The API will be at `http://localhost:8000/api/`.
4.  **Open in Your Browser:**
    Go to `http://localhost:8000`.

### Running with GitHub Codespaces (My Preferred Way for Easy Setup!):

1.  **Open in Codespaces:**
    *   On the GitHub repository page, click `Code`, go to the `Codespaces` tab, and create a new codespace.
2.  **Run the Application:**
    *   Once the Codespace is ready, open the terminal.
    *   Navigate to `public`: `cd public`
    *   Start the PHP server: `php -S localhost:8000 -t .` (the `-t .` tells it to serve from the current directory).
    *   Codespaces usually detects the running app and gives you a link to open it.

## My Backend API (`public/api/index.php`)

I wrote the PHP script at `public/api/index.php` to handle the backend logic:

*   It **accepts POST requests** with a JSON payload from the frontend.
*   It **validates** the incoming data to ensure it's what I expect.
*   It **transforms** the data (like date formats and guest ages) for the external Gondwana API.
*   It **communicates** with the external API (`https://dev.gondwana-collection.com/Web-Store/Rates/Rates.php`) using cURL.
*   It then **handles the responses** and sends them (or any errors) back to the frontend in JSON format.
*   I also included basic CORS headers.

**An Important Note on SSL in my API:**
For the cURL request in my PHP script, I've set `CURLOPT_SSL_VERIFYPEER` to `true` and `CURLOPT_SSL_VERIFYHOST` to `2`. This enables proper SSL verification, which is crucial for security. While this is the best practice, I know that sometimes in specific local development setups, these might need temporary adjustments if there are issues with CA bundles, but the default is secure.

## Code Quality & SonarQube Integration

I aimed for clean and maintainable code. I also integrated SonarCloud to keep an eye on quality:

*   I set up SonarQube to analyze my PHP, JavaScript, HTML, and CSS.
*   The `.github/workflows/sonarcloud.yml` file shows how I integrated SonarCloud for automated analysis.

### My Notes on the SonarQube Quality Gate:

*   **Code Coverage:** The default "Sonar way" Quality Gate in SonarCloud requires 80% coverage on new code. Currently, this project doesn't include an automated test suite, which means it shows 0% coverage, and this Quality Gate condition isn't met. I recognize that implementing unit and integration tests (e.g., using PHPUnit for the backend and a JavaScript testing framework for the frontend) is an important step for future improvement. Due to SonarCloud plan limitations, I couldn't modify the default Quality Gate for this project.
*   **Security Hotspots:** I reviewed any reported Security Hotspots. For instance, the permissive CORS policy (`Access-Control-Allow-Origin: *`) was flagged. For the development and assessment environment (local/Codespaces) of this project, I deemed this acceptable. I've left a `TODO` comment in the code to remind myself to implement a more restrictive policy for any future production deployment.

I hope this gives you a good overview of my work and how to get the project up and running!

---
Parastus Nghiilwamo ✨
