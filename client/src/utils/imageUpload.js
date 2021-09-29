export const checkImageUpload = (file) => {
  let err = '';
  if (!file) err = 'File does not exist.';
  //if file > 1mb => reject
  if (file.size > 1024 * 1024) err = 'The largest size of image is 1mb.';
  //check format
  if (file.type !== 'image/jpeg' && file.type !== 'image/png')
    err = 'File format must be JPEG or PNG.';
  return err;
};

export const imageUpload = async (images) => {
  //FIRST: set up Cloudinary
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if (item.camera) {
      formData.append('file', item.camera);
    } else {
      formData.append('file', item);
    }

    //cpfj5eol is preset name in cloudinary;
    //cloud name in dashboard
    //upload url: API image upload
    formData.append('upload_preset', 'cpfj5eol');
    formData.append('cloud_name', 'cloudinarystore');
    formData.append('folder', 'instawhine');
    const res = await fetch('https://api.cloudinary.com/v1_1/cloudinarystore/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
