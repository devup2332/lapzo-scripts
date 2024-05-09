const Colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

type IColor = "red" | "green" | "yellow" | "blue";

export const consoleColor = (text: string, colors: IColor) => {
  return console.log(`${Colors[colors]}${text}${Colors.reset}`);
};
