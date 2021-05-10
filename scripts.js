// Alterna a sidebar o modalMoviment e o modalExpense entre visíveis e não visíveis
const Toggle = {
//Movimentation
    lateralMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('active');
    },

    modalMoviment(){
        document
            .querySelector('#container-modal-month')
            .classList
            .toggle('modal-active-month');
    },

// Expenses
    modalExpense(){
        document
            .querySelector('#container-modal-expense')
            .classList
            .toggle('modal-active-expense');
    },

    pagination(hasData){
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

let expenses = [];          // Array de movimentações
const itemsPerPage = 1;    // Quantidade de items por página
let period = [];     // Mês específico de despesas

// Moviment and Expense
// Dados no localStorage
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("@commerce:expenses")) || []
    },

    set(expenses){
        localStorage.setItem("@commerce:expenses", JSON.stringify(expenses));
    }
}

// Moviment and Expense
// Formatação de valores e ordenação de arrays
const Utility = {
    ordened(){
        let newArray = [];
        
        expenses.map(expense => {
            month = expense.month < 10 ? 
                ("00" + expense.month).slice(-2).replace(".",",") : 
                expense.month;
            newArray.push(
                String(expense.year)+String(month)
            )
        })
        
        newArray.sort((beforePosition, afterPosition) => {
            return afterPosition - beforePosition
        })
        
        
        const ordened = newArray.map(date => {
            return {
                year: Number(date.substr(0,4)),
                month: Number(date.slice(4)),
            }
        })

        return ordened;
    },

// Moviment
    clearListMoviment() {
        DOM.sideBarContainer.innerHTML = '';
    },

    movimentExists(month, year){

        if(!month || !year){
            throw new Error("Favor informar dados válidos");
        }
        return expenses.find(item => (item.month === month && item.year === year));
    },

    monthString(value){
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        return months.find((item, index) => index === (Number(value)-1));
    },

//Expenses
    clearTableExpenses() {
        DOM.expensesContainer.innerHTML = '';
    },

    formatExpenseToTable(expense){
        const data ={
            description: expense.description,
            quantity: expense.quantity < 10 ? 
                ("00" + expense.quantity).slice(-2).replace(".",",") : 
                expense.quantity,
            price: (expense.price/100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }),
            total: ((expense.price*expense.quantity)/100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        }
        return data;        
    },

    formatCurrencyToSave(currency){
        return Number(currency)*100;
    },
    
    // Cards
    formatQuantity(value){
        return value < 10 ? 
        ("00" + value).slice(-2).replace(".",",") : 
        value
    },

    currentMonth(){
        return Utility.monthString(period.month)+' de '+period.year;
    },

    numOfProducts(){
        return Utility.formatQuantity(period.expenses.length);
    },

    bigQuantityProduct(){
        let product = {
            quantityMaxima: 0,
            description: ''
        }
        period.expenses.map(item => {      
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
        period.expenses.map(item => {      
            item.price > product.highPrice &&
                (product.highPrice = item.price, 
                product.description = item.description)
        })
        return `${product.description} (${(product.highPrice/100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })})`;
    },

    totalOfMonth(){
        return period.expenses.reduce(
            (oldValue, actualValue) => 
            oldValue + (actualValue.price * actualValue.quantity)/100, 0
        ).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
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
        const arrayExpenses = Utility.ordenedArray();

        const data = arrayExpenses.findIndex(item => (period.month === item.month && period.year === item.year));
        return Utility.formatQuantity(data+1);
    },

    highExpenseMonth(){
        const arrayExpenses = Utility.ordenedArray();
        return `${Utility.monthString(arrayExpenses[arrayExpenses.length-1].month)} de ${arrayExpenses[arrayExpenses.length-1].year}`;
    },

    lowerExpenseMonth(){
        const arrayExpenses = Utility.ordenedArray();
        return `${Utility.monthString(arrayExpenses[0].month)} de ${arrayExpenses[0].year}`;
    },
}

// Moviment
// Tratamento dos dados do formulário do modal de meses
const modalMoviment = {
    moviment: document.querySelector('.fieldset #month'),

    clearModalItems(){
        modalMoviment.moviment.value = ""
    },

    getValues(){
        const monthAndYear = modalMoviment.moviment.value;
        const [year, month] = monthAndYear.split('-');

        return { month:Number(month), year:Number(year) }
    },

    reload(expense){
        Utility.clearListMoviment();    //Limpa a lista de movimentações
        DOM.hiddenContainer(expense);   //Exibe o container com cads e botão de adição
        movimentCRUD.loadMoviment();    //Carrega a lista de movimentações
    },

    submitMoviment(event){ 
        event.preventDefault();
        try {
            const expense = modalMoviment.getValues(); //Recebe os valores dos modais
            movimentCRUD.add(expense.month, expense.year);  //Adiciona movimentação ao array
            Toggle.modalMoviment();         //Esconde o modal de movimentações
            Utility.clearTableExpenses();   //Limpa a tabela de despesas
            Utility.clearListMoviment();    //Limpa a lista de movimentações
            modalMoviment.clearModalItems();//Limpra o modal de movimentações
            DOM.hiddenContainer(expense);   //Exibe o container com cads e botão de adição
            movimentCRUD.loadMoviment();    //Carrega a lista de movimentações
            expenseCRUD.loadExpenses(expense.month, expense.year);//Carrega a tabela de despesas
        } catch (error) {
            modalMoviment.clearModalItems();
            alert(error.message);
        }
    }
}

//Expense
const modalExpense = {
    description: document.querySelector('.fieldset #description'),
    quantity: document.querySelector('.fieldset #quantity'),
    price: document.querySelector('.fieldset #price'),

    clearModalItems(){
        modalExpense.description.value = "";
        modalExpense.quantity.value = "";
        modalExpense.price.value = "";
    },
    
    getValues(){
        const month = period.month;
        const year = period.year;
        const description = modalExpense.description.value;
        const quantity = modalExpense.quantity.value;
        const price = modalExpense.price.value;

        return {
            month: Number(month),
            year: Number(year),
            description,
            quantity: Number(quantity),
            price: Utility.formatCurrencyToSave(Number(price))            
        }
    },

    // reload(expense){
    //     Utility.clearTableExpenses();               //Limpa a tabela de despesas
    //     console.log(expense);             //Exibe a tabela de despesas
    //     expenseCRUD.loadExpenses(expense.month, expense.year);//Carrega a tabela de despesas
    // },

    submitExpense(event){
        event.preventDefault();
        try {
            const expense = modalExpense.getValues();   //Recebe os valores dos modais
            expenseCRUD.add(expense);                   //Adiciona despesas ao array                
            Toggle.modalExpense();                      //Esconde o modal de despesas
            modalExpense.clearModalItems();             //Limpa o modal de despesas
            Utility.clearTableExpenses();               //Limpa a tabela de despesas
            DOM.hiddenTable(expense);                   //Exibe a tabela de despesas
            expenseCRUD.loadExpenses(expense.month, expense.year);//Carrega a tabela de despesas
            DOM.dataCard();                             //Carrega dados para o card
        } catch (error) {
            modalExpense.clearModalItems();
            alert(error.message)
        }
    },

}

// Moviment
// CRUD da lista de despesas
const movimentCRUD = {

    loadMoviment(){
        Utility.ordened().map(element => {
            DOM.listMoviment(element);
        })
    },


    add(month, year){
        const exists = Utility.movimentExists(month, year);
        if(exists){
            throw new Error("O período selecionado já existe")
        }
        period = {
            month,
            year,
            expenses: []
        }
        expenses.push(period)
        Storage.set(expenses);
    }

}

const expenseCRUD = {
    add(data){
        const {month, year, description, quantity, price} = data;
        
        if(description.trim() === "" || !quantity || !price){
            throw new Error("Favor preencher todos os campos.")
        }

        if(!month || !year ){
            throw new Error("Selecione um item válido na aba de movimentações.")
        }

        expenses.map((item, index) => {
            if(month === item.month && year === item.year){
                expenses[index].expenses.push({
                    description, 
                    quantity, 
                    price
                })
            }
        })

        Storage.set(expenses)
    },

    loadExpenses(month, year){
        expenses.forEach(data => {
            if(data.month === month && data.year === year){
                period = data;
            }
        });

        if(!period){
            throw new Error("Ainda não existem lançamentos neste mês")
        }
        
        DOM.hiddenTable(period.expenses);
        Utility.clearTableExpenses();
        DOM.dataCard();
        period.expenses.map((item, index) => DOM.addExpenseToTable(item, index));
    }
}

// Moviment and Expense

const DOM = {
    // Moviment
    sideBarContainer: document.querySelector('#items-sidebar'),
    
    listMoviment(data){
        const a = document.createElement(`a`);
        a.innerHTML = `${Utility.monthString(data.month)+' de '+data.year}`;
        a.setAttribute('href', "#");
        a.setAttribute('onclick', `expenseCRUD.loadExpenses(${data.month}, ${data.year})`);
        DOM.sideBarContainer.appendChild(a);
    },
    
    // Expense
    expensesContainer: document.querySelector('#body-expenses'),
    formExpense: document.getElementById('form-expense'),
    
    hiddenContainer(data){
        if(data.length === 0){
            document
                .querySelector('#sections-buy')
                .classList
                .add('inactive')
            }else{
            document
                .querySelector('#sections-buy')
                .classList
                .remove('inactive')
            }
    },

    hiddenTable(data){
        if(data.length === 0){
            document
                .querySelector('#table-pagination')
                .classList
                .add('inactive')
            }else{
            document
                .querySelector('#table-pagination')
                .classList
                .remove('inactive')
            }
    },

    addExpenseToTable(expense, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLExpenses(expense, index);
        tr.dataset = index;
        DOM.expensesContainer.appendChild(tr);
    },

    innerHTMLExpenses(expense, index){
        const {description, quantity, price, total} = Utility.formatExpenseToTable(expense)
        const html = `
            <td>${description}</td>
            <td>${quantity}</td>
            <td>${price}</td>
            <td>${total}</td>
            <td>                
                <a href="#">
                    <img src="./assets/remove.svg" alt="remover item">
                </a>
            </td>
        `
        return html
    },

    // Cards
    currentMonth: document.getElementById('current-month'),
    numOfProducts: document.getElementById('num-of-products'),
    bigQuantityProduct: document.getElementById('big-quantity-product'),
    highPrice: document.getElementById('high-price'),
    totalOfMonth: document.getElementById('total-of-month'),
    
    // Statistics
    rankingPosition: document.getElementById('ranking-position'),
    highExpenseMonth: document.getElementById('high-expense-month'),
    lowerExpenseMonth: document.getElementById('lower-expense-month'),    

    dataCard(){
        // Month Card
        DOM.currentMonth.innerHTML = Utility.currentMonth();
        DOM.numOfProducts.innerHTML = Utility.numOfProducts();
        DOM.bigQuantityProduct.innerHTML = Utility.bigQuantityProduct();
        DOM.highPrice.innerHTML = Utility.highPrice();
        DOM.totalOfMonth.innerHTML = Utility.totalOfMonth();      
        
        //Statistics
        DOM.rankingPosition.innerHTML = Utility.rankingPosition();
        DOM.highExpenseMonth.innerHTML = Utility.highExpenseMonth();
        DOM.lowerExpenseMonth.innerHTML = Utility.lowerExpenseMonth();
    },

// Paginação
    paginationContainer: document.getElementById('pagination'),
    currentPage: document.querySelector('#currentPage h4'),

    clearPagination(){
        DOM.paginationContainer.innerHTML = "";
        DOM.currentPage.innerHTML = "";
    },

    listPages(page){
        DOM.setCurrentPage(page);
        const firstItem = (page*itemsPerPage)-itemsPerPage; // 1 = 1*5 - 4 = 1
        const lastItem = (page*itemsPerPage); // 1 = 1*5 = 5  
        const data = period.expenses.slice(firstItem, lastItem);

        data.map((expense, index) => {
            console.log(expense)
            expenseCRUD.loadExpenses(expense, index);
        })
    },

    addPagination(numberPages){
        for(let count = 0; count < numberPages; count++){
            DOM.innerHTMLPagination(count+1);
        }
    },

    setCurrentPage(page){
        DOM.currentPage.innerHTML = page;
    },
    
    innerHTMLPagination(page){
        const a = document.createElement('a');
        a.innerHTML = page;       
        a.setAttribute('onclick', `DOM.listPages(${page})`);
        DOM.paginationContainer.appendChild(a);
    },
}

// Inicialização do App com as classes necessárias
const App = {
    init(){
        expenses = Storage.get();
        period = Utility.ordened()[0];
        if(expenses.length > 0){
            modalMoviment.reload(expenses);
            expenseCRUD.loadExpenses(period.month, period.year);
            DOM.dataCard();
            // console.log(period)
            // Toggle.pagination(period.expenses.length);
            // const pages = Math.ceil(period.expenses.length/itemsPerPage)
            // DOM.clearPagination();
            // DOM.addPagination(pages);
            DOM.listPages(1);
        }
    },
}

App.init();