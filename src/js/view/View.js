import icons from 'url:../../img/icons.svg';


export default class View {
  #data;

  render(data) {

    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this.#data = data;

    const markup = this.generateMarkup();
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  get data() {
    return this.#data;
  }

  // Kopiranje elementa DOM i menjanje samo teksta unutar elementa da se ne bi ponavljao fetch API 
  update(data) {

    this.#data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newElement, index) => {
      const curElement = currentElements[index];
      // console.log(curElement, newElement.isEqualNode(curElement));

      if (!newElement.isEqualNode(curElement) && newElement.firstChild?.nodeValue.trim() !== '') {

        curElement.textContent = newElement.textContent
      }

      if (!newElement.isEqualNode(curElement))
        Array.from(newElement.attributes).forEach(attribute => curElement.setAttribute(attribute.name, attribute.value))
    })
  }


  clear() {
    this.parentElement.innerHTML = '';
  }

  renderSpiner = function () {
    const markup = `
      <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
      </div>
      `
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderError(message = this.errorMessage) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> `;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderSuccessMessage(message = this.successMessage) {
    const markup = `
        <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div> `;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}