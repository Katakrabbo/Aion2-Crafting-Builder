# AION 2 — Universal Crafting Builder

**A lightweight, offline crafting calculator and recipe planner for AION 2.**

Plan your crafting projects, create custom recipes, calculate materials recursively, simulate crafting attempts, and estimate your total costs in Kina.

Designed for players who want to optimize their resources, reduce unnecessary farming, and prepare for expensive endgame crafting projects.

## Features

### Universal Recipe Builder
- Create and edit custom crafting recipes.
- Define ingredients, required quantities, and output amounts.
- Build multi-step crafting chains with nested sub-recipes.
- Plan weapons, armor, consumables, and other craftable items.
- Reuse recipes across different projects.

### Recursive Material Calculator
- Automatically calculate materials required for an entire crafting chain.
- Expand intermediate components into their underlying ingredients.
- Calculate quantities for multiple copies of the same item.
- Track materials needed across multiple crafting stages.

### Crafting Attempt Simulator
- Adjust crafting attempts using interactive sliders.
- Simulate additional material consumption caused by unsuccessful attempts.
- Recalculate requirements throughout connected crafting chains.

**Note:** Crafting attempts are modeled as user-defined values. The calculator does not guarantee in-game crafting outcomes.

### Inventory Management
- Track materials you already own.
- Calculate remaining material requirements.
- Reduce unnecessary purchases and farming.

### Kina Cost Calculator
- Enter custom material prices.
- Estimate the total cost of crafting projects.
- Compare resource requirements against your available budget.

Prices are entered manually and are not synchronized with the in-game Auction House.

### Projects & Data Management
- Create and manage multiple crafting projects.
- Save data locally in your browser.
- Export and import JSON backups.
- Export crafting information to CSV.
- Use the application without an internet connection.

## This project is fully avaiable at: [Katakrabbo - AION2 Crafting Builder](https://katakrabbo.katakrabbo.workers.dev/)

## How to Use

### 1. Create a Project

Create a new project and select the item you want to craft.

Specify how many copies you need.

### 2. Configure Recipes

Add your crafting recipes, including:

- Output item name
- Output quantity
- Required ingredients
- Ingredient quantities
- Number of crafting attempts

### 3. Build Your Crafting Chain

When an ingredient matches the output of another configured recipe, the calculator can expand that ingredient into its required materials.

This allows you to build complex crafting chains.

### 4. Simulate Crafting Attempts

Use the sliders to adjust the number of attempts for each crafting stage.

Material requirements will be recalculated automatically.

### 5. Track Inventory and Costs

Enter your available materials and their market prices to estimate what you still need.

### 6. Save Your Progress

Export your configuration as a JSON backup to preserve your projects and recipes.

## Example: Star Dragon Lord Orb

The application includes example recipes based on the Asmodian Star Dragon Lord Orb crafting chain:

```text
Splendent Truth Orb
        ↓
Expert's Splendent Truth Orb
        ↓
Artisan's Splendent Truth Orb
        ↓
Star Dragon Lord Orb
```

The calculator can expand intermediate crafting requirements and estimate material consumption across the chain.

**Important:** Included recipes are editable examples, not a complete or officially verified AION 2 crafting database. Always check recipe requirements against your current game version.

## Limitations

- Crafting probabilities and outcomes may differ between game versions.
- The attempt simulator is a planning tool, not an exact prediction of RNG results.
- Material recovery, special crafting procs, and transfer mechanics may require manual adjustments.
- Auction House prices must be entered manually.
- Some example recipes may be incomplete or require verification.
- Browser local storage is not a substitute for exporting backups.

## Planned Improvements

Potential future improvements include:

- Expanded AION 2 recipe database.
- More accurate crafting probability calculations.
- Support for special crafting outcomes and Splendent procs.
- Improved alternative recipe selection.
- Material acquisition and farming information.
- Enhanced import/export options.
- UI and mobile usability improvements.
- Additional language support.

## Contributing

Suggestions, bug reports, and contributions are welcome!

If you find incorrect crafting requirements, calculation issues, or have ideas for new features, feel free to open an Issue or submit a Pull Request.

[Report an issue](https://github.com/Ayrtonno/Aion2-Crafting-Builder/issues)

## Built With

- HTML5
- CSS3
- Vanilla JavaScript

No external frameworks or backend services are required.

## Disclaimer

AION 2 and all related game names, items, and assets belong to their respective owners.

This is an unofficial fan-made project and is not affiliated with, endorsed by, or sponsored by NCSOFT.

All crafting calculations are provided for informational and planning purposes.

---

**Made with lolilove for myself, now shared with everyone in need.**

*Spend less time calculating materials and more time playing.*
