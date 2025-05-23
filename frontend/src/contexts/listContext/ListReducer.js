/**
 * A reducer function linking stages of list retrieval
 * to all the states (data) internally managed by React.
 *
 * Something of a router for potential stages reached.
 */

const ListReducer = (state, action) => {
    switch (action.type) {
      case 'CREATE_LIST_START':
	return {
	    ...state,
	    isFetching: true,
	    error: false,
	};

      case 'CREATE_LIST_SUCCESS':
	return {
	    lists: [ ...state.lists, action.payload ],
	    isFetching: false,
	    error: false,
	};

      case 'CREATE_LIST_FAILURE':
	return {
	    ...state,
	    isFetching: false,
	    error: true,
	};

      case 'GET_LISTS_START':
	return {
	    lists: [],
	    isFetching: true,
	    error: false,
	};

      case 'GET_LISTS_SUCCESS':
	return {
	    lists: action.payload,
	    isFetching: false,
	    error: false,
	};

      case 'GET_LISTS_FAILURE':
	return {
	    lists: [],
	    isFetching: false,
	    error: true,
	};

      case 'UPDATE_LIST_START':
	return {
	    ...state,
	    isFetching: true,
	    error: false,
	};

      case 'UPDATE_LIST_SUCCESS':
	return {
	    lists: state.lists.map(
		(list) => list._id === action.payload._id ? action.payload : list
	    ),
	    isFetching: false,
	    error: false,
	};

      case 'UPDATE_LIST_FAILURE':
	return {
	    ...state,
	    isFetching: false,
	    error: true,
	};

      case 'DELETE_LIST_START':
	return {
	    ...state,
	    isFetching: true,
	    error: false,
	};

      case 'DELETE_LIST_SUCCESS':
	return {
	    lists: state.lists.filter((list) => list._id !== action.payload._id),
	    isFetching: false,
	    error: false,
	};

      case 'DELETE_LIST_FAILURE':
	return {
	    ...state,
	    isFetching: false,
	    error: true,
	};

      default:
	return { ...state };
    }
};

export default ListReducer;
