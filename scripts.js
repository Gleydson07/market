const expenses = [
    {
        month: "Janeiro",
        year: 2021,
        expenses:[
            {
                description: "Feijão",
                quantity: 5,
                price: 850,
            },
            {
                description: "Arroz",
                quantity: 3,
                price: 600,
            },
            {
                description: "Leite",
                quantity: 2,
                price: 250,
            },
            {
                description: "Peito de frango",
                quantity: 1,
                price: 1375,
            },
            {
                description: "Biscoto doce",
                quantity: 5,
                price: 255,
            },
            {
                description: "Creme dental",
                quantity: 2,
                price: 450,
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
                price: 300,
            },
            {
                description: "Macarrão instatâneo",
                quantity: 30,
                price: 199,
            },
            {
                description: "Leite",
                quantity: 3,
                price: 275,
            },
            {
                description: "Peixe fresco",
                quantity: 5,
                price: 555,
            },
            {
                description: "Açucar",
                quantity: 5,
                price: 255,
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
                price: 50,
            },
            {
                description: "Desodorante dove",
                quantity: 3,
                price: 355,
            },
            {
                description: "Carne bovina",
                quantity: 12,
                price: 2200
            }
        ]
    },
    {
        month: "Abril",
        year: 2021,
        expenses:[
            {
                description: "Papel Higiênico",
                quantity: 8,
                price: 150,
            },
            {
                description: "Aromatizante 50ml",
                quantity: 3,
                price: 655,
            },
            {
                description: "Sabão em pó",
                quantity: 6,
                price: 335,
            },
            {
                description: "Sabão em pedra",
                quantity: 8,
                price: 45,
            },
            {
                description: "Água sanitária",
                quantity: 2,
                price: 450,
            },
        ]
    },
]

let periodExpense = [];

const Toggle = {    
    toggleMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('active');
    },

    toggleModal(){
        document
            .querySelector('.container-modal')
            .classList
            .toggle('modal-active');
    },
}

const Resolve = {
    currentMonth(){
        return periodExpense.month+' de '+periodExpense.year;
    },

    numOfProducts(){
        return Utility.formatQuantity(periodExpense.expenses.length);
    },

    bigQuantityProduct(){
        let product = {
            quantityMaxima: 0,
            description: ''
        }
        periodExpense.expenses.map(item => {      
            item.quantity > product.quantityMaxima &&
                (product.quantityMaxima = item.quantity, 
                product.description = item.description)
        })
        return `${product.description} (${Utility.formatQuantity(product.quantityMaxima)})`;
    },

    highPrice(){
        let product = {
            highPrice: 0,
            description: ''
        }
        periodExpense.expenses.map(item => {      
            item.price > product.highPrice &&
                (product.highPrice = item.price, 
                product.description = item.description)
        })
        return `${product.description} (${Utility.formatCurrency(product.highPrice)})`;
    },

    totalOfMonth(){
        return Utility.formatCurrency(
            periodExpense.expenses.reduce(
                (oldValue, actualValue) => 
                oldValue + (actualValue.price * actualValue.quantity), 0
            )
        )
    },

    ordenedArray(){
        let arrayTotal = [];
        expenses.map((item) => {            
            arrayTotal.push({
                month: item.month,
                year: item.year,
                totalMonth: item.expenses.reduce((oldValue, currentValue) => oldValue + (currentValue.quantity * currentValue.price), 0)
            })
        })

        arrayTotal.sort((posOne, posTwo) => {
            return posOne.totalMonth - posTwo.totalMonth;
        })

        return arrayTotal;
    },

    rankingPosition(){
        const arrayExpenses = Resolve.ordenedArray();

        const data = arrayExpenses.findIndex(item => (periodExpense.month === item.month && periodExpense.year === item.year));
        return Utility.formatQuantity(data+1);
    },

    highExpenseMonth(){
        const arrayExpenses = Resolve.ordenedArray();
        return `${arrayExpenses[arrayExpenses.length-1].month} de ${arrayExpenses[arrayExpenses.length-1].year}`;
    },

    lowerExpenseMonth(){
        const arrayExpenses = Resolve.ordenedArray();
        return `${arrayExpenses[0].month} de ${arrayExpenses[0].year}`;
    },
}

const dataCard = {
    // Month Card
    currentMonth: document.getElementById('current-month'),
    numOfProducts: document.getElementById('num-of-products'),
    bigQuantityProduct: document.getElementById('big-quantity-product'),
    highPrice: document.getElementById('high-price'),
    totalOfMonth: document.getElementById('total-of-month'),
    
    // Statistics
    rankingPosition: document.getElementById('ranking-position'),
    highExpenseMonth: document.getElementById('high-expense-month'),
    lowerExpenseMonth: document.getElementById('lower-expense-month'),    

    getDataCurrentMonth(){
        // Month Card
        dataCard.currentMonth.innerHTML = Resolve.currentMonth();
        dataCard.numOfProducts.innerHTML = Resolve.numOfProducts();
        dataCard.bigQuantityProduct.innerHTML = Resolve.bigQuantityProduct();
        dataCard.highPrice.innerHTML = Resolve.highPrice();
        dataCard.totalOfMonth.innerHTML = Resolve.totalOfMonth();      
        
        //Statistics
        dataCard.rankingPosition.innerHTML = Resolve.rankingPosition();
        dataCard.highExpenseMonth.innerHTML = Resolve.highExpenseMonth();
        dataCard.lowerExpenseMonth.innerHTML = Resolve.lowerExpenseMonth();
    }

}

const Utility = {
    formatQuantity(quantity){
        return quantity < 10 ? ("00" + quantity).slice(-2).replace(".",",") : quantity;
    },

    formatCurrencyToSave(currency){
        return Number(currency)*100;
    },

    formatCurrency(value){
        return (value/100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
    },
}

const orderToExpense = {
    add(data){
        const {month, year, description, quantity, price} = data;

        console.log(month, year)

        expenses.map((item, index) => {
            if(month === item.month && year === item.year){
                expenses[index].expenses.push({
                    description, 
                    quantity, 
                    price
                })

            }
        })
        
        App.loadData(month, year)
    }

}

const DOM = {
    expensesContainer: document.querySelector('#body-expenses'),
    sideBarContainer: document.querySelector('#sidebar'),
    formExpense: document.getElementById('form-expense'),
    
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
            <td>${Utility.formatQuantity(expense.quantity)}</td>
            <td>${Utility.formatCurrency(expense.price)}</td>
            <td>${Utility.formatCurrency((expense.price*expense.quantity))}</td>
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

const Form = {
    description: document.querySelector('.fieldset #description'),
    quantity: document.querySelector('.fieldset #quantity'),
    price: document.querySelector('.fieldset #price'),

    getValues(){
        const month = periodExpense.month;
        const year = String(periodExpense.year);
        const description = Form.description.value;
        const quantity = Form.quantity.value;
        const price = Form.price.value;

        if(month.trim() === "" || year.trim() === ""
            || description.trim() === ""
            || quantity.trim() === ""
            || price.trim() === ""){
                throw new Error("Por favor preencha todos os campos.");
        }

        return {
            month,
            year: Number(year),
            description,
            quantity: Number(quantity),
            price: Utility.formatCurrencyToSave(Number(price))            
        }
    },

    clearFieldset(){
        Form.description.value = "";
        Form.quantity.value = "";
        Form.price.value = "";
    },
    
    //Listener
    submit(event){
        event.preventDefault();

        try {
            orderToExpense.add(Form.getValues());
            Form.clearFieldset();
            Toggle.toggleModal();
        } catch (error) {
            alert(error.message)
        }
    }

}

const App = {
    init(){
        expenses.reverse().forEach(element => {
            DOM.addItemsMenuBar(element);
        })

        App.loadData(expenses[0].month, expenses[0].year);
    },

    filteredData(month, year){
        periodExpense = expenses.find(expense => (expense.month === month && expense.year === year));
    },

    loadData(month, year){
        DOM.clearExpenses();   
        App.filteredData(month, year);

        periodExpense.expenses.forEach(item => DOM.addExpense(item));
        dataCard.getDataCurrentMonth(periodExpense);
    },
}

App.init();