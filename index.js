#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

// ---------- INPUT ----------
const inputPath = process.argv[2];

if (!inputPath) {
  console.log(chalk.yellow('⚠️ No path provided, using current directory'));
}

const targetPath = inputPath || process.cwd();

let foundPaths = [];

// ---------- VALIDATION ----------
if (!fs.existsSync(targetPath)) {
  console.error(chalk.red('❌ Path does not exist'));
  process.exit(1);
}

// ---------- FIND node_modules ----------
function findNodeModules(dir) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);

      if (item === 'node_modules') {
        foundPaths.push(fullPath);
      } else {
        try {
          if (fs.statSync(fullPath).isDirectory()) {
            findNodeModules(fullPath);
          }
        } catch {}
      }
    }
  } catch {}
}

// ---------- SIZE ----------
function getFolderSize(dir) {
  let size = 0;
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) size += getFolderSize(fullPath);
        else size += stat.size;
      } catch {}
    }
  } catch {}
  return size;
}

function formatSize(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

// ---------- SCAN ----------
async function scan() {
  const spinner = ora('🔍 Scanning for node_modules...').start();

  findNodeModules(targetPath);

  if (foundPaths.length === 0) {
    spinner.fail('No node_modules found');
    process.exit(0);
  }

  foundPaths = foundPaths.map(p => ({ path: p, size: getFolderSize(p) }));

  spinner.succeed(`Found ${foundPaths.length} folders`);
}

// ---------- PROMPT ----------
async function promptUser() {
  const choices = foundPaths.map((f, i) => ({
    name: `${i + 1}. ${f.path} (${formatSize(f.size)})`,
    value: i
  }));

  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Choose action:',
      choices: ['Delete All', 'Select Manually', 'Exit']
    }
  ]);

  if (mode === 'Exit') process.exit(0);

  if (mode === 'Delete All') return foundPaths;

  const { selected } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selected',
      message: 'Select folders to delete:',
      choices
    }
  ]);

  return foundPaths.filter((_, i) => selected.includes(i));
}

// ---------- DELETE ----------
async function deletePaths(selected) {
  const spinner = ora('🗑️ Deleting...').start();

  let deleted = 0;
  let freed = 0;

  const queue = [...selected];
  const workers = Array.from({ length: os.cpus().length }, async () => {
    while (queue.length) {
      const item = queue.pop();
      if (!item) return;

      try {
        await fs.promises.rm(item.path, { recursive: true, force: true });
        deleted++;
        freed += item.size;
      } catch {}
    }
  });

  await Promise.all(workers);

  spinner.succeed('Deletion completed');

  console.log(chalk.green(`\n✅ Deleted: ${deleted}`));
  console.log(chalk.blue(`💾 Freed: ${formatSize(freed)}`));
}

// ---------- MAIN ----------
async function main() {
  console.log(chalk.cyan(`\nNode Modules Cleaner\n`));

  await scan();
  const selected = await promptUser();

  if (!selected || selected.length === 0) {
    console.log(chalk.yellow('Nothing selected'));
    process.exit(0);
  }

  await deletePaths(selected);
}

main();