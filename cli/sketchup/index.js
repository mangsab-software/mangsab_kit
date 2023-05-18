import inquirer from "inquirer";
import { CreateDictionary, WriteFile } from "../filesystem.js";
const prompt = inquirer.createPromptModule();

export default class Sketchup {
  path_template = "templates/sketchup";
  path_call = process.cwd();

  constructor() {
    this.#controller();
  }

  async #controller() {
    const { option } = await this.#select_options();
    switch (option) {
      case 1:
        this.#new_project();
        break;
    }
  }

  async #select_options() {
    return await prompt({
      name: "option",
      type: "list",
      message: "What is option?",
      choices: [{ name: "New Project", value: 1 }],
    });
  }

  async #new_project() {
    const { module_main } = await prompt({
      name: "module_main",
      type: "input",
      message: "What is module name?",
      default: "Module_Name",
    });

    const { project_name } = await prompt({
      name: "project_name",
      type: "input",
      message: "What is project name?",
      default: "Project_Name",
    });

    const { folder_name } = await prompt({
      name: "folder_name",
      type: "input",
      message: "What is folder name?",
      default: "Module_Name",
    });

    const { creator } = await prompt({
      name: "creator",
      type: "input",
      message: "What is creator name?",
    });

    const { description } = await prompt({
      name: "description",
      type: "input",
      message: "What is description name?",
    });

    const { dictionary } = await prompt({
      name: "dictionary",
      type: "confirm",
      message: "do you wan't create dictionary?",
      default: true,
    });

    let new_path = this.path_call;
    if (dictionary) {
      new_path += "/" + project_name;
      CreateDictionary(new_path);
    }

    const files = [
      { rename: folder_name, name: "first", extension: "rb" },
      { rename: folder_name + "/main", name: "main", extension: "rb" },
      { rename: folder_name + "/loader", name: "loader", extension: "rb" },
      {
        rename: folder_name + "/.gitignore",
        name: ".gitignore.handlebars",
        extension: null,
      },
    ];

    const data = {
      module_main: module_main,
      project_name: project_name,
      folder_name: folder_name,
      creator: creator,
      description: description,
      year: new Date().getFullYear(),
    };
    for (const file of files) {
      WriteFile(new_path, this.path_template, file, data);
    }
  }
}
