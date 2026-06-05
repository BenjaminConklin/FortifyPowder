// src/scripts/calculator.js

const totalSlider = document.getElementById("total-weight-slider");
const totalDisplay = document.getElementById("total-weight-display");
const ingredientSliders = document.querySelectorAll(".ingredient-slider");

function calculateNutrition() {
  // Grab the data from the window object where Astro left it
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

  // Track running totals
  let summary = {
    calories: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    sugars: 0,
    protein: 0,
  };

  // Process ingredient math
  ingredientsData.forEach((data) => {
    const slider = document.querySelector(
      `[data-ingredient="${data.ingredient}"]`,
    );
    const actualWeightDisplay = document.querySelector(
      `[data-actual="${data.ingredient}"]`,
    );

    if (slider) {
      const sliderVal = parseFloat(slider.value) || 0;
      const ingredientGrams = (sliderVal / totalRatiosSum) * totalWeight;

      if (actualWeightDisplay) {
        actualWeightDisplay.textContent = ingredientGrams.toFixed(1);
      }

      summary.calories += ingredientGrams * (data.calories_per_g || 0);
      summary.fat += ingredientGrams * (data.fat_per_g || 0);
      summary.carbs += ingredientGrams * (data.carbs_per_g || 0);
      summary.fiber += ingredientGrams * (data.fiber_per_g || 0);
      summary.sugars += ingredientGrams * (data.sugar_per_g || 0);
      summary.protein += ingredientGrams * (data.protein_per_g || 0);
    }
  });

  // Render out structural table updates safely checking elements exist
  const updateText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  updateText("label-calories", Math.round(summary.calories));
  updateText("label-fat", summary.fat.toFixed(1));
  updateText("label-carbs", summary.carbs.toFixed(1));
  updateText("label-fiber", summary.fiber.toFixed(1));
  updateText("label-sugars", summary.sugars.toFixed(1));
  updateText("label-protein", summary.protein.toFixed(1));
}

// Attach listeners safely
if (totalSlider) {
  totalSlider.addEventListener("input", calculateNutrition);
}

ingredientSliders.forEach((slider) =>
  slider.addEventListener("input", calculateNutrition),
);

// Run initial processing loop
calculateNutrition();
