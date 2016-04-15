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

class Dropdown {

  // width of options
  width;

  // height of options
  height;

  // number of elements to display in a row in the dropdown menu
  numCols;

  // number of rows to display in the dropdown menu (before needing a scrollbar)
  numRows;

  selectElement;
  optionMap;

  // container element that is a common ancestor for all other dropdown elements
  container;

  // the element that displays the selected option
  display;

  // dropdown menu that contains all the options
  menu;

  // list of options
  optionlist;

  isDisplayingMenu = false;

  selectedOption = null;

  constructor(selectElement) {
    this.selectElement = selectElement;
    this.createDropdown();
  }

  get value() {
    if (!this.selectOption) {
      throw Error('No option is selected');
    }
    // return this.selectOption.getAttribute(DROPDOWN_OPTION_VALUE_ATTRIBUTE);
    return this.selectElement.options[this.selectOption.getAttribute(DROPDOWN_OPTION_INDEX_ATTRIBUTE)];
  }

  // set value(value) {
  //   if (this.selectedOption) {
  //     this.selectedOption.classList.remove(DROPDOWN_OPTION_SELECTED_CLASS);
  //   }
  //
  //   let optionElement = this.optionlist.querySelector(`.${DROPDOWN_OPTION_CLASS}[${DROPDOWN_OPTION_VALUE_ATTRIBUTE}="${value}"]`);
  //   this.selectedOption = optionElement;
  //   this.selectedOption.classList.add(DROPDOWN_OPTION_SELECTED_CLASS);
  //
  //   this.selectElement.selectedIndex = this.selectedOption.getAttribute(DROPDOWN_OPTION_INDEX_ATTRIBUTE);
  //
  //   this.displaySelectedOption();
  // }

  getOptionsHtml() {
    let options = this.selectElement.children;
    let optionsHtml = '';
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      optionsHtml += `
        <li class="${DROPDOWN_OPTION_CLASS} ${this.selectElement.value === option.value ? DROPDOWN_OPTION_SELECTED_CLASS : ''}"
            ${DROPDOWN_OPTION_INDEX_ATTRIBUTE}="${option.index}"
            ${DROPDOWN_OPTION_VALUE_ATTRIBUTE}="${option.value}">
          ${this.optionMap[option.text].label}
        </li>`;
    }
    return optionsHtml;
  }

  createDropdown() {
    let optionsHtml = this.getOptionsHtml();
    let dropdownHtml = `
      <div class="${DROPDOWN_CLASS}">
        <div class="${DROPDOWN_SELECT_CLASS}">
          <div class="${DROPDOWN_DISPLAY_CLASS}"></div>
          <div class="dropdown__select__arrow vcenter-wrapper">
            <span class="vcenter"></span>
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

    this.initListeners();
  }

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

    // Create MutationObserver to check for changes in selectElement options
    let obs = new MutationObserver((mutations, observer) => {
      for (let i = 0; i < mutations.length; i++) {
        let mutation = mutations[i];
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
  }

  toggleMenu() {
    if (this.isDisplayingMenu) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  showMenu() {
    this.container.classList.add(DROPDOWN_TOGGLE_CLASS);
    this.menu.classList.add(DROPDOWN_MENU_TOGGLE_CLASS);
    this.isDisplayingMenu = true;
  }

  hideMenu() {
    this.container.classList.remove(DROPDOWN_TOGGLE_CLASS);
    this.menu.classList.remove(DROPDOWN_MENU_TOGGLE_CLASS);
    this.isDisplayingMenu = false;
  }

  selectOption(optionElement) {
    // this.value = this.selectedOption.getAttribute(DROPDOWN_OPTION_VALUE_ATTRIBUTE);
    if (this.selectedOption) {
      this.selectedOption.classList.remove(DROPDOWN_OPTION_SELECTED_CLASS);
    }

    // let optionElement = this.optionlist.querySelector(`.${DROPDOWN_OPTION_CLASS}[${DROPDOWN_OPTION_VALUE_ATTRIBUTE}="${value}"]`);
    this.selectedOption = optionElement;
    this.selectedOption.classList.add(DROPDOWN_OPTION_SELECTED_CLASS);

    this.selectElement.selectedIndex = this.selectedOption.getAttribute(DROPDOWN_OPTION_INDEX_ATTRIBUTE);

    this.displaySelectedOption();
  }

  displaySelectedOption() {
    if (this.selectedOption) {
      this.display.innerHTML = this.selectedOption.innerHTML;

      // TODO: add functions for canvas calls when drawn object is updated
      // and call that function instead
      let srcCanvas = this.selectedOption.querySelector('canvas');
      let destCanvas = this.display.querySelector('canvas');
      if (srcCanvas && destCanvas) {
        let destCtx = destCanvas.getContext('2d');
        destCtx.drawImage(srcCanvas, 0, 0);
      }
    } else {
      this.display.innerHTML = '';
    }
  }
}

export { Dropdown };
export default Dropdown;
