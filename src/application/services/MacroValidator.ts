export class MacroValidator {
  validateWeek(week: any, goal: any): any {
    return week.map((day) => {
      const diffCalories = day.dailyTotal.calories - goal.calories;

      // Apenas loga, NÃO quebra
      if (Math.abs(diffCalories) > goal.calories * 0.05) {
        console.warn("Macros fora do range:", diffCalories);
      }

      return day;
    });
  }
}
