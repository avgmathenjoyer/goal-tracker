# Next.js Goal Tracker

## Overview

Next.js Goal Tracker is a web application built using Next.js. It provides a platform for users to set and track their goals, while also allowing them to measure their progress using various metrics.

## Features

- **Goal Setting**: Users can effortlessly create and establish their goals within the application, enabling them to achieve their objectives more efficiently and effectively.

- **Metric Tracking**: The application enables users to track their progress using customizable metrics. Users can define the metrics that matter most to their goals and update them as they make progress.

- **User Authentication**: Secure user authentication ensures that each user's data is private and accessible only to them. Users can create accounts, log in, and securely access their goal data.

## Getting Started

1. **Clone the Repository**: Clone this repository to your local machine.

   ```bash
   git clone https://github.com/yourusername/nextjs-goal-tracker.git
   ```

2. **Install Dependencies**: Navigate into the project directory and install the necessary dependencies.

   ```bash
   cd nextjs-goal-tracker
   npm install
   ```

3. **Set Up Environment Variables**: Create a `.env.local` file in the root directory and add required environment variables such as database credentials and API keys. You need to set:
    ```ini
    NEXTAUTH_URL= #next auth requires url to api auth endpoint. It should be something like: "http://localhost:3000/api/auth"
    NEXTAUTH_SECRET= #secret used for auth. More infor can be found here https://next-auth.js.org/configuration/options
    GOOGLE_CLIENT_ID= # client id from Google app dashboard
    GOOGLE_CLIENT_SECRET = # client secret from Google app dashboard
    BASE_URL= # base url for your app
    ```

4. **Run the Development Server**: Start the development server and open the application in your browser.

   ```bash
   npm run dev
   ```

5. **Start Tracking Goals**: Access the application in your browser and start setting and tracking your goals!


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
