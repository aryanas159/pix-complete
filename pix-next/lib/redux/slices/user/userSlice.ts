import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface Userstate {
	followers: Array<User>;
	following: Array<User>;
}

const initialState: Userstate = {
	followers: [],
	following: [],
};
export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		
		setFollowers: (
			state,
			action: PayloadAction<{ followers: Array<User> }>
		) => {
			const { followers } = action.payload;
            state.followers = followers;
		},
		setFollowing: (
			state,
			action: PayloadAction<{ following: Array<User> }>
		) => {
			const { following } = action.payload;
            state.following = following;
		},
	},
});

export const {  setFollowers, setFollowing } = userSlice.actions;
export default userSlice.reducer;
