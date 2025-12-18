// База данных рецептов
const recipes = {
    breakfast: [
        {
            id: 1,
            title: "Омлет с овощами",
            description: "Пышный омлет с перцем и помидорами",
            time: "15 мин",
            difficulty: "Легко",
            views: "12.5K",
            videoUrl: "https://youtu.be/example1",
            ingredients: ["яйца", "овощи"],
            icon: "fas fa-egg"
        },
        {
            id: 2,
            title: "Фриттата с брокколи",
            description: "Итальянский омлет с сыром",
            time: "25 мин",
            difficulty: "Средне",
            views: "8.7K",
            videoUrl: "https://youtu.be/example2",
            ingredients: ["яйца", "брокколи", "сыр"],
            icon: "fas fa-cheese"
        }
    ],
    
    dinner: [
        {
            id: 3,
            title: "Курица терияки",
            description: "Сочная курица в азиатском соусе",
            time: "35 мин",
            difficulty: "Средне",
            views: "25.3K",
            videoUrl: "https://youtu.be/example3",
            ingredients: ["курица"],
            icon: "fas fa-drumstick-bite"
        }
    ],
    
    chicken: [
        {
            id: 4,
            title: "Куриные крылышки",
            description: "Хрустящие крылышки в медово-чесночном соусе",
            time: "40 мин",
            difficulty: "Легко",
            views: "45.2K",
            videoUrl: "https://youtu.be/example4",
            ingredients: ["курица"],
            icon: "fas fa-drumstick-bite"
        },
        {
            id: 5,
            title: "Куриные ножки",
            description: "С пряностями и картофелем",
            time: "50 мин",
            difficulty: "Средне",
            views: "32.1K",
            videoUrl: "https://youtu.be/example5",
            ingredients: ["курица"],
            icon: "fas fa-drumstick-bite"
        }
    ],
    
    eggs: [
        {
            id: 6,
            title: "Яйца пашот",
            description: "Идеальные яйца пашот за 5 минут",
            time: "10 мин",
            difficulty: "Сложно",
            views: "18.9K",
            videoUrl: "https://youtu.be/example6",
            ingredients: ["яйца"],
            icon: "fas fa-egg"
        }
    ]
};

// Карта связей категорий
const categoryMap = {
    'breakfast': ['breakfast', 'eggs'],
    'dinner': ['dinner', 'chicken', 'pork', 'fish', 'beef'],
    'snack': ['snack', 'vegetables'],
    'baking': ['baking'],
    
    'chicken': ['chicken', 'breakfast', 'dinner'],
    'eggs': ['eggs', 'breakfast'],
    'pork': ['pork', 'dinner'],
    'fish': ['fish', 'dinner'],
    'vegetables': ['vegetables', 'snack', 'dinner'],
    'beef': ['beef', 'dinner']
};

// Популярные рецепты
const featuredRecipes = [1, 3, 4, 6];

function getRecipesByCategory(category) {
    const relatedCategories = categoryMap[category] || [category];
    let result = [];
    
    relatedCategories.forEach(cat => {
        if (recipes[cat]) {
            result = result.concat(recipes[cat]);
        }
    });
    
    // Убираем дубликаты
    return [...new Map(result.map(item => [item.id, item])).values()];
}

function searchRecipes(query) {
    query = query.toLowerCase();
    let results = [];
    
    // Ищем во всех рецептах
    Object.values(recipes).forEach(categoryRecipes => {
        categoryRecipes.forEach(recipe => {
            if (recipe.title.toLowerCase().includes(query) || 
                recipe.description.toLowerCase().includes(query) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(query))) {
                results.push(recipe);
            }
        });
    });
    
    return [...new Map(results.map(item => [item.id, item])).values()];
}
