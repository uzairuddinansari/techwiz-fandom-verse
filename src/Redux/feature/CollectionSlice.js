import { createSlice } from "@reduxjs/toolkit";

export const CollectionSlice = createSlice({
  name: "Collection",

  initialState: {
    collectionData: [],
  },

  reducers: {
    addCollectionData(state, action) {
      const alreadyExist = state.collectionData.find(
        item => item.id == action.payload.id
      )
      if(!alreadyExist){
        state.collectionData.push(action.payload)
      }
    },

    DeletCard(state, action) {
      state.collectionData = state.collectionData.filter(
        (item) => item.id !== action.payload
      );
    },
    Clear(state) {
      state.collectionData = []
      localStorage.removeItem('savedImages');
    }
  },
});

export const { addCollectionData, DeletCard , Clear} =
  CollectionSlice.actions;

export default CollectionSlice.reducer;
