// 7. применение функции сортировки для таблицы слева
// 7. applying the sorting function to the table on the left side
table1.onclick = function(e) {
    if (e.target.tagName != "TH") return;
    let th = e.target;
    sortTable(th.cellIndex, th.dataset.type, "table1");
}

// применение функции сортировки для таблицы справа
// applying the sort function to the table on the right side
table2.onclick = function(e) {
    if (e.target.tagName != "TH") return;
    let th = e.target;
    sortTable(th.cellIndex, th.dataset.type, "table2");
}

// 6. делаем сортировку таблицы
// 6. sort the table
function sortTable(colNum, type, id) {
    let elem = document.getElementById(id);
    let tbody = elem.querySelector("tbody");
    let rowsArray = Array.from(tbody.rows);
    let compare;
    switch(type) {
        case "number":
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            }
            break;
        case "string":
            compare = function(rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            }
            break;
    }
    rowsArray.sort(compare);
    tbody.append(...rowsArray);
}

// 1. Сначала делаем добавление товара в нашей системе. Будем работать с localStorage на JavaScript и библиотекой Sweet Alert 2 для создания диалогового окна.
// 1. First, we add the product to our system. We will work with localStorage in JavaScript and the Sweet Alert 2 library to create a dialog box.
// добавим счетчик числа товаров в локальное хранилище
// add a counter for the number of products to the local storage
if (!localStorage.getItem("goods")) {
  localStorage.setItem("goods", JSON.stringify([])); //конвертируем в строку для храния в локальном хранилище под ключом goods // convert to a string for storing in local storage under the key goods 
}

let myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
    Keyboard: false,
});

// параметры для поиска
// search parameters
let options = {
    valueNames: ["name", "price"]
}
let userList; 

document.querySelector("button.add_new").addEventListener("click", (e) => {
    let name = document.getElementById("good_name").value;
    let price = document.getElementById("good_price").value;
    let count = document.getElementById("good_count").value;
    if (name && price && count) {
        document.getElementById("good_name").value = "";
        document.getElementById("good_price").value = "";
        document.getElementById("good_count").value = "1";
        let goods = JSON.parse(localStorage.getItem("goods")); // значение конвертируется в масиив и тут в ГУДС будет храниться настоящий массив - the value is converted to an array and a real array will be stored here in GOODS
        goods.push(["good_" + goods.length, name, price, count, 0, 0, 0]);
        localStorage.setItem("goods", JSON.stringify(goods));
        update_goods(); // будет обновлять содержимое нашего окна, во время добавления нового товара - will update the contents of our window while adding a new product

        // скрыть модально окно после нажатия кнопки добавления товара
        // hide the modal window after clicking the add product button
        myModal.hide();
    } else {
        Swal.fire({ //вызвать диалоговое окно SWEETSLERT - open the SWEETSLERT dialog box
            icon: "error",
            title: "Error",
            text: "Сould you fill everything, please!",
        });
    }
});

update_goods();

// 2. Теперь сделаем функцию обновление графического интерфейса. Данные будут подтягиваться из локального хранилища localStorage и наша функция будет обновлять содержимое графического интерфейса.
// 2. Make the GUI update function. The data will be pulled from the local storage localStorage and our function will update the contents of the GUI.
function update_goods() {
    let result_price = 0;
    let tbody = document.querySelector(".list");
    tbody.innerHTML = "";
    document.querySelector(".cart").innerHTML = "";
    let goods = JSON.parse(localStorage.getItem("goods")); //JSON.parse - превратить строку в js
    if (goods.length) {
        table1.hidden = false;
        table2.hidden = false;
        for (let i = 0; i < goods.length; i++) {
            tbody.insertAdjacentHTML("beforeend", 
            `
            <tr class="align-middle">
                <td>${i+1}</td>
                <td class="name">${goods[i][1]}</td>
                <td class="price">${goods[i][2]}</td>
                <td>${goods[i][3]}</td>
                <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                <td><button class="good_delete btn-warning text-white" data-goods="${goods[i][0]}">&#10149;</button></td>
            </tr>
            `
            )
            if (goods[i][4] > 0) {
                // под 6 индексом - цена с учетом скидки - under the 6 index - the price including the discount
                // под 4 индексом - кол-во товаров в корзине - under the 4 index - the number of products in the basket
                // под 5 индексом - размер скидки - under the 5 index - the discount amount
                goods[i][6] = goods[i][4]*goods[i][2] - goods[i][4]*goods[i][2]*goods[i][5]*0.01;
                // необходимо суммировать цену в общий результат -it is necessary to sum up the price in the overall result
                result_price += goods[i][6]; // цена с учетом скидки на товар будет прибавляться к результирующей цене - the price, taking into account the discount on the product, will be added to the resulting price
                document.querySelector(".cart").insertAdjacentHTML("beforeend",
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td class="price_name">${goods[i][1]}</td>
                    <td class="price_one">${goods[i][2]}</td>
                    <td class="price_count">${goods[i][4]}</td>
                    <td class="price_discount"><input data-goodid="${goods[i][0]}" type="text" value="${goods[i][5]}" min="0" max="100"></td>
                    <td>${goods[i][6]}</td>
                    <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
                </tr>
                `
                )
            }
        }
        userList = new List("goods", options); 
    } else {
        table1.hidden = true;
        table2.hidden = true;
    }
    document.querySelector(".price_result").innerHTML = result_price + "&#8364;";
}

// 3. удаление товаров
// 3. deleting an item
document.querySelector(".list").addEventListener("click", function(e) {
    if (!e.target.dataset.delete) return;
    Swal.fire({
        title: "Wait!",
        text: "Do you really want to delete an item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#198754",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
    }).then(result => {
        if (result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem("goods"));
            // в цикле мы проверяем все элементы нашего массива с товарами
            // in the loop, we check all the elements of our array with the goods
            for (let i = 0; i < goods.length; i++) {
                // и проверяем в условии, что индетификатор крестика совпадает с индентификатором элемента
                // and we check in the condition that the cross identifier matches the element identifier
                if (goods[i][0] == e.target.dataset.delete) {
                    goods.splice(i, 1);
                    localStorage.setItem("goods", JSON.stringify(goods));
                    update_goods();
                }
            }
            Swal.fire(
                "Deleted!",
                "The selected item has been successfully deleted",
                "Seccess"
            )
        }
    }) 
})

// 4. добавление товара в корзину
// 4. adding an item to the cart
document.querySelector(".list").addEventListener("click", function(e) {
    if (!e.target.dataset.goods) return;
    let goods = JSON.parse(localStorage.getItem("goods"));
    for (let i = 0; i < goods.length; i++) {
        // если кол-во товаров в МАГАЗИНЕ больше нуля, а также атрибут кнопки переноса в корзину совпадает с нашим нулевым параметром из localstorage
        // if the number of products in the STORE is greater than zero, as well as the attribute of the transfer button to the cart coincides with our null parameter from localstorage
        if (goods[i][3] > 0 && goods[i][0] == e.target.dataset.goods) {
            // с помощью splice() удаляем элемент с 3го индекса и добавляем новый. При переносе товара в корзину кол-во в магазине будет уменьшаться
            // using splice(), we remove the element from the 3rd index and add a new one. When transferring an item to the cart, the number in the store will decrease
            goods[i].splice(3, 1, goods[i][3] - 1);
            // будет увеличитьвать кол-во товаров в корзине
            // will increase the number of products in the cart
            goods[i].splice(4, 1, goods[i][4] + 1);
            // помещаем в хранилище
            // put it in the storage
            localStorage.setItem("goods", JSON.stringify(goods));
            // обязательно обновляем интерфейс
            // be sure to update the interface
            update_goods();
        }
    }
})

// 5. удаление товара из корзины
// 5. removing an item from the shopping cart
document.querySelector(".cart").addEventListener("click", function(e) {
    if (!e.target.dataset.delete) return;
    // получаем массив
    // getting an array
    let goods = JSON.parse(localStorage.getItem("goods"));
    // идем в цикле по всем элементам
    // go in a loop through all the elements
    for (let i = 0; i < goods.length; i++) {
        // если кол-во товаров в КОРЗИНЕ больше нуля, а также атрибут кнопки удаления из корзины совпадает с нашим нулевым параметром из localstorage
        // if the number of products in the CART is greater than zero, as well as the attribute of the delete button from the cart coincides with our null parameter from localstorage
        if (goods[i][4] > 0 && goods[i][0] == e.target.dataset.delete) {
            // будет увеличивать кол-во товаров в магазине
            // will increase the number of products in the store
            goods[i].splice(3, 1, goods[i][3] + 1);
            // будет уменьшать кол-во товаров в корзине
            // will reduce the number of items in the cart
            goods[i].splice(4, 1, goods[i][4] - 1);
            // помещаем в хранилище
            // put it in the storage
            localStorage.setItem("goods", JSON.stringify(goods));
            // обязательно обновляем интерфейс
            // be sure to update the interface
            update_goods();
        }
    }
})

document.querySelector(".cart").addEventListener("change", function(e) {
    if (!e.target.dataset.goodid) return;
    let goods = JSON.parse(localStorage.getItem("goods"));
    for (let i = 0; i < goods.length; i++) {
        if (goods[i][0] == e.target.dataset.goodid) {
            goods[i][5] = e.target.value;
            goods[i][6] = goods[i][4]*goods[i][2] - goods[i][4]*goods[i][2]*goods[i][5]*0.01;
            localStorage.setItem("goods", JSON.stringify(goods));
            update_goods();
            // если использовать "input" вместо "change" то будет сбрасываться фокус, у нас обновляется локальное хранилице и перестраивается DOM tree
            // let input = document.querySelector(`[data-goodid="${goods[i][0]}"]`);
            // input.focus();
            // input.selectionStart = input.value.length;
        }
    }
})