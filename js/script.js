const form = document.getElementById("applicationForm");
const randomBtn = document.getElementById("fillRandomBtn");

// Показать ошибку под полем
function showError(name, message) {
    const field = form.elements[name];
    const error = document.getElementById(name + "Error");

    if (error) {
        error.textContent = message;
    }

    if (field) {
        field.style.border = message ? "1px solid red" : "";
    }
}

// Проверка всей формы
function validateForm() {
    let isValid = true;

    // Очищаем старые ошибки
    [
        "firstName", "lastName", "email", "phone",
        "service", "budget", "deadline",
        "description", "pagesCount", "website"
    ].forEach(name => showError(name, ""));

    const data = new FormData(form);
    const firstName = data.get("firstName").trim();
    const lastName = data.get("lastName").trim();
    const email = data.get("email").trim();
    const phone = data.get("phone").trim();
    const service = data.get("service");
    const budget = data.get("budget");
    const deadline = data.get("deadline");
    const description = data.get("description").trim();
    const pagesCount = data.get("pagesCount");
    const website = data.get("website").trim();

    // Имя и фамилия: буквы и пробелы
    const nameRegex = /^[\p{L}\s]{2,}$/u;

    if (!nameRegex.test(firstName)) {
        showError("firstName", "Введите имя (минимум 2 буквы)");
        isValid = false;
    }

    if (!nameRegex.test(lastName)) {
        showError("lastName", "Введите фамилию (минимум 2 буквы)");
        isValid = false;
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Введите правильный email");
        isValid = false;
    }

    // Телефон: +998 и ещё 9 цифр
    if (!/^\+998\d{9}$/.test(phone.replace(/[\s()-]/g, ""))) {
        showError("phone", "Формат: +998 90 123 45 67");
        isValid = false;
    }

    // Обязательные списки
    if (!service) {
        showError("service", "Выберите услугу");
        isValid = false;
    }

    if (!budget) {
        showError("budget", "Выберите бюджет");
        isValid = false;
    }

    if (!deadline) {
        showError("deadline", "Выберите срок");
        isValid = false;
    }

    // Описание: минимум 30 символов
    if (description.length < 30) {
        showError("description", "Напишите минимум 30 символов");
        isValid = false;
    }

    // Количество страниц: необязательно, если заполнено — 1–100
    if (pagesCount !== "") {
        const pages = Number(pagesCount);

        if (!Number.isInteger(pages) || pages < 1 || pages > 100) {
            showError("pagesCount", "Укажите число от 1 до 100");
            isValid = false;
        }
    }

    // Сайт: необязательно, но если указан — нужен http:// или https://
    if (website && !/^https?:\/\/.+\..+/.test(website)) {
        showError("website", "Введите ссылку с http:// или https://");
        isValid = false;
    }

    return isValid;
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTmnWkYOvwVhLYmHwAO_XPfsLZpkkQW1TEKcDlhhFNgetPkFzsL9eU19TK1kuTBBTphg/exec";
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    try {
        const data = Object.fromEntries(new FormData(form).entries());


        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(data)
        });

        alert("Запрос отправлен! Проверь Google Sheets и Telegram.");
        form.reset();


        alert("Заявка отправлена!");

        form.reset();

    } catch (error) {
        alert("Не удалось отправить заявку. Проверь подключение.");
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заявку";
    }
});

// Случайные тестовые данные
randomBtn.addEventListener("click", function () {
    const random = array => array[Math.floor(Math.random() * array.length)];

    form.elements["firstName"].value = random(["Алишер", "Фируз", "Карим"]);
    form.elements["lastName"].value = random(["Иванов", "Каримов", "Алиев"]);
    form.elements["email"].value = "test" + Math.floor(Math.random() * 10000) + "@example.com";
    form.elements["phone"].value = "+998901234567";
    form.elements["company"].value = "Pixel Company";
    form.elements["position"].value = "CEO";

    form.elements["service"].value = random([
        "Лендинг", "Корпоративный сайт", "Интернет-магазин",
        "Веб-приложение", "Мобильное приложение",
        "Дизайн (лого/брендинг)"
    ]);

    form.elements["budget"].value = random([
        "до 1000$", "1000-5000$", "5000-10000$",
        "10000-25000$", "свыше 25000$"
    ]);

    form.elements["deadline"].value = random([
        "до 2 недель", "1 месяц", "1-2 месяца",
        "3+ месяцев", "не срочно"
    ]);

    form.elements["launchDate"].value = "2026-12-15";
    form.elements["pagesCount"].value = Math.floor(Math.random() * 20) + 1;
    form.elements["description"].value =
        "Нужен современный адаптивный сайт для компании. " +
        "Важно сделать удобный интерфейс и качественную мобильную версию.";

    form.elements["website"].value = "https://example.com";
    form.elements["source"].value = random([
        "Instagram", "Telegram", "Google",
        "Рекомендация друзей", "Другое"
    ]);
    form.elements["contactMethod"].value = random([
        "Telegram", "WhatsApp", "Email", "Телефон"
    ]);

    // Убираем старые ошибки
    validateForm();
});