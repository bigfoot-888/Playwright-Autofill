import {  Page } from "playwright";
import { StepConfig } from "./types";

export const ActionHandlers = {
    fill: async (page: Page, step: StepConfig) => {
        if (!step.value) throw new Error(`Value is required for fill action on ${step.selector}`);
        const input = page.locator(`input[name="${step.selector}"], textarea[name="${step.selector}"]`);
        await input.fill(step.value);
    },

    autocomplete: async (page: Page, step: StepConfig) => {
        if (!step.value) throw new Error(`Value is required for autocomplete on ${step.selector}`);
        const input = page.getByRole("combobox", { name: step.selector });
        await input.click();
        await input.fill(step.value);
        await page.waitForTimeout(300);
        await page.getByRole("option", { name: step.value }).click();
        await page.keyboard.press("Escape");
    },
    click: async (page: Page, step: StepConfig) => {
        console.log(`Waiting for and clicking: ${step.selector}`);
        
        // Looks for clickable buttons, links, labels, and spans
        const target = page.locator(`
            button:has-text("${step.selector}"), 
            a:has-text("${step.selector}"), 
            label:has-text("${step.selector}"),
            span:has-text("${step.selector}")
        `).first();
        
        await target.waitFor({ state: 'visible', timeout: 5000 });
        await target.click();
    },
    date: async (page: Page, step: StepConfig) => {
        if (!step.value) throw new Error(`Value is required for date on ${step.selector}`);
        
        const input = page.locator('label').filter({ hasText: step.selector }).locator('..').locator('input');
        await input.waitFor({ state: 'visible', timeout: 5000 });
        
        // Physically click the input
        await input.click({ force: true });
        
        // Give it time to fully render
        await page.waitForTimeout(200); 
        
        // Select all and delete any default values that might be there
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Meta+A'); 
        await page.keyboard.press('Backspace');
        
        // Force the cursor to go to the start of the field
        await page.keyboard.press('Home');
        
        // Type each number through the keyboard with some delay
        await page.keyboard.type(step.value, { delay: 150 }); 
        
        // Wait a split second for it (i.e. React) to process the final keystroke
        await page.waitForTimeout(200);
        
        // Press Tab to commit the value
        await page.keyboard.press("Tab");
    },
    select: async (page: Page, step: StepConfig) => {
        if (!step.value) throw new Error(`Value is required for select on ${step.selector}`);
        
        console.log(`Selecting '${step.value}' from '${step.selector}' dropdown`);
        
        // Find and click the combobox
        const combobox = page.getByRole('combobox', { name: step.selector });
        await combobox.waitFor({ state: 'visible', timeout: 5000 });
        await combobox.click();
        
        // Find and click the option
        const option = page.getByRole('option', { name: step.value, exact: true });
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        
        // Give it time (i.e. MUI) to finish the action so that there are no unforeseen elements blocking the next action
        await page.waitForTimeout(400); 
    },
};
