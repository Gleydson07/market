// Inicialização do App com as classes necessárias
const App = {
   
    loadData(month, year){
        DOM.clearExpenses();
        App.filteredData(month, year);
        
        
        App.pagination();
        DOM.getDataCurrentMonth(periodExpense);
        
    },
}