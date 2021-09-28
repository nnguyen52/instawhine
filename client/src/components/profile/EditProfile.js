import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkImageUpload } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { updateUserProfile } from '../../redux/actions/profileAction';

const EditProfile = ({ setOnEdit }) => {
  const dispatch = useDispatch();

  const { auth, theme } = useSelector((state) => state);

  const initState = { fullName: '', mobile: '', website: '', story: '', gender: '', address: '' };
  const [userData, setUserData] = useState(initState);
  const { fullName, mobile, website, story, gender, address } = userData;

  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const [avatar, setAvatar] = useState('');
  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImageUpload(file);
    if (err) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }
    setAvatar(file);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ userData, avatar, auth }));
  };

  return (
    <div className="edit_profile">
      <button className="btn btn-danger btn_close" onClick={() => setOnEdit(false)}>
        Close
      </button>
      <form onSubmit={handleSubmit}>
        <div className="info_avatar">
          <img
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            alt="user avatar"
            style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
          />
          <span>
            <i className="fa fa-camera" />
            <p>Change</p>
            <input type="file" name="file" id="file_up" accept="image/*" onChange={changeAvatar} />
          </span>
        </div>
        <div className="form_group">
          <label htmlFor="fullName">Full Name</label>
          <div className="position-relative">
            <input
              type="text"
              className="form_control"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={handleInput}
              style={{ width: '100%' }}
            />
            <small
              className="position-absolute text-danger"
              style={{ top: '50%', right: '5px', transform: 'translateY(-50%)' }}
            >
              {fullName.length}/20
            </small>
          </div>
        </div>
        <div className="form_group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="number"
            className="form_control"
            id="mobile"
            name="mobile"
            value={mobile}
            onChange={handleInput}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form_group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form_control"
            id="address"
            name="address"
            value={address}
            onChange={handleInput}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form_group">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            className="form_control"
            id="website"
            name="website"
            value={website}
            onChange={handleInput}
            style={{ width: '100%' }}
          />
        </div>
        <div className="form_group">
          <label htmlFor="story">Story</label>
          <textarea
            type="text"
            className="form_control"
            id="story"
            name="story"
            value={story}
            onChange={handleInput}
            style={{ width: '100%' }}
            cols="30"
            rows="4"
          />
          <small
            className="text-danger"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: 0,
              margin: 0,
              transform: 'translateY(-5px)',
            }}
          >
            {story.length}/200
          </small>
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <div className="input-group-prepend px-0 mb-4">
            <select
              name="gender"
              id="gender"
              className="custom-select text-capitalize"
              onChange={handleInput}
              style={{ width: '100%' }}
              value={gender}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-info"
          style={{ width: '100%', borderRadius: '5px' }}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
