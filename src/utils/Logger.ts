import fs from "fs";
import { DateTime } from "luxon";
import path from "path";

/**
 * Safely converts the provided object to a JSON string, handling circular references.
 * @param obj - The object to be stringified.
 * @param indent - The number of spaces to use for indentation.
 * @returns The JSON string representation of the object.
 */
function safeStringify(obj: any, indent = 2): string {
  let cache: any = [];
  const result = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return result;
}

/**
 * Logs a message with the provided content to the appropriate log file.
 * @param level - The log level ("info", "warn", or "error").
 * @param message - The log message.
 * @param content - The content to be logged.
 */
function log(level: "info" | "warn" | "error", message: string, content: any) {
  // Ensure content is an object
  const logContent =
    typeof content === "object" ? content : { message: safeStringify(content) };

  // Create a formatted log entry with timestamp
  const timestamp = DateTime.now()
    .setZone("Africa/Lagos")
    .toFormat("yyyy-LL-dd HH:mm:ss");

  // Get the line number and file where the function was called
  const stackLine = new Error().stack?.split("\n")[3] || "";
  const lineNumber = stackLine.split(":")[1];
  const filePath = stackLine.split("(")[1]?.split(":")[0] || "unknown";

  const logEntry = `
[${level.toUpperCase()}] [${timestamp}] 
[File: ${filePath}] [Line: ${lineNumber}]
${message}

${safeStringify(logContent, 2)}

`;

  // Specify the path to the log file
  const logDir = "logs";
  const logFilePath = path.join(logDir, `${level}.log`);

  // Ensure the log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append the log entry to the appropriate log file
  fs.appendFileSync(logFilePath, logEntry, "utf-8");
}

/**
 * Logs an informational message.
 * @param message - The log message.
 * @param content - The content to be logged.
 */
function info(message: string, content?: any) {
  log("info", message, content);
  console.log("\x1b[34m", message, "\x1b[0m");
}

/**
 * Logs a warning message.
 * @param message - The log message.
 * @param content - The content to be logged.
 */
function warn(message: string, content?: any) {
  log("warn", message, content);
  console.log("\x1b[33m", message, "\x1b[0m");
}

/**
 * Logs an error message.
 * @param message - The log message.
 * @param content - The content to be logged.
 */
function error(message: string, content?: any) {
  log("error", message, content);
  console.log("\x1b[31m", message, content, "\x1b[0m");
}

export default {
  error,
  info,
  warn,
};
