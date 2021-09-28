import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { createPost, updatePost } from '../redux/actions/postAction';
import Icons from './Icons';
import { imageShow, videoShow } from '../utils/mediaShow';

const StatusModal = () => {
  const dispatch = useDispatch();
  const { status, auth, theme, socket } = useSelector((state) => state);

  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  //streaming
  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState('');

  const handleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = '';
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = 'File does not exist.');
      // if (file.type !=== 'image/jpeg' && file.type !=== 'image/png')
      //   return (err = 'Image format must be JPEG pr PNG.');
      if (file.size > 1024 * 1024 * 5) return (err = 'The largest media size is 5mb.');

      return newImages.push(file);
    });
    if (err.length > 0) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }

    return setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newImagesArr = [...images];
    const imageToBeRemoved = newImagesArr[index];
    setImages(newImagesArr.filter((each) => each !== imageToBeRemoved));
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();

          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    //To skip the border and scrollbar
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute('width', width);
    refCanvas.current.setAttribute('height', height);

    const ctx = refCanvas.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Please add at least 1 photo.' },
      });

    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }

    if (tracks) tracks.stop();
    setContent('');
    setImages([]);
    dispatch({ type: GLOBALTYPES.STATUS, payload: false });
  };

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);

  return (
    <div className="status_modal">
      <form onSubmit={handleSubmit}>
        <div className="status_header">
          <h5 className="m-0"> {status.onEdit ? 'Edit your post' : 'Create new post'}</h5>
          <span
            onClick={() => {
              if (tracks) tracks.stop();
              dispatch({ type: GLOBALTYPES.STATUS, payload: false });
            }}
          >
            &times;
          </span>
        </div>
        <div className="status_body">
          <textarea
            style={{
              filter: theme ? 'invert(1)' : 'invert(0)',
              background: theme ? 'rgba(0,0,0,.03)' : '',
              color: theme ? 'white' : '#111',
            }}
            name="content"
            value={content}
            placeholder={`${auth.user.userName}, what's on your mind?`}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="d-flex">
            <div className="flex-fill"></div>
            <Icons setContent={setContent} content={content} theme={theme} />
          </div>
          <div className="show_images">
            {images &&
              images.map((img, index) => {
                return (
                  <div key={index} id="file_img">
                    {img.camera ? (
                      imageShow(img.camera, theme)
                    ) : img.url ? (
                      <>
                        {img.url.match(/video/i)
                          ? videoShow(img.url, theme)
                          : imageShow(img.url, theme)}
                      </>
                    ) : (
                      <>
                        {img.type.match(/video/i)
                          ? videoShow(URL.createObjectURL(img), theme)
                          : imageShow(URL.createObjectURL(img), theme)}
                      </>
                    )}
                    <span onClick={() => deleteImage(index)}>&times;</span>
                  </div>
                );
              })}
          </div>
          {stream && (
            <div className="stream position-relative" style={{ transform: 'scaleX(-1)' }}>
              <video
                muted
                autoPlay
                ref={videoRef}
                className="videoCanvas"
                width="100%"
                height="100%"
              />
              <span style={{ cursor: 'pointer' }} onClick={handleStopStream}>
                &times;
              </span>
              <canvas ref={refCanvas} style={{ display: 'none' }} />
            </div>
          )}
          <div className="input_images">
            {stream ? (
              <i className="fa fa-camera" onClick={handleCapture} />
            ) : (
              <>
                <i className="fa fa-camera" onClick={handleStream} />
                <div className="file_upload">
                  <i className="fa fa-image" />
                  <input
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleChangeImages}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="status_footer ">
          <button className="btn btn-dark w-100" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;
