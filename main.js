const cards = window.localStorage.getItem("cards") ? new Map(JSON.parse(window.localStorage.getItem("cards"))) : new Map();
drawCards(cards);
function makeCardElement(card) {
    const item = document.createElement("li");
    const div = document.createElement("div");
    const header = document.createElement("h3");
    const body = document.createElement("div");
    item.classList.add("card");
    header.classList.add("card-header");
    body.classList.add("card-body");
    header.innerText = card.title;
    body.innerText = card.text;
    item.appendChild(div);
    item.appendChild(header);
    item.appendChild(body);
    return item;
}
function drawCards(cards) {
    Array.from(document.getElementsByTagName("ul")).forEach(list => {list.innerHTML = "";})
    cards.forEach((task, id) => {
        const card = {...task, id: id };
        const list = document.getElementById(`${card.category}-list`);
        const item = makeCardElement(card);
        item.appendChild(makeSelectElement(card));
        list.appendChild(item);
    })
}
function addCard() {
    let title = document.getElementById("new-card-heading");
    let text = document.getElementById("new-card-body");
    let list = document.getElementById("new-card-list");
    let cards = window.localStorage.getItem("cards") ? new Map(JSON.parse(window.localStorage.getItem("cards"))) : new Map();
    cards.set(cards.size + 1, {
        title: title.value,
        text: text.value,
        category: list.value
    })
    title.value = "";
    text.value = "";
    window.localStorage.setItem("cards", JSON.stringify(Array.from(cards.entries())));
    drawCards(cards)
}
function makeSelectElement(card){
    const div = document.createElement("div");
    const select = document.createElement("select");
    select.id = card.id;
    select.onchange = function(e){moveCard(this, card)};
    const options = [{text: "-Move Card-", val: "move"}, {text: "To Do", val: "to-do"}, {text: "Doing", val: "doing"}, {text: "Done", val: "done"}, {text: "Delete", val: "delete"}/*, {text: "Archive", val:"archived"}*/];
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.innerText = option.text;
        optionElement.value = option.val;
        select.appendChild(optionElement);
    })
    div.appendChild(select);
    return div;
}
function moveCard({value, parentElement: {parentElement}}, card){
    if(value === "delete"){
        cards.delete(card.id);
        window.localStorage.setItem("cards", JSON.stringify(Array.from(cards.entries())));
        document.getElementById(`${card.category}-list`).removeChild(parentElement);
        return;
    }
    card.category = value;
    cards.set(card.id, card);
    document.getElementById(`${card.category}-list`).appendChild(parentElement);
    window.localStorage.setItem("cards", JSON.stringify(Array.from(cards.entries())));
}