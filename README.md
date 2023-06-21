# Spotify Palette
Spotify Palette is a web application built using React and the Spotify Web API that allows users to discover their music taste through a unique color palette generated based on their top tracks. By connecting their Spotify account, users can analyze their top tracks' audio features and receive a visually appealing representation of their music preferences.

## Features
* Connect your Spotify account to retrieve your top tracks.
* Choose between 10 pairs of your top tracks, indicating your preference for each pair.
* Analyze the audio features (danceability, energy, valence, tempo) of your selected tracks.
* Generate a color palette based on the analyzed audio features.
* View a short description that represents your music taste based on the generated color palette.

## Installation
To run the Spotify Palette application locally, follow these steps:
1. Clone this repository
2. Run "npm install" in the client and server directories
3. Visit the [Spotify Web API](https://developer.spotify.com/) website to create an app
4. Point the redirect uri of your app to http://localhost:5173
5. Modify the config.js and config.jsx files to add your client secret and client id
6. Run "npm run dev" in the client directory
7. In another terminal, cd into the server directory and run "nodemon server.js"
8. The project should now be running on http://localhost:5173

## Usage
1. On the landing page, click the "Login with Spotify" button to authenticate with your Spotify account.
2. After successful authentication, you will be redirected back to the application.
3. The application will retrieve your top tracks from Spotify, and you will be presented with 10 pairs of tracks to choose from. Select your preferred track for each pair by clicking on the corresponding album cover.
4. Once you have made your choices for all pairs, the application will generate a color palette based on the audio features of your selected tracks.

## Demo
![Login screen](https://i.imgur.com/PfgMsIg.png)
![Selection 1](https://i.imgur.com/0CiydxG.png)
![Selection 2](https://i.imgur.com/nL6KiqW.png)
![Result screen](https://i.imgur.com/Zt5aoXG.png)

## Technologies Used
* React
* Spotify Web API
* Axios

## Contact
If you have any questions, suggestions, or feedback, please feel free to reach out to the repository owner at brianwindev@gmail.com
