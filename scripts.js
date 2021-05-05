const expenses = [
    {
        month: "Janeiro",
        year: 2021,
        expenses:[
            {
                description: "Feijão",
                quantity: 5,
                price: 8.5,
            },
            {
                description: "Arroz",
                quantity: 3,
                price: 6,
            },
            {
                description: "Leite",
                quantity: 2,
                price: 2.5,
            },
            {
                description: "Peito de frango",
                quantity: 1,
                price: 13.75,
            },
            {
                description: "Biscoto doce",
                quantity: 5,
                price: 2.55,
            },
            {
                description: "Creme dental",
                quantity: 2,
                price: 4.50,
            },
        ]
    },
    {
        month: "Fevereiro",
        year: 2021,
        expenses:[
            {
                description: "Queijo ralado",
                quantity: 2,
                price: 3,
            },
            {
                description: "Macarrão instatâneo",
                quantity: 30,
                price: 1.99,
            },
            {
                description: "Leite",
                quantity: 3,
                price: 2.75,
            },
            {
                description: "Peixe fresco",
                quantity: 5,
                price: 5.55,
            },
            {
                description: "Açucar",
                quantity: 5,
                price: 2.55,
            },
        ]
    },
    {
        month: "Março",
        year: 2021,
        expenses:[
            {
                description: "Papel Higiênico",
                quantity: 8,
                price: 0.50,
            },
            {
                description: "Desodorante dove",
                quantity: 3,
                price: 3.55,
            },
        ]
    },
    {
        month: "Abril",
        year: 2021,
        expenses:[
            {
                description: "Papel Higiênico",
                quantity: 8,
                price: 0.50,
            },
            {
                description: "Aromatizante 50ml",
                quantity: 3,
                price: 6.55,
            },
            {
                description: "Sabão em pó",
                quantity: 6,
                price: 3.35,
            },
            {
                description: "Sabão em pedra",
                quantity: 8,
                price: 0.45,
            },
            {
                description: "Água sanitária",
                quantity: 2,
                price: 4.50,
            },
        ]
    },
]

const Toggle = {    
    toggleMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('off');
    },

    toggleModal(){
        document
            .querySelector('.container-modal')
            .classList
            .toggle('modal-active');
    },
}

const resolveDataCard = {
    resolveCurrentMonth(expense){
        return expense.month+' de '+expense.year;
    },

    resolveNumOfProducts(expense){
        return expense.expenses.length;
    },

    resolveBigQuantityProduct(expense){
        let product = {
            quantityMaxima: 0,
            description: ''
        }
        expense.expenses.map(item => {      
            item.quantity > product.quantityMaxima &&
                (product.quantityMaxima = item.quantity, 
                product.description = item.description)
        })
        return `${product.description} (${product.quantityMaxima})`;
    },

    resolveHighPrice(expense){
        let product = {
            highPrice: 0,
            description: ''
        }
        expense.expenses.map(item => {      
            item.price > product.highPrice &&
                (product.highPrice = item.price, 
                product.description = item.description)
        })
        return `${product.description} (${product.highPrice})`;
    },

    resolveTotalOfMonth(expense){
        return (expense.expenses.reduce((oldValue, actualValue) => oldValue + (actualValue.price * actualValue.quantity), 0)).toFixed(2)
    }
}

const dataCard = {
    currentMonth: document.getElementById('current-month'),
    numOfProducts: document.getElementById('num-of-products'),
    bigQuantityProduct: document.getElementById('big-quantity-product'),
    highPrice: document.getElementById('high-price'),
    totalOfMonth: document.getElementById('total-of-month'),

    getDataCurrentMonth(expense){
        dataCard.currentMonth.innerHTML = resolveDataCard.resolveCurrentMonth(expense);
        dataCard.numOfProducts.innerHTML = resolveDataCard.resolveNumOfProducts(expense);
        dataCard.bigQuantityProduct.innerHTML = resolveDataCard.resolveBigQuantityProduct(expense);
        dataCard.highPrice.innerHTML = resolveDataCard.resolveHighPrice(expense);
        dataCard.totalOfMonth.innerHTML = resolveDataCard.resolveTotalOfMonth(expense);        
    }

}

const Utility = {
    description: document.getElementById('description'),
    quantity: document.getElementById('quantity'),
    price: document.getElementById('price'),
}

const DOM = {
    expensesContainer: document.querySelector('#body-expenses'),
    sideBarContainer: document.querySelector('#sidebar'),
    
    addItemsMenuBar(data){
        const a = document.createElement(`a`);
        a.innerHTML = `${data.month+' de '+data.year}`;
        a.setAttribute('href', "#");
        a.setAttribute('onclick', `App.loadData("${data.month}", ${data.year})`);
        DOM.sideBarContainer.appendChild(a);
    },

    addExpense(expense){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLExpenses(expense);
        DOM.expensesContainer.appendChild(tr);
},

    innerHTMLExpenses(expense){
        const html = `
            <td>${expense.description}</td>
            <td>${expense.quantity}</td>
            <td>${expense.price}</td>
            <td>${(expense.price*expense.quantity).toFixed(2)}</td>
            <td>
                <a href="#">
                    <img src="./assets/edit.svg" alt="editar item">
                </a>
                
                <a href="#">
                    <img src="./assets/remove.svg" alt="remover item">
                </a>
            </td>
        `

        return html
    },

    clearExpenses() {
        DOM.expensesContainer.innerHTML = '';
    },
}

const App = {
    init(){
        expenses.reverse().forEach(element => {
            DOM.addItemsMenuBar(element);
        })

        App.loadData(expenses[0].month, expenses[0].year);
    },

    filteredData(month, year){
        const response = expenses.find(expense => (expense.month === month && expense.year === year));
        return response;
    },

    loadData(month, year){
        DOM.clearExpenses();   
        const expense = App.filteredData(month, year);

        expense.expenses.forEach(item => DOM.addExpense(item));
        dataCard.getDataCurrentMonth(expense);
    },
}

App.init();