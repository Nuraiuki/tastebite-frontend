import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import Toast from "../components/ui/Toast";
import { LoadingScreen } from "../components/LoadingScreen";
import { searchNutrition } from "../api/fatsecret";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Heart } from "lucide-react";
import StarRating from "../components/ui/StarRating";
import FavoriteButton from "../components/ui/FavoriteButton";
import CommentBox from "../components/ui/CommentBox";

function MealPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => JSON.parse(localStorage.getItem(`checked_${id}`)) || []);
  const [nutritionData, setNutritionData] = useState({});
  const [servingsCount, setServingsCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(() => (JSON.parse(localStorage.getItem("favorites")) || []).includes(id));
  const [userRating, setUserRating] = useState(() => parseInt(localStorage.getItem(`rating_${id}`)) || 0);
  const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem(`comments_${id}`)) || []);
  const [newComment, setNewComment] = useState("");

  
  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const updated = prev
        ? JSON.parse(localStorage.getItem("favorites")).filter((fav) => fav !== id)
        : [...JSON.parse(localStorage.getItem("favorites") || "[]"), id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return !prev;
    });
  };

  
  
  useEffect(() => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => {
        setMeal(res.data.meals?.[0]);
        setTimeout(() => {
          setIsReady(true);
        }, 800);
      })
      .catch((err) => console.error(err));
  }, [id]);



  useEffect(() => {
    if (!meal) return;

    const loadNutrition = async () => {
      const data = {};
      const uniqueIngredients = new Set();

      for (let i = 1; i <= 10; i++) {
        const name = meal[`strIngredient${i}`];
        if (name?.trim() && !uniqueIngredients.has(name)) {
          uniqueIngredients.add(name);
          try {
            const nutrition = await searchNutrition(name);
            if (nutrition) {
              data[name] = nutrition;
            }
          } catch (err) {
            console.warn(`⚠️ No nutrition data for: ${name}`);
          }
        }
      }

      setNutritionData(data);
    };

    loadNutrition();
  }, [meal]);



  useEffect(() => {
    localStorage.setItem(`checked_${id}`, JSON.stringify(checkedItems));
  }, [checkedItems, id]);

  if (!meal || !isReady) {
    return <LoadingScreen text="" />;
  }

    const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name?.trim()) {
      ingredients.push({
        name,
        measure,
        image: `https://www.themealdb.com/images/ingredients/${name.replaceAll(" ", "_")}-Small.png`,
      });
    }
  }
  const uniqueIngredients = ingredients.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);


  const toggleChecked = (name) => {
    setCheckedItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleDownloadPDF = async () => {
    const unchecked = ingredients.filter((item) => !checkedItems.includes(item.name));
    const doc = new jsPDF();
    const imgData = await toDataURL(meal.strMealThumb);
    doc.addImage(imgData, "JPEG", 15, 15, 180, 90);
    doc.setFontSize(18);
    doc.text(`Ingredients List`, 14, 110);
    doc.setFontSize(14);
    doc.text(`Recipe: ${meal.strMeal}`, 14, 120);
    doc.setFontSize(12);
    unchecked.forEach((item, index) => {
      doc.text(`• ${item.measure} ${item.name}`, 14, 135 + index * 8);
    });
    doc.save(`${meal.strMeal}-ingredients.pdf`);
  };

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  const resetChecklist = () => {
    setCheckedItems([]);
    localStorage.removeItem(`checked_${id}`);
    setShowToast(true);
  };

  // 🔢 Nutrition Summary
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;

  Object.values(nutritionData).forEach((item) => {
    const s = Array.isArray(item.servings?.serving) ? item.servings.serving[0] : item.servings?.serving;
    totalCalories += parseFloat(s?.calories || 0);
    totalProtein += parseFloat(s?.protein || 0);
    totalFat += parseFloat(s?.fat || 0);
    totalCarbs += parseFloat(s?.carbohydrate || 0);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-900 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold font-display tracking-tight animate-slide-up">{meal.strMeal}</h1>
        <p className="text-sm text-gray-500 mt-2">{meal.strArea} • {meal.strCategory}</p>
      </div>
     


      <div className="relative mb-10">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-auto rounded-xl shadow-xl object-cover" />
        {meal.strTags && (
          <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 px-3 py-1 text-xs rounded-full font-medium shadow-md">
            #{meal.strTags.replaceAll(",", " #")}

            
          </div>
      
        )}
<FavoriteButton
  isFavorite={isFavorite}
  onToggle={() => {
    const updated = isFavorite
      ? JSON.parse(localStorage.getItem("favorites")).filter((fav) => fav !== id)
      : [...(JSON.parse(localStorage.getItem("favorites")) || []), id];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  }}
/>

        
      </div>
      <StarRating rating={userRating} onRate={(value) => {
        setUserRating(value);
        localStorage.setItem(`rating_${id}`, value);
      }} />
    

    



      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">🧂 Ingredients</h2>
          <div className="space-x-4">
            <button onClick={handleDownloadPDF} className="text-sm text-orange-600 hover:underline">Download PDF</button>
            <button onClick={resetChecklist} className="text-sm text-red-500 hover:underline">Reset</button>
          </div>
        </div>

        {Object.keys(nutritionData).length === 0 ? (
          <p className="text-sm text-gray-400 mb-6">Loading nutrition info...</p>
        ) : (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3">🥦 Nutrition Facts</h2>
            <p className="mb-4 text-gray-700 text-sm">💡 Approx. total for main ingredients:</p>
            <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg text-sm text-gray-700 shadow">
              <p>Total Calories: <strong>{Math.round(totalCalories)}</strong> kcal</p>
              <p>Protein: <strong>{totalProtein.toFixed(1)}</strong> g</p>
              <p>Fat: <strong>{totalFat.toFixed(1)}</strong> g</p>
              <p>Carbs: <strong>{totalCarbs.toFixed(1)}</strong> g</p>
            </div>

            <div className="space-y-4 text-sm text-gray-800">
              {Object.entries(nutritionData).map(([name, item]) => {
                const s = Array.isArray(item.servings?.serving) ? item.servings.serving[0] : item.servings?.serving;
                return (
                  <div key={name} className="border rounded p-3 shadow-sm">
                    <p className="font-bold text-orange-600">{item.food_name}</p>
                    <p>Calories: {s
                    ?.calories || "–"} kcal</p>
                    <p>Protein: {s?.protein || "–"} g</p>
                    <p>Fat: {s?.fat || "–"} g</p>
                    <p>Carbs: {s?.carbohydrate || "–"} g</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}



{Object.keys(nutritionData).length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4">📊 Nutrition Summary</h2>

    <div className="flex items-center justify-between mb-4">
      <label className="text-sm font-medium">
        Servings:{" "}
        <input
          type="number"
          min="1"
          value={servingsCount}
          onChange={(e) => setServingsCount(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm w-20"
        />
      </label>
    </div>

    {(() => {
      let total = { calories: 0, protein: 0, fat: 0, carbs: 0 };
      for (const item of Object.values(nutritionData)) {
        const s = Array.isArray(item.servings?.serving)
          ? item.servings.serving[0]
          : item.servings?.serving;

        total.calories += parseFloat(s?.calories || 0);
        total.protein += parseFloat(s?.protein || 0);
        total.fat += parseFloat(s?.fat || 0);
        total.carbs += parseFloat(s?.carbohydrate || 0);
      }

      const perServing = {
        calories: (total.calories / servingsCount).toFixed(0),
        protein: (total.protein / servingsCount).toFixed(1),
        fat: (total.fat / servingsCount).toFixed(1),
        carbs: (total.carbs / servingsCount).toFixed(1),
      };

      const pieData = [
        { name: "Protein", value: +perServing.protein },
        { name: "Fat", value: +perServing.fat },
        { name: "Carbs", value: +perServing.carbs },
      ];

      const COLORS = ["#22c55e", "#f97316", "#3b82f6"];

      return (
        <>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
            <div>
              <p>Calories: <strong>{perServing.calories}</strong> kcal</p>
              <p>Protein: <strong>{perServing.protein}</strong> g</p>
              <p>Fat: <strong>{perServing.fat}</strong> g</p>
              <p>Carbs: <strong>{perServing.carbs}</strong> g</p>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={60}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      );
    })()}
  </div>
)}


        <ul className="space-y-3">
          {ingredients.map((item) => (
            <li key={item.name} className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg shadow hover:shadow-md transition group">
              <input type="checkbox" checked={checkedItems.includes(item.name)} onChange={() => toggleChecked(item.name)} className="w-5 h-5 accent-orange-500" />
              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
              <span className={`text-base font-medium transition ${checkedItems.includes(item.name) ? "line-through text-gray-400" : "text-gray-800 group-hover:text-orange-600"}`}>
                {item.measure} {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">📋 Instructions</h2>
        <div className="bg-orange-50/40 border-l-4 border-orange-300 px-4 py-4 rounded-md shadow-sm leading-relaxed whitespace-pre-line text-gray-700">
          {meal.strInstructions}
        </div>
      </div>

      {meal.strYoutube && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-3">🎥 Video Tutorial</h2>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${meal.strYoutube.split("=")[1]}`}
            title="YouTube video"
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      )}

      <div className="mt-16 text-center">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-sm text-gray-500 hover:text-orange-500 transition">
          ⬆️ Back to top
        </button>
      </div>

      <CommentBox
  comments={comments}
  onAdd={(newComment) => {
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
  }}
/>



      {showToast && (
        <Toast message="Checklist cleared!" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}

export default MealPage;
