import inquirer from "inquirer";
import { CreateDictionary, WriteFile } from "../filesystem.js";
import { IFileSystem } from "../../interfaces/filesystem.js";
import JSZip from "jszip";
import { createWriteStream } from "fs";
import { glob } from "glob";
import path from "path";
import { readFile } from "fs/promises";
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
      case 2:
        this.#generate_rbz();
        break;
      default:
        process.exit(0);
    }
  }

  async #select_options() {
    return await prompt({
      name: "option",
      type: "list",
      message: "What is option?",
      choices: [
        { name: "New Project", value: 1 },
        { name: "Generate RBZ", value: 2 },
        { name: "Exit", value: null },
      ],
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

    const files: IFileSystem[] = [
      { rename: folder_name, name: "first", extension: "rb" },
      { rename: folder_name + "/main", name: "main", extension: "rb" },
      { rename: folder_name + "/loader", name: "loader", extension: "rb" },
      {
        rename: ".gitignore",
        name: "gitignore.handlebars",
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

  async #generate_rbz() {
    const { project_name } = await prompt({
      name: "project_name",
      type: "input",
      message: "What is project name?",
      default: this.path_call,
    });
    const zip = new JSZip();
    let name = "mangsab_generate";
    if (project_name != this.path_call) {
      name = project_name;
      const files = await glob(this.path_call + `/${project_name}/**/*`, {
        nodir: true,
      });
      for (const file of files) {
        const fileData = await readFile(file);
        zip.file(file.replace(project_name+"\\", ''), fileData);
      }
    } else {
      const files = await glob(this.path_call + "/**/*", { nodir: true });
      for (const file of files) {
        const fileData = await readFile(file);
        zip.file(file, fileData);
      }
      name = path.basename(this.path_call);
    }
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(createWriteStream(name+'.rbz'))
      .on('finish', function () {
          console.log(`Generate ${name}.rbz Success`);
      });
  }
}
