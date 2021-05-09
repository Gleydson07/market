// // Alterna a sidebar o modalMoviment e o modalExpense entre visíveis e não visíveis
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

}

let expenses = [];          // Array de movimentações
const itemsPerPage = 10;    // Quantidade de items por página
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

    formatCurrencyToSave(currency){
        return Number(currency)*100;
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

    submitMoviment(event){        
        event.preventDefault();
        try {
            const {month, year} = modalMoviment.getValues();
            MovimentCRUD.add(month, year);
            modalMoviment.clearModalItems();
            Toggle.modalMoviment();            
        } catch (error) {
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

    submitExpense(event){
        event.preventDefault();
        try {
            expenseCRUD.add(modalExpense.getValues());
            modalExpense.clearModalItems();
            Toggle.modalExpense();
        } catch (error) {
            alert(error.message)
        }
    },

}

// Moviment and Expense
// Manipulação de dados vindos do HTML
const DOM = {
// Moviment
    sideBarContainer: document.querySelector('#items-sidebar'),
    
    listMoviment(data){
        const a = document.createElement(`a`);
        a.innerHTML = `${Utility.monthString(data.month)+' de '+data.year}`;
        a.setAttribute('href', "#");
        a.setAttribute('onclick', `expenseCRUD.findExpense(${data.month}, ${data.year})`);
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
        if(data.expenses.length === 0){
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
}

// Moviment
// CRUD da lista de despesas
const MovimentCRUD = {

    loadMonths(){
        let newArray = [];

        expenses.map(expense => {
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
        
        ordened.map(element => {
            DOM.listMoviment(element);
        })
    },


    add(month, year){
        const exists = Utility.movimentExists(month, year);
        if(exists){
            modalMoviment.clearModalItems();
            throw new Error("O período selecionado já existe")
        }

        expenses.push({
            month,
            year,
            expenses: []
        })

        Utility.clearListMoviment();
        Storage.set(expenses);
        App.reload();
    }

}

const expenseCRUD = {

    findExpense(month, year){
        expenses.forEach(data => {
            if(data.month === month && data.year === year){
                period = data;
            }
        });

        if(!period){
            throw new Error("Ainda não existem lançamentos neste mês")
        }
    },

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
        App.reload()
    },

    loadExpenses(data){
        data.expenses.map(item => DOM.addExpenseToTable(item));
    }

}

// Inicialização do App com as classes necessárias
const App = {
    init(){
        expenses = Storage.get();
        DOM.hiddenContainer(expenses);
        if(expenses.length > 0){
            expenseCRUD.findExpense(expenses[0].month, expenses[0].year);
            MovimentCRUD.loadMonths();
        }
    },
    
    reload(){
        expenses = Storage.get();
        DOM.hiddenContainer(expenses);
        if(expenses){
            Utility.clearListMoviment();
            Toggle.modalMoviment()
            MovimentCRUD.loadMonths();
            expenseCRUD.loadExpenses(period);
        }
    }
}

App.init();