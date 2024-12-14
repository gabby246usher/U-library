// Authentication and Section Toggle
const loginLink = document.getElementById("login-link");
const signupLink = document.getElementById("signup-link");
const logoutLink = document.getElementById("logout-link");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const userSection = document.getElementById("user-section");
const adminSection = document.getElementById("admin-section");
const authSection = document.getElementById("auth-section");

let isLoggedIn = false;
let isAdmin = false;

function toggleSections() {
  authSection.style.display = isLoggedIn ? "none" : "block";
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  userSection.style.display = isLoggedIn && !isAdmin ? "block" : "none";
  adminSection.style.display = isLoggedIn && isAdmin ? "block" : "none";
  logoutLink.style.display = isLoggedIn ? "block" : "none";
  loginLink.style.display = isLoggedIn ? "none" : "block";
  signupLink.style.display = isLoggedIn ? "none" : "block";
}

///////////////////////////SIGN-UP AND LOGIN//////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("users")) {
    console.log("Users already exist in local storage.");
  } else {
    localStorage.setItem("users", JSON.stringify({})); // Initialize storage if not present
  }

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    // Add click event listener to the logout link
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior

      // Clear session or local storage (if used for authentication)
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Remove user data if necessary
      // For example, clear any session-related data or UI updates for logged-out state

      // Redirect to login page or homepage
      window.location.href = "index.html"; // Redirect to the login page
    });
  }

  // Ensure user is logged out if no auth token exists
  if (!localStorage.getItem("authToken")) {
    const currentPage = window.location.pathname;
    if (!currentPage.includes("index.html")) {
      window.location.href = "index.html"; // Redirect to login if not logged in
    }
  }
});

// Function to handle sign-up
document.getElementById("signup-btn").addEventListener("click", () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all the fields.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users"));

  if (users[email]) {
    alert("User already exists! Please log in.");
    return;
  }

  // Save user to localStorage
  users[email] = { name, password };
  localStorage.setItem("users", JSON.stringify(users));

  alert("Sign-up successful! Redirecting to login...");

  // Slide to login after successful sign-up
  const credentialsContainer = document.querySelector(".credentials-container");
  credentialsContainer.classList.remove("sign-up-mode");
});

// Function to handle login
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please enter your credentials.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users"));

  if (!users[email]) {
    alert("User not found! Please sign up.");
    return;
  }

  if (users[email].password !== password) {
    alert("Incorrect password! Please try again.");
    return;
  }

  // Save login state (e.g., auth token)
  localStorage.setItem("authToken", JSON.stringify({ email }));

  alert("Login successful! Redirecting to your dashboard...");
  window.location.href = "main.html"; // Replace with the actual path to your main page
});

// Handle "Sign Up" button click to slide the container
document.getElementById("signUp").addEventListener("click", () => {
  const credentialsContainer = document.querySelector(".credentials-container");
  credentialsContainer.classList.add("sign-up-mode");
});

//////////////////////////////////////////////////////////
const booksData = {
  Programming: [
    { title: "JavaScript for Beginners", available: 5 },
    { title: "Mastering Node.js", available: 3 },
  ],
  Electronics: [
    { title: "Introduction to Circuits", available: 7 },
    { title: "Basic Electronics", available: 4 },
  ],
  Logic: [
    { title: "Logic for Computer Science", available: 2 },
    { title: "Discrete Mathematics", available: 6 },
  ],
  Science: [
    { title: "Physics for Engineers", available: 8 },
    { title: "Chemistry Basics", available: 3 },
  ],
};

// Event listener for category buttons
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const category = event.target.getAttribute("data-category");
    showBooks(category);
  });
});

// Show books for the selected category
function showBooks(category) {
  document.getElementById("category-title").textContent = `${category} Books`;
  const booksList = document.getElementById("books-list");
  booksList.innerHTML = ""; // Clear previous books list
  const books = booksData[category];

  books.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("col-md-4", "mb-3");
    bookCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Available: <span id="book-available-${category}-${index}">${book.available}</span></p>
          <button class="btn btn-success borrow-btn" data-category="${category}" data-index="${index}">
            Borrow Book
          </button>
        </div>
      </div>
    `;
    booksList.appendChild(bookCard);
  });

  document.getElementById("categories-section").style.display = "none";
  document.getElementById("books-section").style.display = "block";
}

// Event listener for borrow buttons
document.getElementById("books-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("borrow-btn")) {
    const category = event.target.getAttribute("data-category");
    const index = event.target.getAttribute("data-index");
    borrowBook(category, index);
  }
});

// Borrow a book and update available count
function borrowBook(category, index) {
  const book = booksData[category][index];
  if (book.available > 0) {
    book.available--;
    document.getElementById(`book-available-${category}-${index}`).textContent =
      book.available;
    alert(`You borrowed "${book.title}".`);
  } else {
    alert("Sorry, this book is no longer available.");
  }
}

///////////////////////// SEARCH ////////////////////////////////////////////

document.getElementById("searchButton").addEventListener("click", function () {
  const searchQuery = document.getElementById("bookSearch").value;
  if (searchQuery) {
    window.location.href = `searchResults.html?q=${searchQuery}`; // Redirect to a results page with the query
  }
});

document
  .getElementById("bookSearch")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      document.getElementById("searchButton").click(); // Trigger the search button when Enter is pressed
    }
  });
