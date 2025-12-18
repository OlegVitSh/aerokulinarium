// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Разворачиваем приложение на весь экран
tg.expand();

// Устанавливаем тему
function applyTheme() {
    const theme = tg.colorScheme;
    if (theme === 'dark') {
        document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
        document.documentElement.style.setProperty('--card-bg', '#2d2d2d');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
    }
}

// Загружаем популярные рецепты
function loadFeaturedRecipes() {
    const container = document.getElementById('featured-recipes');
    container.innerHTML = '';
    
    featuredRecipes.forEach(recipeId => {
        // Находим рецепт по ID
        let recipe = null;
        for (const category in recipes) {
            const found = recipes[category].find(r => r.id === recipeId);
            if (found) {
                recipe = found;
                break;
            }
        }
        
        if (recipe) {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.onclick = () => openRecipe(recipe);
            
            recipeCard.innerHTML = `
                <div class="recipe-image">
                    <i class="${recipe.icon}"></i>
                </div>
                <div class="recipe-info">
                    <h4 class="recipe-title">${recipe.title}</h4>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-eye"></i> ${recipe.views}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(recipeCard);
        }
    });
}

// Открываем модальное окно с рецептами
function openRecipesModal(category, title) {
    const recipes = getRecipesByCategory(category);
    const modal = document.getElementById('recipesModal');
    const modalTitle = document.getElementById('modalTitle');
    const recipesList = document.getElementById('recipesList');
    
    modalTitle.textContent = title;
    recipesList.innerHTML = '';
    
    if (recipes.length === 0) {
        recipesList.innerHTML = '<p style="text-align: center; color: #666;">Рецепты скоро появятся!</p>';
    } else {
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.onclick = () => openRecipe(recipe);
            
            recipeItem.innerHTML = `
                <h4>${recipe.title}</h4>
                <p>${recipe.description}</p>
                <div class="recipe-stats">
                    <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                    <span><i class="fas fa-fire"></i> ${recipe.difficulty}</span>
                    <span><i class="fas fa-eye"></i> ${recipe.views}</span>
                </div>
            `;
            
            recipesList.appendChild(recipeItem);
        });
    }
    
    modal.style.display = 'flex';
}

// Открываем рецепт (в реальном приложении здесь будет переход на видео)
function openRecipe(recipe) {
    // В реальном приложении можно открыть видео или показать детали
    tg.showAlert(`Открываем рецепт: ${recipe.title}\nВидео: ${recipe.videoUrl}`);
    
    // Можно отправить данные в Telegram бота
    const data = {
        action: 'open_recipe',
        recipe_id: recipe.id,
        recipe_title: recipe.title,
        video_url: recipe.videoUrl
    };
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify(data));
}

// Поиск рецептов
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '<p style="text-align: center; color: #666;">Введите минимум 2 символа</p>';
            return;
        }
        
        const results = searchRecipes(query);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="text-align: center; color: #666;">Ничего не найдено</p>';
        } else {
            searchResults.innerHTML = '';
            results.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.className = 'recipe-item';
                recipeItem.onclick = () => {
                    openRecipe(recipe);
                    closeSearch();
                };
                
                recipeItem.innerHTML = `
                    <h4>${recipe.title}</h4>
                    <p>${recipe.description}</p>
                    <div class="recipe-stats">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-eye"></i> ${recipe.views}</span>
                    </div>
                `;
                
                searchResults.appendChild(recipeItem);
            });
        }
    });
}

// Закрыть поиск
function closeSearch() {
    document.getElementById('searchOverlay').style.display = 'none';
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Применяем тему Telegram
    applyTheme();
    
    // Загружаем популярные рецепты
    loadFeaturedRecipes();
    
    // Инициализируем поиск
    initSearch();
    
    // Обработчики для категорий
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const title = this.querySelector('h3').textContent;
            openRecipesModal(category, title);
        });
    });
    
    // Обработчики для ингредиентов
    document.querySelectorAll('.ingredient-card').forEach(card => {
        card.addEventListener('click', function() {
            const ingredient = this.dataset.ingredient;
            const title = this.querySelector('span').textContent;
            openRecipesModal(ingredient, title);
        });
    });
    
    // Кнопка поиска
    document.getElementById('searchBtn').addEventListener('click', function() {
        document.getElementById('searchOverlay').style.display = 'block';
        document.getElementById('searchInput').focus();
    });
    
    // Закрытие модального окна
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('recipesModal').style.display = 'none';
    });
    
    // Закрытие поиска
    document.getElementById('closeSearch').addEventListener('click', closeSearch);
    
    // Закрытие по клику вне окна
    document.getElementById('recipesModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Добавляем кнопку "Назад" в Telegram
    tg.BackButton.show();
    tg.BackButton.onClick(() => {
        const modal = document.getElementById('recipesModal');
        const search = document.getElementById('searchOverlay');
        
        if (search.style.display === 'block') {
            closeSearch();
        } else if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        } else {
            tg.close();
        }
    });
});

// Обработка сообщений от Telegram
tg.onEvent('viewportChanged', function() {
    // Адаптируем под изменение размера
});

// Можно добавить вибрацию при клике
function hapticFeedback() {
    if (tg.isVersionAtLeast('6.1')) {
        tg.HapticFeedback.impactOccurred('light');
    }
}
