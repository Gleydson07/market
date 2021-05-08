// Alterna a sidebar o modalMonth e o modalExpense entre visíveis e não visíveis
const Toggle = {
    toggleMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('active');
    },

    toggleModalExpense(){
        document
            .querySelector('#container-modal-expense')
            .classList
            .toggle('modal-active-expense');
    },

    toggleModalMonth(){
        document
            .querySelector('#container-modal-month')
            .classList
            .toggle('modal-active-month');
    },

    toggleFormAndPagination(hasData){
        if(!hasData){
            document
                .querySelector('#table-pagination')
                .classList
                .add('table-pagination-active')
         }else{
            document
            .querySelector('#table-pagination')
            .classList
            .remove('table-pagination-active')
         }
    },
}

// Dados no localStorage
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("@commerce:expenses"))
    },

    set(expenses){
        localStorage.setItem("@commerce:expenses", JSON.stringify(expenses));
    }
}

// Array de dados
const dataExpenses = Storage.get();

//[
//     {
//         month: 1,
//         year: 2000,
//         expenses:[
//             {
//                 description: "Queijo ralado",
//                 quantity: 2,
//                 price: 300,
//             },
//             {
//                 description: "Macarrão instatâneo",
//                 quantity: 30,
//                 price: 199,
//             },
//             {
//                 description: "Leite",
//                 quantity: 3,
//                 price: 275,
//             },
//             {
//                 description: "Peixe fresco",
//                 quantity: 5,
//                 price: 555,
//             },
//             {
//                 description: "Açucar",
//                 quantity: 5,
//                 price: 255,
//             },
//             {
//                 description: "Papel Higiênico",
//                 quantity: 8,
//                 price: 50,
//             },
//             {
//                 description: "Desodorante dove",
//                 quantity: 3,
//                 price: 355,
//             },
//             {
//                 description: "Carne bovina",
//                 quantity: 12,
//                 price: 2200
//             },
//             {
//                 description: "Papel Higiênico",
//                 quantity: 8,
//                 price: 150,
//             },
//             {
//                 description: "Aromatizante 50ml",
//                 quantity: 3,
//                 price: 655,
//             },
//             {
//                 description: "Sabão em pó",
//                 quantity: 6,
//                 price: 335,
//             },
//             {
//                 description: "Sabão em pedra",
//                 quantity: 8,
//                 price: 45,
//             },
//             {
//                 description: "Água sanitária",
//                 quantity: 2,
//                 price: 450,
//             },
//         ]
//     },
// ]

// Itens por página
const itemsPerPage = 10;

// Período(mês/ano) selecionado para ser exibido na tela
let periodExpense = [];

// Formatação de valores e ordenação de arrays
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

    convertMonth(value){
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        return months.find((item, index) => index === (Number(value)-1));
    },

    reverseListOfMonth(){
        let newArray = [];
        dataExpenses.map(expense => {
            newArray.push(
                String(expense.year)+String(expense.month)
            )
        })
        
        newArray.sort((beforePosition, afterPosition) => {
            return afterPosition - beforePosition
        })

        const ordened = newArray.map(date => {
            return {
                year: Number(date.substr(0,4)),
                month: Number(date.slice(4))
            }
        })
        return ordened;
    },

    
}

// Funções para renderizar o conteúdo dos cards
const Resolve = {
//     //Retorna por extenso o mês e ano selecionado
    currentMonth(){
        return Utility.convertMonth(periodExpense.month)+' de '+periodExpense.year;
    },

//     // Exibe a quantidade de produtos do período selecionado 
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
        dataExpenses.map((item) => {            
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
        return `${Utility.convertMonth(arrayExpenses[arrayExpenses.length-1].month)} de ${arrayExpenses[arrayExpenses.length-1].year}`;
    },

    lowerExpenseMonth(){
        const arrayExpenses = Resolve.ordenedArray();
        return `${Utility.convertMonth(arrayExpenses[0].month)} de ${arrayExpenses[0].year}`;
    },
}

// Preenchimento dos cards
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

// CRUD de despesas
const orderToExpense = {
    validateData(data){
        const {month, year, description, quantity, price} = data;

        if(description.trim() === "" || !quantity || !price){
            throw new Error("Favor preencher todos os campos.")
        }

        if(!month || !year ){
            throw new Error("Selecione um item válido na aba de movimentações.")
        }
    },

    add(data){
        const {month, year, description, quantity, price} = data;
        orderToExpense.validateData(data);

        dataExpenses.map((item, index) => {
            if(month === item.month && year === item.year){
                dataExpenses[index].expenses.push({
                    description, 
                    quantity, 
                    price
                })

            }
        })
        
        App.loadData(month, year)
    }

}

// CRUD da lista de despesas
const listOfMonths = {

    dataExists(month, year){
        const exists = dataExpenses.find(item => (item.month === month && item.year === year));

        return exists;
    },

    add(month, year){
        const exists = listOfMonths.dataExists(month, year);

        if(exists){
            FormMonth.clearFieldset();
            throw new Error("O período selecionado já existe")
        }

        DOM.clearItemsMenuBar();
        dataExpenses.push({
            month,
            year,
            expenses: []
        })
        Storage.set(dataExpenses);
    }

}

// Manipulação de dados vindos do HTML
const DOM = {
    expensesContainer: document.querySelector('#body-expenses'),
    sideBarContainer: document.querySelector('#items-sidebar'),
    formExpense: document.getElementById('form-expense'),
    
    addItemsMenuBar(data){
        const a = document.createElement(`a`);
        a.innerHTML = `${Utility.convertMonth(data.month)+' de '+data.year}`;
        a.setAttribute('href', "#");
        a.setAttribute('onclick', `App.loadData(${data.month}, ${data.year})`);
        DOM.sideBarContainer.appendChild(a);
    },

    addExpense(expense, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLExpenses(expense, index);
        tr.dataset = index;
        DOM.expensesContainer.appendChild(tr);
    },

    innerHTMLExpenses(expense, index){
        const html = `
            <td>${expense.description}</td>
            <td>${Utility.formatQuantity(expense.quantity)}</td>
            <td>${Utility.formatCurrency(expense.price)}</td>
            <td>${Utility.formatCurrency((expense.price*expense.quantity))}</td>
            <td>                
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

    clearItemsMenuBar() {
        DOM.sideBarContainer.innerHTML = '';
    },
}

// Tratamento dos dados do formulário do modal de meses
const FormMonth = {
    month: document.querySelector('.fieldset #month'),

    clearFieldset(){
        FormMonth.month.value = ""
    },

    getValues(){
        const monthAndYear = FormMonth.month.value;
        const [year, month] = monthAndYear.split('-');

        return { month:Number(month), year:Number(year) }
    },

    submitMonth(event){        
        event.preventDefault();
        try {
            const {month, year} = FormMonth.getValues();
            listOfMonths.add(month, year);
            FormMonth.clearFieldset();
            Toggle.toggleModalMonth();
            
            App.loadData(month, year);
            App.loadItemMenuBar();
            Utility.reverseListOfMonth();
        } catch (error) {
            alert(error.message);
        }
    }
}

// Tratamento dos dados do formulário do modal de despesas
const FormExpense = {
    description: document.querySelector('.fieldset #description'),
    quantity: document.querySelector('.fieldset #quantity'),
    price: document.querySelector('.fieldset #price'),

    getValues(){
        const month = periodExpense.month;
        const year = periodExpense.year;
        const description = FormExpense.description.value;
        const quantity = FormExpense.quantity.value;
        const price = FormExpense.price.value;

        return {
            month: Number(month),
            year: Number(year),
            description,
            quantity: Number(quantity),
            price: Utility.formatCurrencyToSave(Number(price))            
        }
    },

    clearFieldset(){
        FormExpense.description.value = "";
        FormExpense.quantity.value = "";
        FormExpense.price.value = "";
    },
    
    //Listener
    submitExpense(event){
        event.preventDefault();

        try {
            orderToExpense.add(FormExpense.getValues());
            FormExpense.clearFieldset();
            Toggle.toggleModalExpense();
        } catch (error) {
            alert(error.message)
        }
    },

}

// Configuração de paginação
const Pagination = {
    paginationContainer: document.getElementById('pagination'),
    currentPage: document.querySelector('#currentPage h4'),

    clearPagination(){
        Pagination.paginationContainer.innerHTML = "";
        Pagination.currentPage.innerHTML = "";
    },

    listExpensesByPage(page){
        DOM.clearExpenses();
        Pagination.setCurrentPage(page);
        const firstItem = (page*itemsPerPage)-itemsPerPage; // 1 = 1*5 - 4 = 1
        const lastItem = (page*itemsPerPage); // 1 = 1*5 = 5  
        const data = periodExpense.expenses.slice(firstItem, lastItem);

        data.map((expense, index) => {
            DOM.addExpense(expense, index);
        })
    },

    addPagination(numberPages){
        for(let count = 0; count < numberPages; count++){
            Pagination.innerHTMLPagination(count+1);
        }
    },

    setCurrentPage(page){
        Pagination.currentPage.innerHTML = page;
    },
    
    innerHTMLPagination(page){
        const a = document.createElement('a');
        a.innerHTML = page;       
        a.setAttribute('onclick', `Pagination.listExpensesByPage(${page})`);
        Pagination.paginationContainer.appendChild(a);
    },
}

// Inicialização do App com as classes necessárias
const App = {
    init(){
        // App.loadItemMenuBar();
        // App.loadData(dataExpenses[0].month, dataExpenses[0].year);
    },

    loadItemMenuBar(){
        FormMonth.clearFieldset();
        Utility.reverseListOfMonth().map(element => {
            DOM.addItemsMenuBar(element);
        })
    },
    
    filteredData(month, year){
        dataExpenses.forEach(data => {
            if(data.month === month && data.year === year){
                periodExpense = data;
            }
        });
        
        if(!periodExpense){
            throw new Error("Ainda não existem lançamentos neste mês")
        }
    },
    
    pagination(){
        const pages = Math.ceil((periodExpense.expenses.length/itemsPerPage))
        Pagination.clearPagination();
        Pagination.addPagination(pages);
        Pagination.listExpensesByPage(1);
    },
    
    loadData(month, year){
        DOM.clearExpenses();
        App.filteredData(month, year);
        Toggle.toggleFormAndPagination(periodExpense.expenses.length);
        
        App.pagination();
        dataCard.getDataCurrentMonth(periodExpense);
        
    },
}

App.init();