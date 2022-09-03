document.addEventListener('DOMContentLoaded', function () {
    const Input = document.getElementById('input');
    Input.addEventListener('input', function (event) {
        event.preventDefault();
        addBook();
    });
});
function addBook() {
    const textBook = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, timestamp, false);
    todos.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}
function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}
const books = [];
const RENDER_EVENT = 'render-book';
document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
});