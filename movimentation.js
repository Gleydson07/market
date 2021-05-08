// // Alterna a sidebar o modalMonthMOV e o modalExpense entre visíveis e não visíveis
const ToggleMOV = {
    lateralMenu(){
        document
            .getElementById('sidebar')
            .classList
            .toggle('active');
    },

    modalNewMoviment(){
        document
            .querySelector('#container-modal-month')
            .classList
            .toggle('modal-active-month');
    },
}

// Formatação de valores e ordenação de arrays
const UtilityMOV = {
    clearListMoviment() {
        DOMMOV.sideBarContainer.innerHTML = '';
    },

    movimentExists(month, year){
        const exists = expenses.find(item => (item.month === month && item.year === year));

        return exists;
    },

    monthString(value){
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        return months.find((item, index) => index === (Number(value)-1));
    },
  
}

let expenses = [];

// Dados no localStorage
const StorageMOV = {
    get(){
        return JSON.parse(localStorage.getItem("@commerce:expenses")) || []
    },

    set(expenses){
        localStorage.setItem("@commerce:expenses", JSON.stringify(expenses));
    }
}

// CRUD da lista de despesas
const monthCRUDMOV = {

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
            DOMMOV.addItemsMenuBar(element);
        })
    },


    add(month, year){
        const exists = UtilityMOV.movimentExists(month, year);

        if(exists){
            modalMonthMOV.clearFieldset();
            throw new Error("O período selecionado já existe")
        }

        UtilityMOV.clearListMoviment();
        expenses.push({
            month,
            year,
            expenses: []
        })
        StorageMOV.set(expenses);
        AppMOV.reload();
    }

}

// Manipulação de dados vindos do HTML
const DOMMOV = {
    sideBarContainer: document.querySelector('#items-sidebar'),
    
    addItemsMenuBar(data){
        const a = document.createElement(`a`);
        a.innerHTML = `${UtilityMOV.monthString(data.month)+' de '+data.year}`;
        a.setAttribute('href', "#");
        a.setAttribute('onclick', `App.loadData(${data.month}, ${data.year})`);
        DOMMOV.sideBarContainer.appendChild(a);
    },

}

// Tratamento dos dados do formulário do modal de meses
const modalMonthMOV = {
    month: document.querySelector('.fieldset #month'),

    clearFieldset(){
        modalMonthMOV.month.value = ""
    },


    getValues(){
        const monthAndYear = modalMonthMOV.month.value;
        const [year, month] = monthAndYear.split('-');

        return { month:Number(month), year:Number(year) }
    },


    submitMonth(event){        
        event.preventDefault();
        try {
            const {month, year} = modalMonthMOV.getValues();
            monthCRUDMOV.add(month, year);
            modalMonthMOV.clearFieldset();
            ToggleMOV.modalNewMoviment();            
        } catch (error) {
            alert(error.message);
        }
    }
}

// Inicialização do App com as classes necessárias
const AppMOV = {
    init(){
        expenses = StorageMOV.get();
        if(!expenses){
            return
        }
        monthCRUDMOV.loadMonths();
    },

    reload(){
        expenses = StorageMOV.get();
        if(expenses){
            monthCRUDMOV.loadMonths();
        }
    }
}

AppMOV.init();