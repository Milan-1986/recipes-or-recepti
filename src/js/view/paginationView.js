import View from "./View";
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {
    parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this.parentElement.addEventListener('click', function (event) {
            const button = event.target.closest('.btn--inline');
            if (!button) return;
            const goToPage = +button.dataset.goto;
            handler(goToPage)
        })
    }


    nextPageButton(currentPage) {
        return `
        <button class="btn--inline pagination__btn--next" data-goTo="${currentPage + 1}">
             <span>Page ${currentPage + 1}</span>
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-right"></use>
             </svg>
          </button>
        `
    }

    previousPageButton(currentPage) {
        return `
        <button class="btn--inline pagination__btn--prev" data-goTo="${currentPage - 1}">
             <svg class="search__icon">
               <use href="${icons}#icon-arrow-left"></use>
             </svg>
             <span>Page ${currentPage - 1}</span>
           </button>
        `
    }
    generateMarkup() {
        const currentPage = super.data.page;
        const numberOfPages = Math.ceil(super.data.results.length / super.data.resultsPerPage);

        // page 1 and there are other pages
        if (currentPage === 1 && numberOfPages > 1) {
            return this.nextPageButton(currentPage)
        }
        // Last page
        if (currentPage === numberOfPages && numberOfPages > 1) {
            return this.previousPageButton(currentPage)
        }
        // other (middle) page
        if (currentPage < numberOfPages) {
            return [this.previousPageButton(currentPage), this.nextPageButton(currentPage)];

        }
        // page 1 and there are NO other pages
        return ``

    }
}

export default new PaginationView();
