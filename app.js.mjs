import mineflayer from 'mineflayer';
import pkg from 'mineflayer-pathfinder';
const { pathfinder, Movements, goals } = pkg;
const { GoalNear } = goals;
import fs from 'fs';
import { exec } from 'child_process';
import player from 'play-sound';
import { Vec3 } from 'vec3';
import OpenAI from 'openai';
import os from 'os';
import path from 'path';

const audioPlayer = player({ players: ['ffplay'] });
let isSpeaking = false;
let commentaryQueue = [];

// === OpenAI API Key ===
const envPath = 'C:\\Users\\saisa\\sarvesh\\OPENAI_API_KEY.env';
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/OPENAI_API_KEY=(.*)/);
if (!match) throw new Error("OPENAI_API_KEY not found in file");
const apiKey = match[1].trim();
const openai = new OpenAI({ apiKey });

// === Create Minecraft Bot ===
const bot = mineflayer.createBot({
  host: 'localhost',
  port: 25565,
  username: 'angelica._',
  version: '1.20.4'
});

let mcData;

bot.once('spawn', async () => {
  const mcDataModule = await import('minecraft-data');
  mcData = mcDataModule.default(bot.version);

  const defaultMove = new Movements(bot, mcData);
  bot.loadPlugin(pathfinder);
  bot.pathfinder.setMovements(defaultMove);

  speak("Hey everyone! Let's explore some Minecraft!");

  // Random movement every 2 seconds
  setInterval(wanderRandomly, 2000);

  // Continuous commentary every 5 seconds
  setInterval(generateCommentary, 5000);
});

// === Random Movement ===
function wanderRandomly() {
  if (!bot.entity || !bot.entity.position) return;

  const dx = Math.floor(Math.random() * 10 - 5);
  const dz = Math.floor(Math.random() * 10 - 5);
  const x = Math.floor(bot.entity.position.x + dx);
  const z = Math.floor(bot.entity.position.z + dz);

  let y = Math.floor(bot.entity.position.y + 5);
  let foundGround = false;
  while (y > 0) {
    const block = bot.blockAt(new Vec3(x, y, z));
    if (block && block.boundingBox === 'block') {
      foundGround = true;
      break;
    }
    y--;
  }

  if (foundGround) {
    bot.pathfinder.setGoal(new GoalNear(x, y + 1, z, 1));
  }
}

// === Generate DanTDM-Style Commentary ===
async function generateCommentary() {
  if (!bot.entity || !bot.entity.position) return;

  const pos = bot.entity.position;

  // Nearby blocks & mobs
  const nearbyBlocks = [];
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        const block = bot.blockAt(new Vec3(pos.x + dx, pos.y + dy, pos.z + dz));
        if (block) nearbyBlocks.push(block.name);
      }
    }
  }

  const nearbyMobs = Object.values(bot.entities)
    .filter(e => e.type === 'mob' && e.position.distanceTo(pos) < 10)
    .map(m => m.name);

  // Current action
  let currentAction;
  if (bot.pathfinder.isMoving()) currentAction = "walking around exploring";
  else currentAction = "standing still";

  // Build strict DanTDM-style prompt
  let prompt = `You are Angelica, a calm and engaging Minecraft YouTuber like DanTDM.
Always narrate exactly what you are doing and what you see in the game.
Describe your actions, the blocks, mobs, and environment around you naturally for an audience.
Current action: ${currentAction}
Nearby blocks: ${[...new Set(nearbyBlocks)].join(', ')}`;
  if (nearbyMobs.length) prompt += `\nNearby mobs: ${[...new Set(nearbyMobs)].join(', ')}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    const commentary = response.choices[0].message.content;
    speak(commentary);
  } catch (err) {
    console.error("Error generating commentary:", err);
  }
}

// === Text-to-Speech using VB-Cable ===
async function speak(text) {
  commentaryQueue.push(text);

  if (isSpeaking) return;

  while (commentaryQueue.length > 0) {
    const ttsText = commentaryQueue.shift();
    isSpeaking = true;

    const tempTextFile = path.join(os.tmpdir(), `tts_${Date.now()}.txt`);
    const filePath = path.join(os.tmpdir(), `bot_speech_${Date.now()}.mp3`);
    fs.writeFileSync(tempTextFile, ttsText, 'utf-8');

    await new Promise((resolve) => {
      // Edge-TTS generates MP3
      exec(`edge-tts --file "${tempTextFile}" --write-media "${filePath}"`, (err, stdout, stderr) => {
        if (err) console.error('TTS generation error:', err);
        if (stderr) console.error('TTS stderr:', stderr);

        // Play through default audio device (VB-Cable)
        audioPlayer.play(filePath, { afplay: [], ffplay: ['-nodisp', '-autoexit'] }, (playErr) => {
          if (playErr) console.error('Playback error:', playErr);

          setTimeout(() => {
            fs.access(filePath, fs.constants.F_OK, (accessErr) => {
              if (!accessErr) fs.unlink(filePath, () => {});
              fs.unlink(tempTextFile, () => {});
              resolve();
              isSpeaking = false;
            });
          }, 500);
        });
      });
    });
  }
}
