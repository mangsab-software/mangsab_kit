#!/usr/bin/env node
import figlet from "figlet";
import inquirer from "inquirer";
const prompt = inquirer.createPromptModule();
import Golang from "./cli/golang/index.js";
import Sketchup from "./cli/sketchup/index.js";

const select_mode = async () => {
  return await prompt({
    name: "mode",
    type: "list",
    message: "what is mode?",
    choices: [
      { name: "Golang", value: 1 },
      { name: "Sketchup", value: 2 },
    ],
  });
};

(async () => {
  await figlet("Mangsab Kit", async (_, data) => {
    console.log(data);
    const { mode } = await select_mode();
    switch (mode) {
      case 1:
        new Golang();
        break;
      case 2:
        new Sketchup();
        break;
    }
  });
})();
