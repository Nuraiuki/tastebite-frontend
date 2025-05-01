import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";

function CategoryPage() {
  const { name } = useParams();
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`)
      .then((res) => setMeals(res.data.meals || []))
      .catch((err) => console.error(err));
  }, [name]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">🍽 {name} Recipes</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <Link to={`/meal/${meal.idMeal}`} key={meal.idMeal}>
            <Card>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <CardContent>
                <h3 className="text-base font-semibold text-gray-800">
                  {meal.strMeal}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
