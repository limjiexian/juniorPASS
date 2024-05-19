# Installation of PERN JuniorPASS

1. Install PostgreSQL V16.1
2. Install Node.js V16.16.0
3. Install git
4. IDE: Visual Studio Code, Sublime
5. Redis V2.8

# Run your project

1. Clone this repository to your local computer by running this command on Terminal: `git clone https://github.com/yeeqinghew/juniorPASS.git`
2. Run this command to set up DB locally:

   ```
   psql -U postgres
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   \i [file where u cloned your project/juniorPASS/server/database.sql]
   ```

3. Once the repository got cloned into your computer, run these commands to run your FrontEnd on localhost:

   ```
   cd client
   npm install --force
   npm start
   ```

4. Start Redis
   Windows
   4.1 Install WSL:

   ```
   wsl --install
   ```

   4.2 Install Redis on WSL:

   ```
   sudo apt update
   sudo apt install redis-server
   ```

   4.3 Start the Redis server:

   ```
   sudo service redis-server start
   ```

5. Open another terminal to run your BackEnd on localhost:
   ```
   cd server
   npm install
   npx nodemon
   ```
6. App is up running on http://localhost:3000
