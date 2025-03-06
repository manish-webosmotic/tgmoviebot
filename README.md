# Telegram Movie Bot

A Telegram bot that enables users to save and manage movie files within a group chat.

## Features

- Save video files with custom names
- Auto-rename duplicates with random numbers
- Retrieve movies using `/movie` command
- List all available movies
- Get current chat ID
- Access movie database via JSON

## Prerequisites

- Node.js
- Telegram Bot Token
- Group Chat ID

## Installation

1. Clone the repository
2. Install dependencies:
   ```npm install```
3. Create `.env` file with:
   ```
   BOT_TOKEN=your_bot_token
   GROUP_ID=your_group_id
   ```

## Usage

- Start bot: `npm start`
- Development mode: `npm run dev`
- Send video with caption to save
- Use `/movie moviename` to retrieve

## Tech Stack

- Node.js
- Telegraf.js
- dotenv
- File System (fs)

## Data Storage

Movies are stored in `db.json` as key-value pairs (name:fileId)

## Command List
- Upload movie - Send Movie in your private movie video file in DB group with movie name in caption
- Get Movie - `/movie movie_name` Ex. `/movie ironman`
- List all movies avaiable in bot - `/list`
- To get your movie group Id - `/id`
- To download movie DB - `/getdb`
