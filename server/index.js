// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let accessToken = null;

// 🔐 Получить access token
const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
  ).toString("base64");

  const res = await axios.post(
    "https://oauth.fatsecret.com/connect/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = res.data.access_token;
  console.log("✅ Access Token получен");
};

// 🔎 Получить food_id по названию
const searchFoodId = async (query) => {
  const res = await axios.get("https://platform.fatsecret.com/rest/server.api", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      method: "foods.search",
      search_expression: query,
      format: "json",
    },
  });

  const food = res.data.foods?.food?.[0];
  return food?.food_id;
};

// 📦 Получить подробную информацию по food_id
const getFullNutrition = async (foodId) => {
  const res = await axios.get("https://platform.fatsecret.com/rest/server.api", {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      method: "food.get",
      food_id: foodId,
      format: "json",
    },
  });

  return res.data.food;
};

// 🚀 Прокси эндпоинт
app.get("/api/nutrition", async (req, res) => {
  const query = req.query.q;
  if (!accessToken) await getAccessToken();

  try {
    const foodId = await searchFoodId(query);
    if (!foodId) return res.status(404).json({ message: "Food not found" });

    const fullData = await getFullNutrition(foodId);
    res.json(fullData);
  } catch (e) {
    console.error("❌ FatSecret API Error:", e.message);
    res.status(500).json({ error: "Failed to fetch nutrition data" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FatSecret Proxy running at http://localhost:${PORT}`);
});
