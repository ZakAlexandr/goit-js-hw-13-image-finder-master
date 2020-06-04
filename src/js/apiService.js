export default {
  page: 1,
  apiServise(query, page) {
    const baseURL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal&';
    const parameters = `&q=${query}&page=${page}&per_page=12`
    const key = '&key=15737125-9731c193a08476753ed150b4b'
    return fetch(baseURL + parameters + key)
      .then((response) => {
        return response.json()
      })
      .then((data => {
        return data.hits
      }))
      .catch((error) => {
        console.error(error)
      });
  }
}
