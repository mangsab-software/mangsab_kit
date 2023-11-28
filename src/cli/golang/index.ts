import inquirer from "inquirer";
import { exec } from "node:child_process";
import { CreateDictionary, WriteFile, ReadPackageName } from "../filesystem.js";
import { IFileSystem } from "../../interfaces/filesystem.js";
import path from "path";
const prompt = inquirer.createPromptModule();

export default class Golang {
  path_template = "templates/golang";
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
        this.#generate_resource();
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
        { name: "Generate Resource", value: 2 },
        { name: "Exit", value: null },
      ],
    });
  }

  async #new_project() {
    const { project_name } = await prompt({
      name: "project_name",
      type: "input",
      message: "What is project name?",
      default: "Project_Name",
    });

    const { dictionary } = await prompt({
      name: "dictionary",
      type: "confirm",
      message: "do you wan't create dictionary?",
      default: true,
    });

    let new_path = this.path_call;
    if (dictionary) {
      new_path = path.join(new_path, project_name)
      CreateDictionary(new_path);
    }

    exec(`go mod init ${project_name}`, {cwd: new_path}, (error) => {
      if (error) console.log("can't run go mod init");
    });

    const files: IFileSystem[] = [
      { name: "main", extension: "go" },
      { name: "database/gorm", extension: "go" },
      { name: "database/redis", extension: "go" },
      { name: "routes/router", extension: "go" },
      { name: "dockerfile", extension: null },
      { rename: ".gitignore", name: "gitignore.handlebars", extension: null },
      {
        rename: ".env.example",
        name: "env.example.handlebars",
        extension: null,
      },
    ];

    const data = { project_name: project_name };
    for (const file of files) {
      WriteFile(new_path, this.path_template, file, data);
    }
  }

  async #generate_resource() {
    const { resource_name } = await prompt({
      name: "resource_name",
      type: "input",
      message: "What is resource name?",
      default: "resource",
    });
    const files = [
      { rename: `${resource_name}_dto`, name: "dto", extension: "go" },
      { rename: `${resource_name}_handler`, name: "handler", extension: "go" },
      {
        rename: `${resource_name}_interface`,
        name: "interface",
        extension: "go",
      },
      { rename: `${resource_name}_model`, name: "model", extension: "go" },
      {
        rename: `${resource_name}_repository`,
        name: "repository",
        extension: "go",
      },
      {
        rename: `../../routes/${resource_name}_routes`,
        name: "resource_route",
        extension: "go",
      },
      { rename: `${resource_name}_usecase`, name: "usecase", extension: "go" },
    ];
    const project_name = await ReadPackageName(this.path_call, "go.mod");
    const new_path = this.path_call + "/packages/" + resource_name;
    const data = {
      project_name: project_name,
      package_name: resource_name,
      name: resource_name.charAt(0).toUpperCase() + resource_name,
    };
    CreateDictionary(new_path);
    for (const file of files) {
      WriteFile(new_path, this.path_template + "/resource", file, data);
    }
  }
}
