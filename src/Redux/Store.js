import {configureStore} from "@reduxjs/toolkit"
import searchReducer from "./feature/SearchSlide"
import CollectionReducer from "./feature/CollectionSlice"
import ReviewReducer from "./feature/ReviewSlice"
export const store = configureStore({
    reducer:{
        search:searchReducer,
        collection:CollectionReducer,
        review:ReviewReducer,
    }
})