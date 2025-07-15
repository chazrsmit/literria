import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
};

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setDeliveryDetails: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setDeliveryDetails } = deliverySlice.actions;
export default deliverySlice.reducer;