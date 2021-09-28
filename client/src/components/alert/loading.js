import React from 'react';
import Lottie from 'react-lottie';
import loadingInstaLottie from '../lotties/15016-insta-anim.json';

const Loading = () => {
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
    <div className="loading">
      <Lottie options={lottieDefaultOptions} height={200} width={200} />
    </div>
  );
};

export default Loading;
