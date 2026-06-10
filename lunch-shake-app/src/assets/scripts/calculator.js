// src/scripts/calculator.js

const totalSlider = document.getElementById("total-weight-slider");
const totalDisplay = document.getElementById("total-weight-display");
const ingredientSliders = document.querySelectorAll(".ingredient-slider");

function calculateNutrition() {
  // Grab the full data array from the window object where Astro left it
  const ingredientsData = window.ingredientsData || [];

  const totalWeight = parseFloat(totalSlider?.value || 0);
  if (totalDisplay) totalDisplay.textContent = totalWeight;
  
  const servingSizeLabel = document.getElementById("label-serving-size");
  if (servingSizeLabel) servingSizeLabel.textContent = totalWeight;

  // Calculate total ratio weight across all inputs
  let totalRatiosSum = 0;
  ingredientSliders.forEach((slider) => {
    totalRatiosSum += parseFloat(slider.value) || 0;
  });
  if (totalRatiosSum === 0) totalRatiosSum = 1;

  // Track running totals for ALL available columns in your JSON list
  let summary = {
    calories: 0,
    carbs: 0,
    protein: 0,
    sugar: 0,
    fiber: 0,
    fat: 0,
    cholesterol: 0,
    vitamin_a: 0,
    vitamin_e: 0,
    vitamin_d: 0,
    vitamin_c: 0,
    magnesium: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    sodium: 0,
    price: 0
  };

  // Process ingredient math
  ingredientsData.forEach((data) => {
    const slider = document.querySelector(`[data-ingredient="${data.ingredient}"]`);
    const actualWeightDisplay = document.querySelector(`[data-actual="${data.ingredient}"]`);

    if (slider) {
      const sliderVal = parseFloat(slider.value) || 0;
      const ingredientGrams = (sliderVal / totalRatiosSum) * totalWeight;

      if (actualWeightDisplay) {
        actualWeightDisplay.textContent = ingredientGrams.toFixed(1);
      }

      // Dynamic accumulation mapping for every metric per gram
      summary.calories += ingredientGrams * (data.calories_per_g || 0);
      summary.carbs += ingredientGrams * (data.carbs_per_g || 0);
      summary.protein += ingredientGrams * (data.protein_per_g || 0);
      summary.sugar += ingredientGrams * (data.sugar_per_g || 0);
      summary.fiber += ingredientGrams * (data.fiber_per_g || 0);
      summary.fat += ingredientGrams * (data.fat_per_g || 0);
      summary.cholesterol += ingredientGrams * (data.cholesterol_per_g || 0);
      summary.vitamin_a += ingredientGrams * (data.vitamin_a_per_g || 0);
      summary.vitamin_e += ingredientGrams * (data.vitamin_e_per_g || 0);
      summary.vitamin_d += ingredientGrams * (data.vitamin_d_per_g || 0);
      summary.vitamin_c += ingredientGrams * (data.vitamin_c_per_g || 0);
      summary.magnesium += ingredientGrams * (data.magnesium_per_g || 0);
      summary.calcium += ingredientGrams * (data.calcium_per_g || 0);
      summary.iron += ingredientGrams * (data.iron_per_g || 0);
      summary.potassium += ingredientGrams * (data.potassium_per_g || 0);
      summary.sodium += ingredientGrams * (data.sodium_per_g || 0);
      summary.price += ingredientGrams * (data.price_per_g || 0);
      summary.cost_market += ingredientGrams * (data.cost_per_g_market || 0);
    }
  });

  // Safe element text node update helper
  const updateText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  // Core Macros (Rounded or 1 decimal point)
  updateText("label-calories", Math.round(summary.calories));
  updateText("label-carbs", summary.carbs.toFixed(1));
  updateText("label-protein", summary.protein.toFixed(1));
  updateText("label-sugars", summary.sugar.toFixed(1));
  updateText("label-fiber", summary.fiber.toFixed(1));
  updateText("label-fat", summary.fat.toFixed(1));
  updateText("label-cholesterol", summary.cholesterol.toFixed(1));
  updateText("label-sodium", summary.sodium.toFixed(1));
  updateText("label-potassium", summary.potassium.toFixed(1));

  // Micronutrients & Vitamins (kept to 4 decimal spaces since values like iron/magnesium are quite small per gram)
  updateText("label-vitamin-a", summary.vitamin_a.toFixed(4));
  updateText("label-vitamin-e", summary.vitamin_e.toFixed(4));
  updateText("label-vitamin-d", summary.vitamin_d.toFixed(4));
  updateText("label-vitamin-c", summary.vitamin_c.toFixed(4));
  updateText("label-magnesium", summary.magnesium.toFixed(4));
  updateText("label-calcium", summary.calcium.toFixed(4));
  updateText("label-iron", summary.iron.toFixed(4));

  // Financial tracking metrics
  updateText("label-price", summary.price.toFixed(2));
  updateText("label-cost-market", summary.cost_market.toFixed(2));
}

// Attach listeners safely
if (totalSlider) {
  totalSlider.addEventListener("input", calculateNutrition);
}

ingredientSliders.forEach((slider) =>
  slider.addEventListener("input", calculateNutrition)
);

// Run initial processing loop
calculateNutrition();