# Meni

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

Refer to the respective docs for all the technologies used for Meni.

- [Next.js](https://nextjs.org)
- [Clerk](https://clerk.com/docs)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/en/introduction)
- [Learn the T3 Stack](https://www.youtube.com/watch?v=YkOSUVzOAA4) — Very good tutorial



## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

- [Node.js](https://nodejs.org/) version 18.x - Recommend to use [nvm](https://github.com/nvm-sh/nvm) for version management
    ```bash
    nvm install 18
    nvm use 18
    ```
- [Yarn](https://github.com/yarnpkg/yarn) - Install Yarn globally
    ```bash
    npm install -g yarn
    ```

### Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:brian-ngyn/Meni.git
    ```
2. Change into the project directory:
    ```bash
    cd Meni
    ```
3. Install dependencies:
    ```bash
    yarn install
    ```

## Project Structure

```lua
/Meni
|-- packages
|   |-- dashboard-site
|   |   |-- prisma
|   |   |-- src
|   |   |   |-- ... (react code)
|   |   |   |-- server (trpc backend)
|   |   |-- .env
|   |-- explore-site
|   |   |-- prisma
|   |   |-- src
|   |   |   |-- ... (react code)
|   |   |   |-- server (trpc backend)
|   |   |-- .env
|-- ...
```

## Development Workflow
1. Grab the environment variables for dashboard and explore site from [Discord](https://discord.com/channels/1062460895164383252/1070818506502844508)
2. Place them in their respective folders in a ```.env``` file
3. Run the app (from the root folder):
    ```bash
    yarn dev
    ```
4. Open your browser and go to http://localhost:3000 for dashboard and  http://localhost:3001 for explore
5. Optionally, only start the dashboard or explore sites by running the following (from the root folder):
    ```bash
    yarn dev:dashboard
    yarn dev:explore
    ```