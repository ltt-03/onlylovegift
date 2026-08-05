const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const SRC_DIR = path.join(__dirname, 'templates');
const DIST_DIR = path.join(__dirname, 'templates_dist');

const obfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: ['rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
};

// Recursively copy directory
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Process files recursively
function processFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (let entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            processFiles(fullPath);
        } else if (entry.isFile()) {
            if (fullPath.endsWith('.js')) {
                obfuscateJsFile(fullPath);
            } else if (fullPath.endsWith('.html')) {
                obfuscateHtmlFile(fullPath);
            }
        }
    }
}

function obfuscateJsFile(filePath) {
    console.log(`Obfuscating JS file: ${filePath}`);
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions).getObfuscatedCode();
        fs.writeFileSync(filePath, obfuscatedCode, 'utf8');
    } catch (err) {
        console.error(`Error obfuscating ${filePath}:`, err);
    }
}

function obfuscateHtmlFile(filePath) {
    console.log(`Obfuscating HTML inline scripts: ${filePath}`);
    try {
        let html = fs.readFileSync(filePath, 'utf8');
        
        // Match <script ...>...</script>
        // Use a regex that captures attributes and content.
        const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
        
        html = html.replace(scriptRegex, (match, attrs, code) => {
            // Don't obfuscate if it has a src attribute (external script)
            if (attrs.toLowerCase().includes('src=')) {
                return match;
            }
            
            // Don't obfuscate empty scripts or JSON scripts
            if (!code.trim() || attrs.toLowerCase().includes('application/json')) {
                return match;
            }
            
            try {
                const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions).getObfuscatedCode();
                return `<script${attrs}>\n${obfuscatedCode}\n</script>`;
            } catch (obfErr) {
                console.error(`Warning: Failed to obfuscate a script block in ${filePath}, skipping...`, obfErr.message);
                return match;
            }
        });

        fs.writeFileSync(filePath, html, 'utf8');
    } catch (err) {
        console.error(`Error processing HTML ${filePath}:`, err);
    }
}

async function run() {
    console.log('--- Starting Template Obfuscation ---');
    console.log('Source:', SRC_DIR);
    console.log('Destination:', DIST_DIR);
    
    // Clear dest dir if it exists
    if (fs.existsSync(DIST_DIR)) {
        console.log('Cleaning existing templates_dist...');
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    
    console.log('Copying files...');
    copyDir(SRC_DIR, DIST_DIR);
    
    console.log('Obfuscating...');
    processFiles(DIST_DIR);
    
    console.log('--- Obfuscation Complete ---');
}

run();
