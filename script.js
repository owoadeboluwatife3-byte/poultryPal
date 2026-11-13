
// GET HTML ELEMENTS

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");


// DATABASE (LOCAL STORAGE)

let flocks = JSON.parse(localStorage.getItem("flocks")) || [];
let feeds = JSON.parse(localStorage.getItem("feeds")) || [];
let healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// SAVE DATA

function saveData() {
    localStorage.setItem("flocks", JSON.stringify(flocks));
    localStorage.setItem("feeds", JSON.stringify(feeds));
    localStorage.setItem("healthRecords", JSON.stringify(healthRecords));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


// NAVIGATION

function showPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(pageName).classList.add("active");

    const activeButton = document.querySelector(
        `[data-page="${pageName}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    pageTitle.textContent =
        pageName.charAt(0).toUpperCase() + pageName.slice(1);
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});


// QUICK ACTION BUTTONS

document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});


// ADD FLOCK

document.getElementById("flock-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("batch-name").value;
    const birds = Number(document.getElementById("bird-count").value);
    const date = document.getElementById("arrival-date").value;

    if (birds <= 0) return;

    flocks.push({
        name,
        birds,
        date
    });

    saveData();
    renderFlocks();

    this.reset();

});


// DISPLAY FLOCKS

function renderFlocks() {

    const list = document.getElementById("flock-list");

    list.innerHTML = "";

    flocks.forEach(flock => {

        list.innerHTML += `
            <tr>
                <td>${flock.name}</td>
                <td>${flock.birds}</td>
                <td>${flock.date}</td>
            </tr>
        `;

    });

}


// ADD FEED

document.getElementById("feed-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const type = document.getElementById("feed-type").value;
    const quantity = Number(document.getElementById("feed-quantity").value);

    if (quantity <= 0) return;

    const existingFeed = feeds.find(feed => feed.type === type);

    if (existingFeed) {
        existingFeed.quantity += quantity;
    } else {
        feeds.push({
            type,
            quantity
        });
    }

    saveData();
    renderFeeds();

    this.reset();

});


// DISPLAY FEED

function renderFeeds() {

    const list = document.getElementById("feed-list");

    list.innerHTML = "";

    feeds.forEach(feed => {

        list.innerHTML += `
            <div class="record">
                <div>
                    <strong>${feed.type}</strong>
                    <small>Available stock</small>
                </div>

                <strong>${feed.quantity} kg</strong>
            </div>
        `;

    });

}


// ADD HEALTH RECORD

document.getElementById("health-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const type = document.getElementById("health-type").value;
    const description = document.getElementById("health-description").value;
    const date = document.getElementById("health-date").value;

    healthRecords.push({
        type,
        description,
        date
    });

    saveData();
    renderHealth();

    this.reset();

});


// DISPLAY HEALTH RECORDS

function renderHealth() {

    const list = document.getElementById("health-list");

    list.innerHTML = "";

    healthRecords.forEach(record => {

        list.innerHTML += `
            <div class="record">
                <div>
                    <strong>${record.type}</strong>
                    <small>${record.description}</small>
                </div>

                <span>${record.date}</span>
            </div>
        `;

    });

}


// ADD EXPENSE

document.getElementById("expense-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const category = document.getElementById("expense-category").value;
    const amount = Number(document.getElementById("expense-amount").value);
    const description = document.getElementById("expense-description").value;

    if (amount <= 0) return;

    expenses.push({
        category,
        amount,
        description
    });

    saveData();
    renderExpenses();

    this.reset();

});


// DISPLAY EXPENSES

function renderExpenses() {

    const list = document.getElementById("expense-list");

    list.innerHTML = "";

    expenses.forEach(expense => {

        list.innerHTML += `
            <div class="record">
                <div>
                    <strong>${expense.category}</strong>
                    <small>${expense.description}</small>
                </div>

                <strong>${formatMoney(expense.amount)}</strong>
            </div>
        `;

    });

}


// FORMAT NIGERIAN CURRENCY

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);

}


// UPDATE DASHBOARD

function updateDashboard() {

    const totalBirds = flocks.reduce(
        (total, flock) => total + flock.birds, 0
    );

    const totalFeed = feeds.reduce(
        (total, feed) => total + feed.quantity, 0
    );

    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount, 0
    );

    document.getElementById("total-birds").textContent = totalBirds;

    document.getElementById("total-feed").textContent = totalFeed + " kg";

    document.getElementById("total-health").textContent = healthRecords.length;

    document.getElementById("total-expenses").textContent =
        formatMoney(totalExpenses);

    document.getElementById("overview-birds").textContent =
        totalBirds + " birds";

    document.getElementById("overview-feed").textContent =
        totalFeed + " kg";

    document.getElementById("overview-health").textContent =
        healthRecords.length;

    document.getElementById("report-birds").textContent = totalBirds;

    document.getElementById("report-feed").textContent = totalFeed + " kg";

    document.getElementById("report-expenses").textContent =
        formatMoney(totalExpenses);

}


// DISPLAY DATE

document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// INITIALIZE APPLICATION

function init() {

    renderFlocks();
    renderFeeds();
    renderHealth();
    renderExpenses();

    updateDashboard();

}

init();
