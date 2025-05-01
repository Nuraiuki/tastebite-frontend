import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import RecipeCarousel from "./RecipeCarousel";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const topCategories = [
    "Beef",
    "Chicken",
    "Seafood",
    "Dessert",
    "Miscellaneous",
    "Side",
  ];

  const filteredCategories = categories.filter((cat) =>
    topCategories.includes(cat.strCategory)
  );

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const url = searchTerm
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      : `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`;

    axios
      .get(url)
      .then((res) => setMeals(res.data.meals || []))
      .catch((err) => console.error(err));
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container className="py-10 text-gray-900">
      {!user ? (
        <div className="max-w-xl mx-auto text-center mt-24">
          <h1 className="text-4xl font-bold mb-4 font-display">
            Welcome to TasteBite 🍽️
          </h1>
          <p className="text-gray-600 mb-6">
            Please login to browse recipes, create checklists and explore meals!
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
          >
            🔐 Login to Continue
          </button>
        </div>
      ) : (
        // для авторизованных
        <>
          <RecipeCarousel />

          {/* Header */}
          <div className="text-center mb-10 mt-8">
            <h1 className="text-4xl font-bold mb-2 font-display">
              Find the Best Recipes
            </h1>
            <p className="text-gray-500">
              Browse delicious meals curated just for you 🍴
            </p>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-8">
            <Input
              type="text"
              placeholder="Search for a recipe..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full max-w-md"
            />
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 font-display">
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6 justify-items-center">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.idCategory}
                  onClick={() => navigate(`/category/${cat.strCategory}`)}
                  className="group cursor-pointer text-center transition-transform duration-300 ease-out hover:scale-105"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border border-gray-200 mx-auto transition-all duration-300 ease-out group-hover:shadow-xl group-hover:scale-110">
                    <img
                      src={cat.strCategoryThumb}
                      alt={cat.strCategory}
                      className="w-full h-full object-cover rounded-full transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-base font-display font-semibold transition-colors duration-300 group-hover:text-orange-500">
                    {cat.strCategory}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Meals List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-display">
              Recipes
            </h2>
            {meals.length === 0 ? (
              <p>No recipes found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {meals.map((meal) => (
                  <Link to={`/meal/${meal.idMeal}`} key={meal.idMeal}>
                    <Card className="group hover:shadow-lg transition duration-300">
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="w-full h-52 object-cover rounded-t"
                      />
                      <CardContent>
                        <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                          {meal.strMeal}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Container>
  );
}

export default HomePage;
