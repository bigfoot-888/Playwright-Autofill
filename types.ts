// Single step configuration
export interface StepConfig {
    action: "fill" | "autocomplete" | "click"; // Add more in the future
    selector: string;
    value?: string; // Optional, because a 'click' doesn't need a value
}

// Form configuration
export interface FormConfig {
    url: string;
    steps: StepConfig[]; 
}