import {createSlice} from "@reduxjs/toolkit"

export const SearcSlice = createSlice({
    name:"search",

    initialState:{
        query:"",
        activetab:"photos",
        results:[],
        loading:false,
        error:null
    },
    reducers:{
        // is State ke undar Pora initialState kaa object he 
        setQuery(state, action){
            state.query = action.payload
        },
        setActivetab(state,action){
            state.activetab = action.payload
        },
        setResults(state,action){
            state.loading = false
            state.results = action.payload
        },
        setLoading(state){
            state.loading = true
            state.error = null
        },
        seterror(state,action){
            state.error = action.payload
            state.loading = false
        },
        clearRresult(state){
            state.results = []
        },
    }
})

export const {setQuery,setActivetab,setResults,setLoading,seterror,clearRresult} = SearcSlice.actions
export default SearcSlice.reducer


