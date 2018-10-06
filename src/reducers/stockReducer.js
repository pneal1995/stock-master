function stockReducer(state, action) {
    if (state === undefined) {
        
      return { 
            stocks: [],
            portfolio: []
      };
    }


switch(action.type){
    case "apiData" :
    return{
        ...state,
        stocks: action.stocks
        }  
    case "addToPortfolio" :
    return{
        ...state,
        portfolio: state.portfolio.concat(action.portfolio)
    }
    default:
            return (state)
        }
}
    
export default stockReducer;