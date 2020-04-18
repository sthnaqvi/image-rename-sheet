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

const copyFile = (source_path, destination_path) => {
    return fs.copyFileSync(source_path, destination_path);
};


const compareFileAndCopy = (source_dir, dist_dir_match, dist_dir_unmatch, compare_file_names = []) => {
    const all_file_names = getAllFileNames(source_dir);
    ensureDirectory([dist_dir_match, dist_dir_unmatch]);
    const stats = {
        total_files: all_file_names.length,
        compare_files: compare_file_names.length,
        match_files: 0,
        unmatch_files: 0
    }
    for (const file_name of all_file_names) {
        const src_path = path.join(source_dir, file_name);
        if (compare_file_names.includes(parseFileName(file_name))) {
            stats.match_files++;
            const dist_path = path.join(dist_dir_match, file_name);
            copyFile(src_path, dist_path)
        } else {
            stats.unmatch_files++;
            const dist_path = path.join(dist_dir_unmatch, file_name);
            copyFile(src_path, dist_path)
        }
    }
    console.log(`Total file: ${stats.total_files} \nCompare file: ${stats.compare_files} \nMatch file: ${stats.match_files} \nUnmatch File: ${stats.unmatch_files}`)
}

// compareFileAndCopy('./test_data', './match_data', './unmatch_data', ['test', '123', 'abc'])