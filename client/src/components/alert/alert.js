import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './loading';
import Toast from './toast';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
const Alert = () => {
  const { alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div
      //   className="position-fixed w-100 h-100 text-center"
      className="text-center"
      style={
        {
          // zIndex: 50,
        }
      }
    >
      {alert.loading && <Loading />}
      {alert.error && (
        <Toast
          msg={{ title: 'Error', body: alert.error }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-danger"
        />
      )}
      {alert.success && (
        <Toast
          msg={{ title: 'Success!', body: alert.success }}
          handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
          bgColor="bg-success"
        />
      )}
    </div>
  );
};

export default Alert;
