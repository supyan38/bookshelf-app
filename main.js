const STORAGE_KEY = "BOOKSHELF_APP";
let books = [];

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadFromLocalStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  const titleElement = document.createElement("h3");
  titleElement.setAttribute("data-testid", "bookItemTitle");
  titleElement.textContent = book.title;

  const authorElement = document.createElement("p");
  authorElement.setAttribute("data-testid", "bookItemAuthor");
  authorElement.textContent = `Penulis: ${book.author}`;

  const yearElement = document.createElement("p");
  yearElement.setAttribute("data-testid", "bookItemYear");
  yearElement.textContent = `Tahun: ${book.year}`;

  const buttonContainer = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleButton.addEventListener("click", () => toggleBookCompletion(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.textContent = "Edit Buku";
  editButton.addEventListener("click", () => editBook(book.id));

  buttonContainer.append(toggleButton, deleteButton, editButton);
  bookElement.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookElement;
}

function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  });
}

function addBook(title, author, year, isComplete) {
  const book = {
    id: new Date().getTime(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
  books.push(book);
  saveToLocalStorage();
  renderBooks();
}

function toggleBookCompletion(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveToLocalStorage();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveToLocalStorage();
  renderBooks();
}

function editBook(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {

      const popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "50%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.backgroundColor = "white";
      popup.style.padding = "20px";
      popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  
      const form = document.createElement("form");
  
      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.value = book.title;
      titleInput.placeholder = "Judul Buku";
  
      const authorInput = document.createElement("input");
      authorInput.type = "text";
      authorInput.value = book.author;
      authorInput.placeholder = "Penulis Buku";
  
      const yearInput = document.createElement("input");
      yearInput.type = "number";
      yearInput.value = book.year;
      yearInput.placeholder = "Tahun Rilis";
  
      const saveButton = document.createElement("button");
      saveButton.type = "submit";
      saveButton.textContent = "Simpan Perubahan";
  
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Batal";
  
      cancelButton.addEventListener("click", () => {
        document.body.removeChild(popup);
      });
  
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        book.title = titleInput.value;
        book.author = authorInput.value;
        book.year = Number(yearInput.value);
        saveToLocalStorage();
        renderBooks();
        document.body.removeChild(popup);
      });
  
      form.append(titleInput, authorInput, yearInput, saveButton, cancelButton);
      popup.append(form);
      document.body.append(popup);
    }
  }

document.getElementById("bookForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);

  event.target.reset();
});

window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
  renderBooks();
});
