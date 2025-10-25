import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  propertyId: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setPropertyId: (state, action) => {
      state.propertyId = action.payload;
    },
  },
});

export const { setPropertyId } = bookingSlice.actions;

export default bookingSlice.reducer;
