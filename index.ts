import { chromium } from "playwright";
import * as fs from "fs";
import * as yaml from "js-yaml";

import {ActionHandlers} from "./action-handlers";
import { FormConfig } from "./types";

async function runAutoFiller() {
    const configFile = process.argv[2] || "config.yaml";
    if (!fs.existsSync(configFile)) {
        console.error(`Error: could not find the file "${configFile}"`);
        process.exit(1); 
    }

    console.log(`Reading ${configFile}...`);
    const fileContents = fs.readFileSync(configFile, "utf8");
    const config = yaml.load(fileContents) as FormConfig;

    const browser = await chromium.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();
    await page.goto(config.url);

    // Execution loop
    for (const step of config.steps) {
        console.log(`Executing [${step.action}] on: ${step.selector}`);
        
        // Based on the specified action, take the correct function to perform
        const handlerFunction = ActionHandlers[step.action];
        
        if (handlerFunction) {
            await handlerFunction(page, step); 
        } else {
            console.error(`Unknown action type: ${step.action}`);
        }
    }
    
    console.log("All steps completed: keeping browser open...");
}

runAutoFiller().catch(console.error);
