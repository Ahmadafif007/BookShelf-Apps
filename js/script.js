document.addEventListener("DOMContentLoaded", function () {
    const submitBook = document.getElementById("inputBook");
    swal("Selamat datang di SmartShelf", "Silakan masukkan buku");
    submitBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();

        swal({
            title: "Berhasil Menambahkan Buku!",
            icon: "success",
            button: "Tutup",
        });
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFrombooks();
});

function changeText() {
    const checkbox = document.getElementById("inputBookIsComplete");
    const textSubmit = document.getElementById("textSubmit");

    if (checkbox.checked == true) {
        textSubmit.innerText = "Sudah selesai dibaca";
    } else {
        textSubmit.innerText = "Belum selesai dibaca";
    }
};


const STORAGE_KEY = "BOOK_APPS";

let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser anda tidak mendukung local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composebookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findbook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findbookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }
    return -1;
}

const INCOMPLETE_BOOKSHELFLIST = "incompleteBookshelfList";
const COMPLETE_BOOK_SHELFLIST = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
    const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOKSHELFLIST);
    const completeBookshelfList = document.getElementById(COMPLETE_BOOK_SHELFLIST);

    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = tambahBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    const bookObject = composebookObject(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (inputBookIsComplete == false) {
        incompleteBookshelfList.append(book);
    } else {
        completeBookshelfList.append(book);
    }

    updateDataToStorage();
}

function tambahBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = inputBookTitle;
    bookTitle.classList.add("move")

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = inputBookAuthor;

    const bookYears = document.createElement('p');
    bookYears.classList.add("year");
    bookYears.innerText = inputBookYear;

    const bookIsComplete = createCompleteButton();

    const bookRemove = createRemoveButton();
    bookRemove.innerText = "Hapus";

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (inputBookIsComplete == true) {
        bookIsComplete.innerText = "Belum selesai";
    } else {
        bookIsComplete.innerText = "Sudah selesai";
    }

    bookAction.append(bookIsComplete, bookRemove);
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.append(bookTitle, bookAuthor, bookYears, bookAction);

    return bookItem;
};

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
};

function createCompleteButton() {
    return createButton("green", function (event) {
        const parent = event.target.parentElement;
        addBookToCompleted(parent.parentElement);
    });
};

function removeBook(bookElement) {
    const bookPosition = findbookIndex(bookElement[BOOK_ITEMID]);
    if (swal("Data Berhasil Dihapus")); {
        books.splice(bookPosition, 1);
        bookElement.remove();
    }
    updateDataToStorage();

};

function createRemoveButton() {
    return createButton("red", function (event) {
        const parent = event.target.parentElement;
        removeBook(parent.parentElement);
    });
};

function addBookToCompleted(bookElement) {
    const bookTitled = bookElement.querySelector(".book_item > h3").innerText;
    const bookAuthored = bookElement.querySelector(".book_item > p").innerText;
    const bookYeared = bookElement.querySelector(".year").innerText;
    const bookIsComplete = bookElement.querySelector(".green").innerText;

    if (bookIsComplete == "Sudah selesai") {
        const newBook = tambahBook(bookTitled, bookAuthored, bookYeared, true)
        
        const book = findbook(bookElement[BOOK_ITEMID]);
        book.isCompleted = true;
        newBook[BOOK_ITEMID] = book.id;

        const completeBookshelfList = document.getElementById(COMPLETE_BOOK_SHELFLIST);
        completeBookshelfList.append(newBook);
        swal("Berhasil memindahkan ke rak baru");
    } else {
        const newBook = tambahBook(bookTitled, bookAuthored, bookYeared, false)

        const book = findbook(bookElement[BOOK_ITEMID]);
        book.isCompleted = false;
        newBook[BOOK_ITEMID] = book.id;

        const incompleteBookshelfList = document.getElementById(INCOMPLETE_BOOKSHELFLIST);
        incompleteBookshelfList.append(newBook);
        swal("Berhasil memindahkan ke rak baru");
    }
    bookElement.remove();

    updateDataToStorage();
};

function refreshDataFrombooks() {
    const listUncompleted = document.getElementById(INCOMPLETE_BOOKSHELFLIST);
    const listCompleted = document.getElementById(COMPLETE_BOOK_SHELFLIST);

    for (book of books) {
        const newbook = tambahBook(book.title, book.author, book.year, book.isCompleted);
        newbook[BOOK_ITEMID] = book.id;

        if (book.isCompleted == false) {
            listUncompleted.append(newbook);
        } else {
            listCompleted.append(newbook);
        }
    }
}

