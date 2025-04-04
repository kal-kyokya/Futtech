import './newVideo.scss';
import { useState, useContext } from 'react';
import { VideoContext } from '../../contexts/videoContext/VideoContext';
import { UserContext } from '../../contexts/userContext/UserContext';
import storage from '../../firebase';
import Navbar from '../../components/Navbar';
import {
    getDownloadURL,
    ref as storageRef,
    uploadBytesResumable } from 'firebase/storage';
import {
    createVideoStart,
    createVideoSuccess,
    createVideoFailure } from '../../contexts/videoContext/VideoActions';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewVideo = () => {
    const { dispatch } = useContext(VideoContext);
    const { user } = useContext(UserContext);

    const [video, setVideo] = useState({ 'owner': user._id });
    const [content, setContent] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailSmall, setThumbnailSmall] = useState(null);
    const [uploaded, setUploaded] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState(null);

    const handleChange = (e) => {
	setVideo((prevVideo) => {
	    return { ...prevVideo, [e.target.name]: e.target.value };
	});
    };

    const firebaseUpload = (inputs) => {
	inputs.forEach((input) => {
	    setIsUploading(true);

	    const date = new Date().toJSON().split('.');
	    const filename =  `${date}_${input.name}_${input.file.name}`;

	    const fileRef = storageRef(storage, `futtech-files/videos/${filename}`);
	    const uploadTask = uploadBytesResumable(fileRef, input.file);

	    uploadTask.on(
		'state_changed',
		(snapshot) => {
		    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    setUploadProgress(progress.toFixed(0));
		},
		(err) => {
		    console.error(error);
		    setIsUploading(false);
		},
		() => {
		    getDownloadURL(uploadTask.snapshot.ref)
			.then((firebaseUrl) => {
			    setVideo((prev) => {
				return { ...prev, [input.name]: firebaseUrl }
			    });

			    setUploaded((prevCount) => prevCount + 1);
			    setIsUploading(false);
			});
		}
	    );

	});
    };

    const handleUpload = (e) => {
	e.preventDefault();

	if (thumbnail && thumbnailSmall && trailer && content) {
	    firebaseUpload([
		{ file: thumbnail, name: 'thumbnail' },
		{ file: thumbnailSmall, name: 'thumbnailSmall' },
		{ file: trailer, name: 'trailer' },
		{ file: content, name: 'content' },
	    ]);
	}
    };

    const handleSubmit = async (e) => {
	e.preventDefault();
	dispatch(createVideoStart());

	try {
	    const res = await axios.post('/videos/', video,
					 {
					     headers: {
						 'auth-token': user.accessToken,
					     }
					 });
	    dispatch(createVideoSuccess(res.data));
	    navigate('/watch', { state: { video: res.data } });
	} catch (err) {
	    err.response.data.error.keyValue && setPrompt(err.response.data.error.keyValue);

	    console.error(err);
	    dispatch(createVideoFailure());
	}
    };

    return (
	<>
	    <Navbar />
	    <div className='newVideo'>
		<h1 className='newVideoTitle'>New Video</h1>

		<form className='newVideoForm'>
		    <div className='newVideoTop'>
			<div className='newVideoItem'>
			    <label>Title</label>
			    <input type='text'
				   placeholder={ 'video.title' }
				   className='newVideoInput'
				   name='title'
				   onChange={handleChange}
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Location</label>
			    <input type='text'
				   placeholder={ 'video.location' }
				   className='newVideoInput'
				   name='location'
				   onChange={handleChange}
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Date</label>
			    <input type='date'
				   className='newVideoInput'
				   name='date'
				   onChange={handleChange}
				   
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Category</label>
			    <select className='newVideoSelect'
				    name='category'
				    onChange={handleChange}
				    id='category'
			    >
				<option>Select</option>
				<option value='Game'>Game</option>
				<option value='Training'>Training</option>
			    </select>
			</div>
			<div className='newVideoItem'>
			    <label>Drone Footage?</label>
			    <select className='newVideoSelect'
				    name='isDrone'
				    onChange={handleChange}
				    id='isDrone'
			    >
				<option>Select</option>
				<option value='Yes'>Yes</option>
				<option value='No'>No</option>
			    </select>
			</div>
			<div className='newVideoItem'>
			    <label>AI Analysis?</label>
			    <select className='newVideoSelect'
				    name='isAiAnalysis'
				    onChange={handleChange}
				    id='isAiAnalysis'
			    >
				<option>Select</option>
				<option value='Yes'>Yes</option>
				<option value='No'>No</option>
			    </select>
			</div>

			<div className='newVideoItem'>
			    <label>Video</label>
			    <input type='file'
				   id='content'
				   name='content'
				   onChange={(e) => setContent(e.target.files[0])}
				   className='newVideoInput'
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Trailer</label>
			    <input type='file'
				   id='trailer'
				   name='trailer'
				   onChange={(e) => setTrailer(e.target.files[0])}
				   className='newVideoInput'
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Main Thumbnail</label>
			    <input type='file'
				   id='thumbnail'
				   name='thumbnail'
				   onChange={(e) => setThumbnail(e.target.files[0])}
				   className='newVideoInput'
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Smaller Thumbnail</label>
			    <input type='file'
				   id='thumbnailSmall'
				   name='thumbnailSmall'
				   onChange={(e) => setThumbnailSmall(e.target.files[0])}
				   className='newVideoInput'
			    />
			</div>
			<div className='newVideoItem'>
			    <label>Description</label>
			    <textarea type='text'
				   placeholder={ 'video.description' }
				   className='newVideoInputDesc'
				   name='desc'
				   onChange={handleChange}
			    />
			</div>
		    </div>

		    <div className='newVideoBottom'>
			{isUploading && (
			    <div className='userPrompt'>
				<div>
				    Processing files: {uploadProgress}%
				</div>
			    </div>
			)}

			{ uploaded === 2 && (
			    <div className='userPrompt'>
				<div>
				    Uploading: {uploadProgress}%
				</div>
				<progress value={uploadProgress}
					  max='100'
				>
				</progress>
			    </div>
			)}

			{ prompt && (
			    <div className='userPrompt'>
				    "{ prompt.title }" already taken.
			    </div>
			)}

			{uploaded !== 4 ? (
				<button className='uploadButton'
					onClick={handleUpload}
				>
				    Upload files
				</button>
			) : (
			    <div>
				<button className='newVideoButton'
					onClick={handleSubmit}
				>
				    Create video
				</button>
			    </div>
			)}
		    </div>
		</form>

	    </div>
	</>
    );
};

export default NewVideo;
