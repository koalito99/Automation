import request from 'axios';

export default async function (files, sourceId) {
  let formData = new FormData();

  if (files) {
    files.map((file, index) => {
      formData.append(`file_${index}`, file);
    });
  }

  return request.post(`${API_URL}/import/${sourceId}/import`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}
