# Playwright-Autofill

## Overview

This repository contains a simple tool using Playwright that I made to accelerate manual form testing in my web-based projects. It takes YAML files with the url, form structure and values that you want, and automatically fills them in the browser. 

---

## Usage

Simply add YAML files to the `yaml` folder (you can store the files wherever you want), and run the following command: 

```
// Replace yaml/config.yaml with the route to your YAML file
npx tsx index.ts yaml/config.yaml
```

As of now, it works for 
* Any basic form field with a `name` attribute that doesn't require extra navigation
* MUI autocomplete fields

---

## Installation

```
// Install the npm dependencies
npm install

// Download the Chromium browser binary required by Playwright to run in Google Chrome
// You can do this for other browsers you want to test in
npx playwright install chromium
```

---

## Config reference

This is how a form config YAML file might look: 

```
url: "http://localhost:3000/login"
fields:
  - selector: "email"
    value: "admin@test.com"
  - selector: "password"
    value: "supersecret1!"
  - selector: "role"
    value: "Teacher"
    isAutocomplete: true
```
* **url**: The URL of the page where the form is located.
* **selector**: The `name` attribute of the input field (or the label of the `Textfield` input rendered inside the MUI autocomplete).
* **value**: The value to fill in the field.
* **isAutocomplete** *(optional)*: Set to `true` for MUI autocomplete fields. Defaults to `false`.

---

## License

This repository is licensed under the **MIT License**.

---

## Author

David Xu Hu  
BSc Software Engineering — Universidad Complutense de Madrid

GitHub: https://github.com/bigfoot-888
LinkedIn: www.linkedin.com/in/david-xu-hu-bb8abb350
