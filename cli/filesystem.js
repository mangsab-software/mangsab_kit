import Handlebars from "handlebars";
import fs from "fs-extra";
import path from "path";
const root_path = path.dirname(process.argv[1]);

export const WriteFile = async (_path_call, _path_template, _file, _data) => {
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

export const CreateDictionary = async (_path) => {
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true });
  }
};

export const ReadPackageName = async (_path, _file) => {
  const data = await fs.readFile(_path + "/" + _file, "utf-8");
  return data.match(/(^.*)/)[1].split(" ")[1];
};
