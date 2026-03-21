import { chromium } from "playwright";
import * as fs from "fs";
import * as yaml from "js-yaml";

interface FormConfig {
    url: string;
    fields: Array<{
        selector: string;
        value: string;
        isAutocomplete?: boolean;
    }>;
}

async function runAutoFiller() {
    // Accept the .yaml file as an argument
    // If nothing is passed, default back to 'config.yaml'
    const configFile = process.argv[2] || "config.yaml";

    // If the file doesn't exist, stop the script
    if (!fs.existsSync(configFile)) {
        console.error(`Error: could not find the file "${configFile}"`);
        process.exit(1); 
    }

    console.log(`Reading ${configFile}...`);

    // Read the file
    const fileContents = fs.readFileSync(configFile, "utf8");
    const config = yaml.load(fileContents) as FormConfig;

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(config.url);

    for (const field of config.fields) {
        console.log(`Filling field: ${field.selector}`);

        // Specific workaround for MUI autocompletes 
        if (field.isAutocomplete) {

            // Click the autocomplete
            const input = page.getByRole("combobox", { name: field.selector });
            await input.click();

            // Type the value
            await input.fill(field.value);

            // Wait a bit for the animation to complete
            await page.waitForTimeout(300);

            // Find the option that corresponds to what was typed
            await page.getByRole("option", { name: field.value }).click();

            // Press escape to exit the autocomplete
            await page.keyboard.press("Escape");
        } else {
            // For any other field, look for the HTML name attribute
            const input = page.locator(`input[name="${field.selector}"]`);
            await input.fill(field.value);
        }
    }
    console.log("Form filled! Keeping browser open...");
}

runAutoFiller().catch(console.error);
