const DROPDOWN_CLASS = 'dropdown';
const DROPDOWN_HIDDEN_CLASS = 'dropdown--hidden';
const DROPDOWN_TOGGLE_CLASS = 'dropdown--active';

const DROPDOWN_SELECT_CLASS = 'dropdown__select';

const DROPDOWN_DISPLAY_CLASS = 'dropdown__select__display';

const DROPDOWN_MENU_CLASS = 'dropdown__menu';
const DROPDOWN_MENU_TOGGLE_CLASS = 'dropdown__menu--active';

const DROPDOWN_OPTIONLIST_CLASS = 'dropdown__menu__list';

const DROPDOWN_OPTION_CLASS = 'dropdown__menu__list__item';
const DROPDOWN_OPTION_SELECTED_CLASS = 'dropdown__menu__list__item--selected';
const DROPDOWN_OPTION_INDEX_ATTRIBUTE = 'data-index';
const DROPDOWN_OPTION_VALUE_ATTRIBUTE = 'data-value';
const DROPDOWN_OPTION_LABEL_ATTRIBUTE = 'data-label';

/**
 * Class to create custom dropdown menus, backed by HTML <select> objects.
 * @class Dropdown
 */
class Dropdown {

  // <select> element that contains the values of the dropdown
  selectElement;

  // map of option names to objects containing labels for the options
  optionMap;

  // map of option names to objects containing html content and init() functions
  optionContent;

  // container element that is a common ancestor for all other dropdown elements
  container;

  // the element that displays the selected option
  display;

  // dropdown menu that contains all the options
  menu;

  // parent element of all the dropdown options
  optionlist;

  // boolean indicating whether or not the dropdown menu is being displayed
  isDisplayingMenu = false;

  // the current selected dropdown option
  selectedOption = null;

  /**
   * Constructs a Dropdown object.
   * @param  {Element} selectElement - Select DOM element.
   */
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.createDropdown();
  }

  /**
   * Returns the value of the selected option.
   * @return {string} - Value of the selected option.
   */
  get value() {
    if (!this.selectOption) {
      throw Error('No option is selected');
    }
    return this.selectElement.options[this.selectOption.getAttribute(DROPDOWN_OPTION_INDEX_ATTRIBUTE)];
  }

  /**
   * Returns an HTML string containing all the options for the dropdown menu.
   * @return {string} - HTML string containing all the options for the dropdown menu.
   */
  getOptionsHtml() {
    let options = this.selectElement.children;
    let optionsHtml = '';
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      optionsHtml += `
        <li class="${DROPDOWN_OPTION_CLASS} ${this.selectElement.value === option.value ? DROPDOWN_OPTION_SELECTED_CLASS : ''}"
            ${DROPDOWN_OPTION_INDEX_ATTRIBUTE}="${option.index}"
            ${DROPDOWN_OPTION_VALUE_ATTRIBUTE}="${option.value}"
            ${DROPDOWN_OPTION_LABEL_ATTRIBUTE}="${this.optionMap[option.text].label}">
          ${this.optionContent.html}
        </li>`;
    }
    return optionsHtml;
  }

  /**
   * Creates a dropdown menu by appending HTML as a sibling of the select element.
   */
  createDropdown() {
    let optionsHtml = this.getOptionsHtml();
    let dropdownHtml = `
      <div class="${DROPDOWN_CLASS}">
        <div class="${DROPDOWN_SELECT_CLASS}">
          <div class="${DROPDOWN_DISPLAY_CLASS}"></div>
          <div class="dropdown__select__arrow">
            <span></span>
          </div>
        </div>
        <div class="${DROPDOWN_MENU_CLASS}">
          <ul class="${DROPDOWN_OPTIONLIST_CLASS}">
            ${optionsHtml}
          </ul>
        </div>
      </div>
    `;

    let ancestor = this.selectElement.parentNode;

    let div = document.createElement('div');
    div.innerHTML = dropdownHtml;
    ancestor.appendChild(div.children[0]);

    this.container = ancestor.querySelector(`.${DROPDOWN_CLASS}`);
    this.display = ancestor.querySelector(`.${DROPDOWN_DISPLAY_CLASS}`);
    this.menu = ancestor.querySelector(`.${DROPDOWN_MENU_CLASS}`);
    this.optionlist = ancestor.querySelector(`.${DROPDOWN_OPTIONLIST_CLASS}`);

    this.updateOptionContent();

    this.initListeners();
  }

  /**
   * Update all the displayed dropdown options using their respective init() functions in the "optionContent" field.
   */
  updateOptionContent() {
    let options = this.optionlist.querySelectorAll(`.${DROPDOWN_OPTION_CLASS}`);
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      if (option === this.selectedOption) {
        this.optionContent.init(this.display, this.selectedOption.getAttribute(DROPDOWN_OPTION_VALUE_ATTRIBUTE));
      }
      this.optionContent.init(option, option.getAttribute(DROPDOWN_OPTION_VALUE_ATTRIBUTE));
    }
  }

  /**
   * Initialize all event listeners for the dropdown menu.
   */
  initListeners() {
    document.addEventListener('click', (event) => {
      if (!this.container.contains(event.target)) {
        this.hideMenu();
      }
    });

    this.container.addEventListener('click', (event) => {
      this.toggleMenu();
    });
    this.optionlist.addEventListener('click', (event) => {
      if (event.target.classList.contains(DROPDOWN_OPTION_CLASS)) {
        this.selectOption(event.target);
      }
    });

    // Create MutationObserver to check for changes in the <select> element options
    let obs = new MutationObserver((mutations, observer) => {
      for (let mutation of mutations) {
        if (mutation.addedNodes || mutation.removedNodes) {
          this.updateOptions();
          break;
        }
      }
    });
    // Observe document
    obs.observe(this.selectElement, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  }

  /**
   * Update the status of the options and display the selected option. This is called when the options in the <select> element change.
   */
  updateOptions() {
    this.optionlist.innerHTML = this.getOptionsHtml();

    if (this.optionlist.children.length === 0) {
      this.container.classList.add(DROPDOWN_HIDDEN_CLASS);
    } else {
      this.container.classList.remove(DROPDOWN_HIDDEN_CLASS);
    }

    let index = this.selectElement.selectedIndex;
    this.selectedOption = this.optionlist.querySelector(`.${DROPDOWN_OPTION_CLASS}[${DROPDOWN_OPTION_INDEX_ATTRIBUTE}="${index}"]`);
    if (this.selectedOption) {
      this.selectedOption.classList.add(DROPDOWN_OPTION_SELECTED_CLASS);
    }
    this.displaySelectedOption();
    this.updateOptionContent();
  }

  /**
   * Toggle the display of the dropdown menu.
   */
  toggleMenu() {
    if (this.isDisplayingMenu) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  /**
   * Show the dropdown menu.
   */
  showMenu() {
    this.container.classList.add(DROPDOWN_TOGGLE_CLASS);
    this.menu.classList.add(DROPDOWN_MENU_TOGGLE_CLASS);
    this.isDisplayingMenu = true;
  }

  /**
   * Hide the dropdown menu.
   */
  hideMenu() {
    this.container.classList.remove(DROPDOWN_TOGGLE_CLASS);
    this.menu.classList.remove(DROPDOWN_MENU_TOGGLE_CLASS);
    this.isDisplayingMenu = false;
  }

  /**
   * Selects an option in the dropdown menu and updates the display.
   * @param  {Element} optionElement - The option that was selected.
   */
  selectOption(optionElement) {
    if (this.selectedOption) {
      this.selectedOption.classList.remove(DROPDOWN_OPTION_SELECTED_CLASS);
    }

    this.selectedOption = optionElement;
    this.selectedOption.classList.add(DROPDOWN_OPTION_SELECTED_CLASS);

    this.selectElement.options[this.selectElement.selectedIndex].selected = false;
    this.selectElement.selectedIndex = this.selectedOption.getAttribute(DROPDOWN_OPTION_INDEX_ATTRIBUTE);
    this.selectElement.options[this.selectElement.selectedIndex].selected = true;

    // Dispatch the 'change' event since modifying selectedIndex doesn't do it automatically
    let event = new Event('change');
    this.selectElement.dispatchEvent(event);

    this.displaySelectedOption();
  }

  /**
   * Display the selected dropdown option by copying the content to the dropdown display area. If the content includes a canvas, the content of the canvas will be copied as well.
   */
  displaySelectedOption() {
    if (this.selectedOption) {
      this.display.innerHTML = this.selectedOption.innerHTML;

      let srcCanvas = this.selectedOption.querySelector('canvas');
      let destCanvas = this.display.querySelector('canvas');
      if (srcCanvas && destCanvas) {
        let destCtx = destCanvas.getContext('2d');
        destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
        destCtx.drawImage(srcCanvas, 0, 0);
      }
    } else {
      this.display.innerHTML = '';
    }
  }
}

export { Dropdown };
export default Dropdown;
