export interface Step {
  order: number; // original step index within its recipe
  description: string; // e.g. "chop onions"
  duration: number; // in minutes
}

export interface Recipe {
  id: string;
  steps: Step[];
}

export interface ScheduledStep {
  recipeId: string;
  stepOrder: number;
  description: string;
  duration: number; // minutes
  startOffset: number; // minutes from session start
}

// schedules all recipes so they start at minute 0, then merges & sorts
export function scheduleRecipes(recipes: Recipe[]): ScheduledStep[] {
  const all: ScheduledStep[] = [];

  for (const r of recipes) {
    let cursor = 0;
    for (const s of r.steps) {
      all.push({
        recipeId: r.id,
        stepOrder: s.order,
        description: s.description,
        duration: s.duration,
        startOffset: cursor,
      });
      cursor += s.duration;
    }
  }

  // sort by earliest start
  return all.sort((a, b) => a.startOffset - b.startOffset);
}
