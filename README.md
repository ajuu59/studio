# Blog Application

This is a blog application built with Next.js, React, and Firebase. It provides functionalities for users to interact with blog posts and for administrators to manage content.

## Features

- **User Authentication:** Secure user login and registration using Firebase Authentication (simulated via role selection).
- **Blog Posts:** View a list of blog posts and read individual posts.
- **Post Creation (Admin/Editor/Contributor):** Authorized users can create new blog posts through a dedicated form.
- **Post Management (Admin/Editor):** An admin panel allows for moderation and management of existing blog posts.
- **Commenting:** Users can leave comments on blog posts (stored in local storage).
- **Searching:** Search functionality to find specific blog posts (basic implementation).

## AI Agent Capabilities

- **Natural Language Processing (NLP):** Enable the AI agent to understand and process user queries effectively.
- **Content Recommendations:** Allow the AI to suggest relevant articles or posts based on user behavior.
- **Automated Responses:** Implement AI-driven chatbots for real-time user assistance.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisitesf

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1. Clone the repo:
   ```sh
   git clone https://your-repository-url.git
   ```
2. Navigate to the project directory:
   ```sh
   cd your-project-directory
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```
   The application will be available at `http://localhost:9002`.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```
This command compiles the Next.js application into an optimized set of static files and server-side functions, typically in the `.next` directory.

## Deploying to Firebase App Hosting

This application is configured for deployment to Firebase App Hosting.

1.  **Ensure Firebase CLI is Installed and Configured:**
    If you haven't already, install the Firebase CLI:
    ```bash
    npm install -g firebase-tools
    ```
    Log in to your Firebase account:
    ```bash
    firebase login
    ```
2.  **Initialize Firebase in Your Project (if not already done):**
    If this is a new Firebase project or you haven't initialized Firebase for this project directory:
    ```bash
    firebase init hosting
    ```
    When prompted, select "App Hosting (Experimental)" or the relevant App Hosting option. Follow the prompts to associate this project with your Firebase project.

3.  **Deploy:**
    Once your project is built and Firebase is initialized, deploy the application using:
    ```bash
    firebase deploy --only hosting
    ```
    The Firebase CLI will use the `apphosting.yaml` configuration file to deploy your Next.js application. After deployment, the CLI will provide you with the URL where your application is live.

    For more details on configuring `apphosting.yaml`, refer to the [Firebase App Hosting documentation](https://firebase.google.com/docs/app-hosting/configure).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts a production server (after building).
- `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.
- `npm run typecheck`: Checks TypeScript types.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run genkit:watch`: Starts the Genkit development server with watch mode.
