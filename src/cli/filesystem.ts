import Handlebars from "handlebars";
import fs from "fs-extra";
import path from "path";
import { IFileSystem } from "../interfaces/filesystem.js";
const root_path = path.dirname(process.argv[1]);

export const WriteFile = async (
  _path_call: string,
  _path_template: string,
  _file: IFileSystem,
  _data: any
) => {
  const file_name =
    _file.extension != null ? _file.name + ".handlebars" : _file.name;
  fs.readFile(
    `${root_path}/${_path_template}/${file_name}`,
    "utf-8",
    (err, f) => {
      if (err) {
        console.log(err);
        return;
      }
      const template = Handlebars.compile(f);
      const result = template(_data);
      const name_file = `${_file.rename != null ? _file.rename : _file.name}${
        _file.extension != null ? "." + _file.extension : ""
      }`;
      const new_file = `${_path_call}/${name_file}`;
      fs.outputFile(new_file, result, () => {
        if (err) {
          console.log(err);
          return;
        }
      });
    }
  );
};

export const CreateDictionary = (_path: string) => {
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true });
  }
};

export const ReadPackageName = async (_path: string, _file: string) => {
  if (await fs.exists(_path)) {
    const data = await fs.readFile(_path + "/" + _file, "utf-8");
    if (data == null || data == undefined || typeof data != "string") return;
    return data.match(/(^.*)/)?.[1].split(" ")[1];
  } else {
    console.log(`not found ${_file}`);
    return;
  }
};
