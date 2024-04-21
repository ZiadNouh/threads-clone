# Threads (A MERN Stack Social Media Web App)

Welcome to Threads Clone, a full-stack social media web app built with the MERN (MongoDB, Express.js, React, Node.js) stack. This project is a clone of the popular Threads app, offering users a familiar and engaging social media experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Screenshots](#screenshots)


## Features

- **Authentication and Authorization:** Secure user authentication using JWT tokens.
- **Interactive User Interface:** A user-friendly interface built with React that enhances the overall user experience.
- **Rich Media Support:** Users can create posts with images, providing a visually appealing platform.
- **Social Interaction:** Like, unlike, reply, and follow/unfollow functionalities for user engagement.
- **Dark/Light Mode:** Customize the user interface based on personal preferences.

## Technologies Used

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1280px-MongoDB_Logo.svg.png" alt="MongoDB" height="50" />
  <img src="https://expressjs.com/images/express-facebook-share.png" alt="Express.js" height="50" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png" alt="React" height="50" />
  <img src="https://cdn.freebiesupply.com/logos/large/2x/nodejs-1-logo-png-transparent.png" alt="Node.js" height="50" />
  <img src="https://miro.medium.com/v2/resize:fit:800/1*8hhfdEqRkRQSaJrJlx60zg.png" alt="Chakra UI" height="50" />
  <img src="https://w7.pngwing.com/pngs/413/267/png-transparent-jwt-io-json-web-token-hd-logo.png" alt="JWT" height="50" />
</p>

- [MongoDB](https://www.mongodb.com/): Database for storing user data and posts.
- [Express.js](https://expressjs.com/): Backend framework.
- [React](https://reactjs.org/): Frontend library for building the user interface.
- [Node.js](https://nodejs.org/): Runtime environment for running server-side code.
- [Chakra UI](https://chakra-ui.com/): React component library for building accessible and customizable UI.
- [Cloudinary](https://cloudinary.com/): Cloud-based image and video management.
- [JWT](https://jwt.io/): JSON Web Tokens for secure authentication.

## Installation

To run this project locally using the VS Code terminal, follow these steps:

1. **Clone the repository:**

   ```plaintext
   git clone https://github.com/your-username/your-project.git
   ```

2. **Navigate to the project directory:**

   ```plaintext
   cd your-project
   ```

3. **Install backend dependencies:**

   ```plaintext
   npm install
   ```

5. **Set up backend environment variables:**

   - Create a `.env` file in the `backend` folder.
   - Add the following variables with appropriate values:

     ```env
     PORT=5000
     MONGO_URI=YOUR_ACTUAL_MONGO_URI_HERE
     JWT_SECRET=YOUR_ACTUAL_JWT_SECRET_HERE
     CLOUDINARY_CLOUD_NAME=YOUR_ACTUAL_CLOUDINARY_CLOUD_NAME_HERE
     CLOUDINARY_API_KEY=YOUR_ACTUAL_CLOUDINARY_API_KEY_HERE
     CLOUDINARY_API_SECRET=YOUR_ACTUAL_CLOUDINARY_API_SECRET_HERE
     # Add any other backend environment variables your project needs
     ```

5. **Run the backend server:**

   ```plaintext
   npm start
   ```

   Ensure the backend server is running on the specified port.

6. **Open a new VS Code terminal and navigate back to the project root:**

   ```plaintext
   cd ..
   ```

7. **Navigate to the frontend folder:**

   ```plaintext
   cd frontend
   ```

8. **Install frontend dependencies:**

   ```plaintext
   npm install
   ```


9. **Run the frontend application:**

    ```plaintext
    npm start
    ```

    This will start the React development server. Open your browser and go to `http://localhost:3000` to view the app.

