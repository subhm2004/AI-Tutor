# AI Tutor  🤖📚

This project is a comprehensive AI Tutor application designed to provide personalized learning experiences. It features a dynamic frontend built with Next.js and a robust backend powered by Flask, enabling real-time chat interactions and intelligent tutoring assistance. The application allows users to engage in conversations with an AI tutor, receive explanations, and explore various educational topics.

## 🚀 Key Features

- **Interactive Chat Interface:** A user-friendly interface for engaging in conversations with the AI tutor.
- **Real-time Responses:** The backend provides quick and relevant responses to user queries.
- **Markdown Rendering:** Supports rendering of Markdown content, including code snippets and formatted text.
- **Mathematical Expression Rendering:** Renders mathematical expressions using a custom `MathRenderer` component.
- **Theme Support:** Offers light and dark theme options for a comfortable user experience.
- **Chat History Management:** Allows users to manage and revisit previous chat sessions.
- **Backend API:** Provides endpoints for chat interactions, health checks, and agent management.
- **Agent Management:** Supports the management and status monitoring of AI tutor agents.
- **Local Storage Persistence:** Chat sessions are saved to local storage, ensuring data persistence across sessions.

## 🛠️ Tech Stack

- **Frontend:**
    -   **Framework:** Next.js
    -   **UI Library:** React
    -   **Styling:** Tailwind CSS, CSS Modules
    -   **Animation:** Framer Motion
    -   **Icons:** Lucide React
    -   **Markdown Rendering:** react-markdown, remark-gfm
    -   **UI Components:** Radix UI
    -   **Themeing:** next-themes
    -   **Typescript:** For type safety
- **Backend:**
    -   **Framework:** Flask (Python)
    -   **WSGI Server:** Gunicorn
    -   **CORS:** flask_cors
    -   **Environment Variables:** dotenv
- **Other:**
    -   **Concurrency:** concurrently (for running frontend and backend in parallel during development)
    -   **Package Manager:** npm

## 📦 Getting Started

### Prerequisites

- Node.js (>=18)
- Python (>=3.6)
- npm or yarn
- A virtual environment (recommended for Python dependencies)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd ai-tutor
    ```

2.  **Set up the backend:**

    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    ```

3.  **Set up the frontend:**

    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Install root dependencies:**

    ```bash
    npm install
    ```

### Running Locally

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This command will start both the frontend (Next.js) and backend (Flask) servers concurrently. The frontend will typically run on `http://localhost:3000`, and the backend on `http://localhost:5000`.

## 📂 Project Structure

```
ai-tutor-root/
├── backend/
│   ├── app.py            # Flask backend application
│   ├── Procfile          # Procfile for deployment
│   ├── requirements.txt  # Backend dependencies
│   └── agents/           # AI agent related files
│       └── tutor_agent.py # Tutor agent logic
├── frontend/
│   ├── app/              # Next.js application directory
│   │   ├── page.tsx       # Main page component
│   │   └── layout.tsx     # Root layout component
│   ├── components/       # Reusable React components
│   │   ├── chat-interface.tsx # Chat interface component
│   │   └── chat-sidebar.tsx   # Chat sidebar component
│   ├── utils/            # Utility functions
│   │   └── api.ts         # API utility for backend communication
│   ├── types/            # TypeScript type definitions
│   │   └── chat.ts        # Chat related type definitions
│   ├── public/           # Static assets
│   ├── next.config.mjs   # Next.js configuration
│   ├── package.json      # Frontend dependencies and scripts
│   ├── tsconfig.json     # TypeScript configuration
│   └── tailwind.config.ts # Tailwind CSS configuration
├── package.json          # Root package manifest
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

For questions or feedback, please contact subhu04012003@gmail.com.

