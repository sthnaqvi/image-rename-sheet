'use strict';

const fs = require('fs-extra');
const path = require('path');

const parseFileName = (file_path) => path.basename(file_path, path.extname(file_path));

const ensureDirectory = (dir_paths = []) => {
    for (const dir_path of dir_paths) {
        fs.ensureDirSync(dir_path);
    }
};

const getAllFileNames = (dir_path) => {
    return fs.readdirSync(dir_path);
};

const renameFile = (old_path, new_path) => {
    return fs.renameSync(old_path, new_path);
};

const getRenameMap = (path = './rename.txt') => {
    const rename_data = fs.readFileSync(path, "utf-8");
    const rename_map = {};
    for (const data of rename_data.split("\n")) {
        const [key, value] = data.split("\t");
        rename_map[key] = value;
    }
    return rename_map;
}

const findAndRenameAllFiles = (source_dir, dest_dir) => {
    ensureDirectory([dest_dir]);
    const all_file_names = getAllFileNames(source_dir);
    const rename_map = getRenameMap();
    const stats = {
        total_files: all_file_names.length,
        renamed_files: 0,
        error_files: 0,
    }
    for (const original_file_name of all_file_names) {
        try {
            const file_name = parseFileName(original_file_name);
            const new_file_name = rename_map[file_name];
            const file_ext = path.extname(original_file_name);
            const new_file_name_with_ext = new_file_name + file_ext;
            const src_path = path.join(source_dir, original_file_name);
            const dist_path = path.join(dest_dir, new_file_name_with_ext);
            renameFile(src_path, dist_path);
            stats.renamed_files++
        } catch (error) {
            stats.error_files++
            console.log(error);
        }
    }
    if (stats.error_files) {
        console.log(`Errors file:  ${stats.error_files}`)
    }
    console.log(`Total file: ${stats.total_files} \Rename file: ${stats.renamed_files}`)
}

// findAndRenameAllFiles('./test_data', './new_test_data')