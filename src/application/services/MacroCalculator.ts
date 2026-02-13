export class MacroCalculator {
  recalculateWeek(week: any[]) {
    return week.map((day) => {
      const meals = day.meals.map((meal) => {
        const total = meal.foods.reduce(
          (acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbohydrates: acc.carbohydrates + food.carbohydrates,
            fats: acc.fats + food.fats,
          }),
          { calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
        );

        return { ...meal, total };
      });

      const dailyTotal = meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.total.calories,
          protein: acc.protein + meal.total.protein,
          carbohydrates: acc.carbohydrates + meal.total.carbohydrates,
          fats: acc.fats + meal.total.fats,
        }),
        { calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
      );

      return { ...day, meals, dailyTotal };
    });
  }
}
