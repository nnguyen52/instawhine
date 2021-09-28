export const imageShow = (src, theme, width = '100%') => {
  return (
    <img
      src={src}
      alt="images"
      style={{
        width: `${width}`,
        filter: theme ? 'invert(1)' : 'invert(0)',
        borderRadius: '16px',
      }}
    />
  );
};

export const videoShow = (src, theme, width = '100%') => {
  return (
    <video
      controls
      src={src}
      alt="images"
      style={{
        width: `${width}`,
        filter: theme ? 'invert(1)' : 'invert(0)',
      }}
    />
  );
};
