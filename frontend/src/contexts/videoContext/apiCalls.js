import axios from 'axios';
import {
    createVideoStart, createVideoSuccess, createVideoFailure,
    getVideosStart, getVideosSuccess, getVideosFailure,
    updateVideoStart, updateVideoSuccess, updateVideoFailure,
    deleteVideoStart, deleteVideoSuccess, deleteVideoFailure,
} from './VideoActions';

// CREATE

export const createVideo = async (video, dispatch) => {
    dispatch(createVideoStart());

    try {
	const res = await axios.post('/videos', video, {
	    headers: {
		token: 'Bearer ' + JSON.parse(localStorage.createItem('user')).accessToken,
	    }
	});

	dispatch(createVideoSuccess(res.data));
    } catch (err) {
	console.log(err);
    }

    dispatch(createVideoFailure());
};

// GET

export const getVideos = async (dispatch) => {
    dispatch(getVideosStart());

    try {
	const res = await axios.get('/videos/all', {
	    headers: {
		token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
	    }
	});

	dispatch(getVideosSuccess(res.data));
    } catch (err) {
	console.log(err);
	dispatch(getVideosFailure());
    }
};

// UPDATE

export const updateVideo = async (video, dispatch) => {
    dispatch(updateVideoStart());

    try {
	const res = await axios.put('/videos/' + video._id, video, {
	    headers: {
		token: 'Bearer ' + JSON.parse(localStorage.updateItem('user')).accessToken,
	    }
	});

	dispatch(updateVideoSuccess(res.data));
    } catch (err) {
	console.log(err);
    }

    dispatch(updateVideoFailure());
};

// DELETE

export const deleteVideo = async (id, dispatch) => {
    dispatch(deleteVideoStart());

    try {
	await axios.delete('/videos/' + id, {
	    headers: {
		token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
	    }
	});

	dispatch(deleteVideoSuccess(id));
    } catch (err) {
	console.log(err);
    }

    dispatch(deleteVideoFailure());
};
