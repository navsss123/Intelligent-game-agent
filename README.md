# Intelligent Game Agent (IGA)

**An AI-powered Minecraft agent that autonomously explores, generates live commentary, and speaks via TTS — designed as an experimental step toward intelligent in-game companions and VTubers.**  

---

## 🔹 Overview
IGA is a real-time Minecraft agent that:  

- Navigates the Minecraft world autonomously using **Mineflayer** and pathfinding.  
- Observes nearby blocks and mobs to provide ** commentary**.  
- Generates engaging, context-aware narration using **OpenAI GPT-4.1-mini**.  
- Converts commentary to speech using **edge-tts** with queued audio playback to prevent overlap.  

This project demonstrates **AI integration, asynchronous programming, and multimodal interaction** in a gaming environment.  

---

## 🔹 Features
- **Autonomous Exploration:** Randomized pathfinding with block detection to avoid obstacles.  
- **AI Commentary:** Narrates actions, nearby blocks, and mobs naturally.  
- **Text-to-Speech:** Real-time audio narration using Edge-TTS.  
- **Queue Management:** Prevents overlapping speech for smooth listening.
-  **Dead-End Recovery** – Dynamically breaks blocks to escape pits or obstacles 

---

## 🔹 Live Demo
You can see **Intelligent Game Agent (IGA)** in action here:  


https://github.com/user-attachments/assets/db807149-139e-4637-ae56-93cceceac3f8




- The bot explores the Minecraft world autonomously.  
- Generates AI-driven commentary about nearby blocks and mobs.  
- Speaks using real-time text-to-speech for a full immersive experience.  

---
### 🪓 Intelligent Path Recovery



https://github.com/user-attachments/assets/8f060ae9-65bc-4649-a239-33c0d5ab77b5



- The bot accidentally falls into a pit, becoming trapped.  
- Instead of halting, it triggers its **Dead-End Recovery** routine.  
- Using its equipped sword, it systematically clears obstructing blocks.  
- Once the path is open, the agent **jumps out of the hole** and resumes exploration.  

This demonstrates how IGA combines **Minecraft environment awareness** with **AI-driven action sequences** to autonomously recover from dead-ends.


## 🔹 Tech Stack
- **Node.js** (ES Modules)  
- **Mineflayer + mineflayer-pathfinder** (Minecraft bot and pathfinding)  
- **OpenAI GPT-4.1-mini** (AI commentary)  
- **edge-tts** (Text-to-Speech)  
- **play-sound / ffplay** (Audio playback)  
- **Utilities:** fs, os, path, child_process  

---
## 🚀 Future Improvements

- 🧠 **Context-Aware Commentary** – Enhance GPT-driven narration so the bot speaks about real in-game events, surroundings, and goals rather than random chatter.  
- 🎮 **Expanded Minecraft Actions** – Add support for advanced interactions such as building, farming, combat strategies, and resource gathering.  
- 🗺️ **Goal-Oriented Behavior** – Implement task-based planning (e.g., “find wood,” “build shelter”) for structured gameplay.  
- 🔊 **Improved TTS Voices** – Use more natural and expressive voice models for commentary.  
- 🤝 **Multi-Agent Collaboration** – Allow multiple IGA bots to coordinate and achieve shared objectives in the same world.  


## 🔹 Setup Instructions

1. **Clone the repository:**


git clone https://github.com/yourusername/intelligent-game-agent.git
cd intelligent-game-agent


2. **Install dependencies**

      npm install


3. **Add your environment variables**
    Create a .env file:

   OPENAI_API_KEY=your_api_key_here


4. **Start the bot**

   npm start


---

## 📜 License  
This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.

