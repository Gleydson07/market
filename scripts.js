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

    reload(expense){
        Utility.clearTableExpenses();               //Limpa a tabela de despesas
        console.log(expense);             //Exibe a tabela de despesas
        expenseCRUD.loadExpenses(expense.month, expense.year);//Carrega a tabela de despesas
    },

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
}

// Inicialização do App com as classes necessárias
const App = {
    init(){
        expenses = Storage.get();
        period = Utility.ordened()[0];
        if(expenses.length > 0){
            modalMoviment.reload(expenses);
            expenseCRUD.loadExpenses(period.month, period.year)
        }
    },
}

App.init();