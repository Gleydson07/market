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
        DOM.getDataCurrentMonth(periodExpense);
        
    },
}