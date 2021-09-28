import React from 'react';
import {
  EmailShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from 'react-share';
import { useSelector } from 'react-redux';

const ShareModal = ({ url }) => {
  const { theme } = useSelector((state) => state);

  return (
    <div className="d-flex justify-content-between px-4 py-2 bg-light">
      <FacebookShareButton url={url}>
        <FacebookIcon
          round={true}
          size={32}
          style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
        />
      </FacebookShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon
          round={true}
          size={32}
          style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
        />
      </LinkedinShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon round={true} size={32} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
      </TwitterShareButton>
      <RedditShareButton url={url}>
        <RedditIcon round={true} size={32} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
      </RedditShareButton>
      <FacebookMessengerShareButton url={url}>
        <FacebookMessengerIcon
          round={true}
          size={32}
          style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
        />
      </FacebookMessengerShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon
          round={true}
          size={32}
          style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
        />
      </WhatsappShareButton>
      <EmailShareButton url={url}>
        <EmailIcon round={true} size={32} style={{ filter: theme ? 'invert(1)' : 'invert(0)' }} />
      </EmailShareButton>
    </div>
  );
};

export default ShareModal;
