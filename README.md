## Setting up development environment 🛠

- Install [Nodejs](https://nodejs.org/en/download/) if you don't have it already (preferrably version 10 and above).
- Install [angular-cli](https://cli.angular.io/) if you don't have it already .
- `git clone https://github.com/shootermv/movie-app-taldor.git`
- `npm run install-dependencies`
- `cd server && npm start`
- `cd client && npm start` in another terminal tab
- App should now be running on `http://localhost:8080/`

## Run client at docker container
- `cd client`
- `docker build -t angular-docker-app .`
