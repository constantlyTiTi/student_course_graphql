import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllStudentsAPI} from './api'

export const listAllStudentsRedux = createAsyncThunk(
	'listallStudent',
	async (data, thunkAPI) => {
		const response = await getAllStudentsAPI()

		if (response.status !== 200) {
			return thunkAPI.rejectWithValue(response);
		}
		return response.data
	}
)

const initialState = {
	students:[]
}

const studentSlice = createSlice({
	name: "student",
	initialState,
	reducers: {
		setStudentsInfo: (state, action) => {
			state.students = action.payload
		}
	},
	extraReducers: (builder) => (
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(listAllStudentsRedux.fulfilled, (state, action) => {
			console.log(action.payload)
			state.students = action.payload
			state.loading = false
			state.errors = initialState.errors
		}),
		builder.addCase(listAllStudentsRedux.pending, (state) => {
			state.loading = true
		}),
		builder.addCase(listAllStudentsRedux.rejected, (state, action) => {
			// Add user to the state array
			state.errors = action.payload
			state.loading = false
		})
	)
})


export const { setStudentsInfo } = studentSlice.actions
export const studentReducer = studentSlice.reducer