# ProjectDocGen - Automatic Documentation Generator

ProjectDocGen is a powerful and easy-to-use automatic documentation generator for your project files. It scans your source code files and generates clean, professional, and comprehensive documentation. With ProjectDocGen, you can save time and effort while ensuring your project's documentation stays up-to-date and accurate.

## Features

- Supports multiple programming languages (e.g., Python, JavaScript, Java, C++, and more)

## Usage

First, you should have API key from OpenAI. You can get it from [here](https://platform.openai.com/).
Then, create .env file and fill it with API key as follows:

```
API_KEY=YOUR_API_KEY
```

To generate documentation for your project, simply navigate to your project's root directory and run:

```powershell
node generateDocks.js
```

In that file you can change configuration options, such as the output directory, the format of the documentation, and more.

```
const wrongFiles = ['node_modules','README.md']
const wrongExtensions = ['.md','.json','.lock','.log','.gitignore','.env', '.git']
const directoryPath = './testFolder';
```

That will create documentation for each file in all directories with the names of files