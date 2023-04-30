const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env['API_KEY'],
});
const openai = new OpenAIApi(configuration);
const maxTokensPerFile = 3800;

const wrongFiles = ['node_modules','README.md']
const wrongExtensions = ['.md','.json','.lock','.log','.gitignore','.env', '.git']
const directoryPath = './testFolder';

function getAllFiles(dirPath, arrayOfFiles) {
    var files = fs.readdirSync(dirPath);
    files = files.filter((file) => !wrongFiles.includes(file))
    files = files.filter((file) => !wrongExtensions.includes(path.extname(file)))

    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });
    return arrayOfFiles;
}

async function generateDocumentation(files) {
    // Send the file contents to ChatGPT for context
  for (const file of files) {
    var fileContent = fs.readFileSync(file, 'utf-8')
    const stats = fs.statSync(file);
    var parts = stats.size / maxTokensPerFile;
    var fileContents = []
    for (let i = 0; i < parts; i++) {
        const start = i * maxTokensPerFile;
        const end = (i + 1) * maxTokensPerFile;
        const partContent = fileContent.slice(start, end);
        fileContents.push({
            role: 'system',
            content: `File: ${file}\n Part ${i} of file.\nContent: ${partContent}`,
        })
    }
    // Create a message with the target file for which documentation is to be generated
    const message = {
      role: 'user',
      content: `Generate a summary for the file ${file} in beautiful format, with indents and basic undestanding of the code. It should not be too long, but it should be understandable.`,
    };

    // Combine the context and the message
    var GPT35TurboMessage = [...fileContents, message]
    try{
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: GPT35TurboMessage,
        });
        
        // Save the generated summary as a .md file in the respective file directory
        const summary = response.data.choices[0].message.content;
        const mdFilePath = file.replace(/\.js$|\.cjs$/, '.md');
        fs.writeFileSync(mdFilePath, summary, 'utf-8');
        console.log(`Documentation generated for ${file}`);
    } catch(e){
        console.log(e.response);
        console.log("ERROR");
    }
  }
}

(async () => {
    // Read all files in the project directory and subdirectories
    var files = getAllFiles(directoryPath)
    await generateDocumentation(files);
    console.log('Documentation generated successfully');
})();