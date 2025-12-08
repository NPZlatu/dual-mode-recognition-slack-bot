import dotenv from "dotenv";
dotenv.config();

// RECOGNITION MESSAGES
export const FIRST_COMMIT_RECOGNITION: string = `🎉 *Well done Niraj!*\nYou’ve just made your *first commit* — that’s where every great project begins. Keep the momentum going, one commit at a time. 🚀`;
export const FIRST_CI_PASS_AFTER_FAILURE: string = `🎉 *Great job Niraj!*\nYour latest commit has passed all CI checks after previous failures. Your persistence and attention to detail are paying off. Keep up the excellent work! 🚀`;

export const TRELLO_DONE_RECOGNITION = (cardName: string) => {
  return (
    `🎉 Outstanding work — the task *${cardName}* is DONE ✅\n\n` +
    `Your focus, ownership, and attention to quality made this happen. 🚀 `
  );
};
// SLACK CONFIG
export const SLACK_USER_EMAIL = "nirazlatu@gmail.com";
export const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

//DB CONFIG
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_NAME = process.env.DB_NAME || "tiny_wins_db";
export const DB_URL = `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;

//CRON CONFIG
// export const CRON_PATTERN = "0 18 * * *"; // everyday at 6PM
export const CRON_PATTERN = "*/20 * * * * *"; // every 2 seconds
