import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/es/PNotifyStyleMaterial.js';
import * as basicLightbox from 'basiclightbox';
import searchQuery from './apiService';
import gallery from '../photoCardTemplate.hbs';

const btn = document.querySelector('.btn-container');
const searchForm = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
galleryList.addEventListener('click', modal);
searchForm.addEventListener('submit', sendRequest);

function loadMore() {
  searchQuery
    .apiServise(searchForm.query.value, ++searchQuery.page)
    .then(data => {
      if (!data.length) {
        PNotify.defaults.icons = 'material';
        PNotify.error({
          text: 'This is all found on this request!',
          delay: 1000,
        });
      }

      galleryList.insertAdjacentHTML('beforeend', gallery(data));
      setTimeout(() => {
        window.scrollTo({
          top: window.scrollY + 680,
          behavior: 'smooth',
        });
      }, 1000);
    })
    .catch(error => console.log(error));
}

function sendRequest(e) {
  e.preventDefault();
  clearGalleryList();
  searchQuery
    .apiServise(searchForm.query.value, searchQuery.page)
    .then(data => validQuery(data))
    .catch(error => console.log(error));
}

function clearGalleryList() {
  searchQuery.page = 1;
  galleryList.innerHTML = '';
  btn.innerHTML = '';
}

function modal(e) {
  if (e.target.nodeName === 'IMG') {
    const instance = basicLightbox.create(`
    <div class="modal">
    <img class="lightbox-img" src=${e.target.dataset.source} width="800" height="600">
    </div>
`);
    instance.show();
    document.onkeydown = function(e) {
      if (e.key === 'Escape') {
        instance.close();
      }
    };
  }
}

function validQuery(images) {
  if (!images.length) {
    PNotify.defaults.icons = 'material';
    PNotify.error({
      text: 'Nothing found on this request',
      delay: 2000,
    });
    return;
  } else {
    console.log(images);

    galleryList.innerHTML = gallery(images);
    btn.insertAdjacentHTML(
      'afterbegin',
      '<button class="load-more-btn" id="js-load-more">Load More</button>',
    );
    const loadMoreBtn = document.querySelector('#js-load-more');
    loadMoreBtn.addEventListener('click', loadMore);
  }
}
