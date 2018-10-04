function stockReducer(state, action) {
    if (state === undefined) {
        
      return { 
            stocks: []
      };
    }


switch(action.type){
    case "apiData" :
    return{
        ...state,
        stocks: action.stocks
        }  
   
    default:
            return (state)
        }
}
    
export default stockReducer;