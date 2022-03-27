import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginAPI, signUpAPI} from './api'

export const login = createAsyncThunk(
    'login',
    async (userState, thunkAPI) => {
        const response = await loginAPI(userState)

		console.log(response.data)

        if (response.status !== 200) {
            return thunkAPI.rejectWithValue(response);
        }

		console.log(response.data)

        return response.data
    }

)

export const register = createAsyncThunk(
    'register',
    async (userState, thunkAPI) => {
        const response = await signUpAPI(userState)


        if (response.status>= 299) {
            return thunkAPI.rejectWithValue(response);
        }

        return response.data
    }

)

const initialState =  {
    user: {},
    token: "",
    loading: false,
    errors: []
}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserInfo: (state, action) => {
			state.user = action.payload
		}
	},
	extraReducers: (builder) => (
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(register.fulfilled, (state, action) => {
			// Add user to the state array
			state.user = action.payload.student
			state.token = action.payload.token
			state.loading = false
			state.errors = initialState.errors
		}),
		builder.addCase(register.rejected, (state, action) => {
			// Add user to the state array
			state.errors = action.payload.errors
			state.loading = false
		}),
		builder.addCase(register.pending, (state) => {
			// Add user to the state array
			state.loading = true
		}),
		builder.addCase(login.fulfilled, (state, action) => {
			console.log(action.payload)
			state.user = action.payload.student
			state.token = action.payload.token
			state.loading = false
			state.errors = initialState.errors
		}),
		builder.addCase(login.pending, (state) => {
			state.loading = true
		}),
		builder.addCase(login.rejected, (state, action) => {
			// Add user to the state array
			state.errors = action.payload.data.errors
			state.loading = false
		})
	)
})


export const { setUserInfo } = userSlice.actions
export const userReducer = userSlice.reducer