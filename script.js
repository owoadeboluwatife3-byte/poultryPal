
// =====================================
// GET HTML ELEMENTS
// =====================================

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("page-title");


// =====================================
// LANDING PAGE
// =====================================

// Select the landing page
const landingPage = document.getElementById("landing-page");

// Select the entire application
const appContainer = document.getElementById("app-container");

// Select the Get Started button
const getStartedBtn = document.getElementById("get-started");

// Listen for a click on Get Started
getStartedBtn.addEventListener("click", function () {

    // Hide the landing page
    landingPage.hidden = true;

    // Show the entire application
    appContainer.hidden = false;

});


// =====================================
// DATABASE (LOCAL STORAGE)
// =====================================

let flocks = JSON.parse(localStorage.getItem("flocks")) || [];
let feeds = JSON.parse(localStorage.getItem("feeds")) || [];
let healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// =====================================
// SAVE DATA
// =====================================

function saveData() {

    localStorage.setItem("flocks", JSON.stringify(flocks));
    localStorage.setItem("feeds", JSON.stringify(feeds));
    localStorage.setItem("healthRecords", JSON.stringify(healthRecords));
    localStorage.setItem("expenses", JSON.stringify(expenses));

}


// =====================================
// NAVIGATION
// =====================================

function showPage(pageName) {

    // Remove active class from every page
    pages.forEach(page => {
        page.classList.remove("active");
    });

    // Remove active class from every navigation button
    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Show the selected page
    document.getElementById(pageName).classList.add("active");

    // Find the button belonging to the selected page
    const activeButton = document.querySelector(
        `[data-page="${pageName}"]`
    );

    // Highlight the selected button
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Update the page heading
    pageTitle.textContent =
        pageName.charAt(0).toUpperCase() + pageName.slice(1);

}


// Listen for clicks on sidebar buttons
navButtons.forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });

});


// =====================================
// QUICK ACTION BUTTONS
// =====================================

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });

});


// =====================================
// ADD FLOCK
// =====================================

document.getElementById("flock-form").addEventListener("submit", function(e) {

    // Stop the page from refreshing
    e.preventDefault();

    // Get values from the form
    const name = document.getElementById("batch-name").value.trim();
    const birds = Number(document.getElementById("bird-count").value);
    const date = document.getElementById("arrival-date").value;

    // Validate the bird count
    if (!Number.isInteger(birds) || birds <= 0) {
        alert("Enter a valid whole number of birds.");
        return;
    }

    // Add the new flock
    flocks.push({
        name,
        birds,
        date
    });

    // Save and update the application
    saveData();
    renderFlocks();
    updateDashboard();

    // Clear the form
    this.reset();

});


// =====================================
// DISPLAY FLOCKS
// =====================================

function renderFlocks() {

    const list = document.getElementById("flock-list");

    // Clear the existing list
    list.innerHTML = "";

    // Display every flock
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


// =====================================
// ADD FEED
// =====================================

document.getElementById("feed-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const type = document.getElementById("feed-type").value;
    const quantity = Number(document.getElementById("feed-quantity").value);

    if (!Number.isFinite(quantity) || quantity <= 0) {
        alert("Enter a valid feed quantity.");
        return;
    }

    // Check whether this feed type already exists
    const existingFeed = feeds.find(feed => feed.type === type);

    if (existingFeed) {

        // Add to the existing quantity
        existingFeed.quantity += quantity;

    } else {

        // Create a new feed record
        feeds.push({
            type,
            quantity
        });

    }

    saveData();
    renderFeeds();
    updateDashboard();

    this.reset();

});


// =====================================
// DISPLAY FEED
// =====================================

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


// =====================================
// ADD HEALTH RECORD
// =====================================

document.getElementById("health-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const type = document.getElementById("health-type").value;
    const description = document.getElementById("health-description").value.trim();
    const date = document.getElementById("health-date").value;

    healthRecords.push({
        type,
        description,
        date
    });

    saveData();
    renderHealth();
    updateDashboard();

    this.reset();

});


// =====================================
// DISPLAY HEALTH RECORDS
// =====================================

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


// =====================================
// ADD EXPENSE
// =====================================

document.getElementById("expense-form").addEventListener("submit", function(e) {

    e.preventDefault();

    const category = document.getElementById("expense-category").value;
    const amount = Number(document.getElementById("expense-amount").value);
    const description = document.getElementById("expense-description").value.trim();

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid expense amount.");
        return;
    }

    expenses.push({
        category,
        amount,
        description
    });

    saveData();
    renderExpenses();
    updateDashboard();

    this.reset();

});


// =====================================
// DISPLAY EXPENSES
// =====================================

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


// =====================================
// FORMAT NIGERIAN CURRENCY
// =====================================

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);

}


// =====================================
// UPDATE DASHBOARD
// =====================================

function updateDashboard() {

    // Calculate total birds
    const totalBirds = flocks.reduce(
        (total, flock) => total + flock.birds, 0
    );

    // Calculate total feed
    const totalFeed = feeds.reduce(
        (total, feed) => total + feed.quantity, 0
    );

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
        (total, expense) => total + expense.amount, 0
    );


    // Update dashboard statistics
    document.getElementById("total-birds").textContent = totalBirds;

    document.getElementById("total-feed").textContent =
        totalFeed + " kg";

    document.getElementById("total-health").textContent =
        healthRecords.length;

    document.getElementById("total-expenses").textContent =
        formatMoney(totalExpenses);


    // Update farm overview
    document.getElementById("overview-birds").textContent =
        totalBirds + " birds";

    document.getElementById("overview-feed").textContent =
        totalFeed + " kg";

    document.getElementById("overview-health").textContent =
        healthRecords.length;


    // Update reports
    document.getElementById("report-birds").textContent =
        totalBirds;

    document.getElementById("report-feed").textContent =
        totalFeed + " kg";

    document.getElementById("report-expenses").textContent =
        formatMoney(totalExpenses);

}


// =====================================
// DISPLAY DATE
// =====================================

document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// =====================================
// INITIALIZE APPLICATION
// =====================================

function init() {

    // Display saved records
    renderFlocks();
    renderFeeds();
    renderHealth();
    renderExpenses();

    // Calculate dashboard statistics
    updateDashboard();

}

// Run the application
init();
