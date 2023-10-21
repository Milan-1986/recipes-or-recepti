import View from "./View";
import icons from 'url:../../img/icons.svg';


class ResultsView extends View {
    parentElement = document.querySelector('.results');
    errorMessage = `No recipes found for your query! Please try again`;
    message = '';


    generateMarkup() {
        const id = window.location.hash.slice(1);
        return super.data.map(li => {
            return `
            <li class="preview">
                <a class="preview__link ${li.id === id ? 'preview__link--active' : ''}" href="#${li.id}">
                    <figure class="preview__fig">
                        <img src="${li.imageUrl}" alt="Picture of food" />
                    </figure>
                    <div class="preview__data">
                        <h4 class="preview__title">${li.title}</h4>
                        <p class="preview__publisher">${li.publisher}</p>
                        <div class="preview__user-generated ${li.key ? '' : 'hidden'}">
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



export default new ResultsView();