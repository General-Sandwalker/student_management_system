# 🎓 Student Management System

Welcome to the Student Management System project! You can deploy it effortlessly with Docker Compose or develop within a DevContainer environment. 🚀

## 🚢 Deployment with Docker Compose

To deploy the application using Docker Compose:

1. 🛠️ Ensure you have Docker and Docker Compose installed on your system.
2. 📄 Create a `.env` file in the root directory and define the required environment variables:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
3. ▶️ Run the following command to start the services:
   ```bash
   docker-compose up --build
   ```
4. 🌐 Access the application:
   - Admin Frontend: [http://localhost:4200](http://localhost:4200)
   - Student Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## 💻 Development with DevContainer

To develop the application using DevContainer:

1. 🖥️ Install [Visual Studio Code](https://code.visualstudio.com/) and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. 📂 Open the project folder in VS Code.
3. 🔄 When prompted, reopen the folder in the DevContainer.
4. ⚙️ The container will automatically install dependencies and set up the environment.
5. 🌐 Use the following ports to access the services:
   - Admin Frontend: [http://localhost:4200](http://localhost:4200)
   - Student Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## 📝 Notes

- 🗄️ The database service uses PostgreSQL and persists data in the `db_data` volume.
- 🛠️ The DevContainer includes pre-installed tools like Node.js, Python, and Docker CLI for seamless development.

