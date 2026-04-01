# 🚀 wipe-node-modules

> Fancy CLI tool to recursively find and delete `node_modules` folders with style, speed, and safety.

---

## ✨ Features

* 🔍 Recursive scan for all `node_modules` (including nested)
* 📋 Interactive selection (checkbox UI)
* 🎨 Beautiful CLI (colors, spinners)
* ⚡ Parallel deletion (multi-core performance)
* 📊 Folder size calculation before deletion
* 💾 Total space freed after cleanup
* ⚠️ Warns when no path is provided (uses current directory)

---

## 📦 Installation

### Global install

```bash
npm install -g wipe-node-modules
```

### Run with npx

```bash
npx wipe-node-modules
```

---

## 🚀 Usage

```bash
wipe-node-modules [path]
```

### Examples

#### 1. Run in current directory

```bash
wipe-node-modules
```

> ⚠️ Shows warning and scans current folder

#### 2. Provide a specific path

```bash
wipe-node-modules ./my-project
```

---

## 🧠 How it works

1. Scans for all `node_modules` folders
2. Displays them with:

   * index number
   * full path
   * folder size
3. Prompts you to:

   * Delete all
   * Select specific folders
   * Exit
4. Deletes selected folders in parallel
5. Shows:

   * total deleted folders
   * total disk space freed

---

## 🖥️ CLI Preview

```
Node Modules Cleaner

⚠️ No path provided, using current directory

✔ Found 5 folders

? Choose action:
❯ Delete All
  Select Manually
  Exit

? Select folders to delete:
◉ 1. /project/a/node_modules (120 MB)
◯ 2. /project/b/node_modules (80 MB)

🗑️ Deleting...

✅ Deleted: 2
💾 Freed: 200 MB
```

---

## ⚙️ Requirements

* Node.js >= 16

---

## 🧪 Development

```bash
git clone https://github.com/ELAVARASAN-23/wipe-node-modules.git
cd wipe-node-modules
npm install
npm link
```

Run locally:

```bash
wipe-node-modules
```

---

## 🔄 Versioning

This project follows **Semantic Versioning**:

* `patch` → bug fixes
* `minor` → new features
* `major` → breaking changes

---

## 🚀 Publish

```bash
npm login
npm publish --access public
```

---

## 🏷️ Badges

![npm](https://img.shields.io/npm/v/wipe-node-modules)
![downloads](https://img.shields.io/npm/dw/wipe-node-modules)
![license](https://img.shields.io/npm/l/wipe-node-modules)

---

## 📌 Roadmap

* [ ] Dry-run mode (`--dry-run`)
* [ ] Ignore rules (`.dnmignore`)
* [ ] Sort by largest folders
* [ ] Windows optimization improvements

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, open an issue first to discuss.

---

## 📄 License

MIT © Elavarasan

---
