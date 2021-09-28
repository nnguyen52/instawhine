import React from 'react';
import Lottie from 'react-lottie';
import loadingInstaLottie from './lotties/15016-insta-anim.json';
import { useSelector } from 'react-redux';

const LoadingLottie = () => {
  const { theme } = useSelector((state) => state);
  const lottieDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingInstaLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    isStopped: false,
    isPaused: false,
  };
  return (
    <div>
      <Lottie
        options={lottieDefaultOptions}
        height={200}
        width={200}
        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
      />
    </div>
  );
};

export default LoadingLottie;
