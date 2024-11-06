# AquaMind AI: Your AI-Powered Aquarium Stocking Assistant

## Overview

Welcome to **AquaMind**! AquaMind is an AI-driven assistant that empowers aquarium enthusiasts of all levels to easily manage and care for their aquariums. By leveraging advanced AI, AquaMind provides custom recommendations tailored to the unique needs and conditions of your aquarium, making it simple for anyone to make informed decisions on stocking, maintenance, and overall aquarium health. Whether you're a beginner or a pro, AquaMind makes it easy to learn how to create and maintain a thriving aquatic environment, with advice and guidance perfectly matched to your setup. From personalized care insights to interactive management features, AquaMind helps make aquarium care more accessible, engaging, and stress-free.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Future Improvements](#future-improvements)

## Demo

Check out the live demo: [Link to demo](https://www.aquamind.fish)

## Features 🌊

### 1. AI-Powered Stocking Recommendations 🐠

AquaMind analyzes your aquarium specifications—tank size, water type, existing species, and more—to provide intelligent stocking recommendations. It considers fish compatibility, tank requirements, bioload, and user preferences to create a balanced and thriving aquarium environment.

### 2. Conversational Advice with LLM Integration 🤖 💬

Our AquaMind is directly powered by ChatGPT, to provide detailed explanations and answer your questions in a conversational manner. Get expert-level advice, follow-up recommendations, and detailed care instructions just by chatting with AquaMind AI.

### 3. Easy Aquarium Monitoring & Logging 📊🐠

With AquaMind's intuitive monitoring and logging features, keeping track of your aquarium's health has never been easier. Log key parameters like water temperature, pH levels, nitrate levels, and more, all within the app. AquaMind uses this data to provide real-time insights and alerts, helping you spot trends and identify potential issues early. This continuous monitoring empowers you to make timely adjustments, ensuring your aquarium remains a stable and healthy environment for your aquatic life.

### 4. Fish and Plant Compatibility Checker 🐟🌿

A built-in compatibility checker helps you identify potential conflicts between fish species, plants, and invertebrates. Understand which combinations work best for your setup and which to avoid to maintain a harmonious aquatic environment.

### 5. Personalized Care and Maintenance Suggestions 📝

Get personalized care instructions, feeding schedules, and maintenance tips based on your aquarium setup and the species you keep. AquaMind AI continuously learns from user interactions to provide more tailored advice over time.

### 6. IoT realtime connectivity (Coming soon) 🌐📡

AquaMind will soon connect with IoT sensors placed in your aquarium to monitor real-time water conditions, such as temperature, pH, ammonia, and nitrate levels. These sensors will transmit live data via AWS IoT services and process the information using Amazon SQS or Amazon Kinesis to ensure reliable, scalable data streams.

## Tech Stack

### Frontend:

- **React**: User interface for managing aquariums and viewing data.

### Backend:

- **Go**: Microservices architecture for handling API requests and business logic.
- **GPT-4**: AI integration for delivering personalized advice.

### Database:

- **PostgreSQL**: Secure, relational database for storing tank data and user profiles.

### Infrastructure:

- **Kubernetes**: Orchestrates microservices for scalability and fault tolerance.
- **Docker**: Containerize individual backend services to be handled by Kubernetes
- **AWS**: Cloud infrastructure for hosting, scaling, and managing resources.

### Monitoring:

- **Prometheus**: Real-time monitoring of application performance and metrics.
- **Grafana**: Visual dashboard for monitoring tank conditions and system health.

## Setup and Installation

- **React** installed on your machine.
- AWS account with IAM privileges for utulized services
- **AWS CLI** or other means to configure AWS credentials.

### Clone the Repository

```bash
git clone https://github.com/stevenpstansberry/AquaMind-AI.git
cd AquaMind-AI/Frontend
```

### Install Dependencies

```bash
npm install
```

### Set up Environmnetal Variables

If you wish to obtain the neccessary API keys and other secrets please feel free to contact me!
If you already obtained such information, declare the following in your .env file within the frontend.

```bash
REACT_APP_AQUAMIND_PROD_URL=<your_aquamind_prod_url>
REACT_APP_AQUAMIND_PROD_KEY=<your_aquamind_prod_key>
REACT_APP_OPENAI_API_URL=<your_openai_api_url>
```

### Run the Application

Start the development server

```bash
npm start
```

This will run the app locally at http://localhost:3000 by default

## Future Improvements

1. Implement a mobile app
2. Social Features - Add abilty to view other's aquariums
3. Add wish list
