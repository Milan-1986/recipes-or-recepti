import View from "./View";
import icons from 'url:../../img/icons.svg';


class BookmarksView extends View {
    parentElement = document.querySelector('.bookmarks__list');
    errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it.`;
    message = '';

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    generateMarkup() {
        const id = window.location.hash.slice(1);
        return super.data.map(li => {

            return `
        <li class="preview">
            <a class="preview__link ${li.id === id ? 'preview__link--active' : ''}" href="#${li.id}">
                <figure class="preview__fig">
                    <img src="${li.imageUrl}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${li.title}</h4>
                    <p class="preview__publisher">${li.publisher}</p>
                    <div class="preview__user-generated">
                        <svg>
                            <use href="${icons}#icon-user"></use>
                        </svg>
                    </div>
                </div>
            </a>
        </li>`
        }).join('')
    }
}
export default new BookmarksView()