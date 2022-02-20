import { fetchData } from './utils';

class Autocomplete {
    constructor(rootEl, options = {}) {
        Object.assign(this, { rootEl, numOfResults: 10, data: [], options });
        this.init();
    }

    init() {
        // Build query input
        this.inputEl = this.createQueryInputEl();
        this.rootEl.appendChild(this.inputEl)

        // Build results dropdown
        this.listEl = document.createElement('ul');
        Object.assign(this.listEl, { className: 'results' });
        this.rootEl.appendChild(this.listEl);

        // Build select result
        this.resultEl = document.createElement('p');
        Object.assign(this.resultEl, { className: 'result' });
        this.rootEl.appendChild(this.resultEl);
        this.index = -1;

        this.rootEl.addEventListener('keydown', (e) => this.handleNavigation(e));
    }

    handleNavigation(event) {
        const { keyCode } = event;

        if (event.keyCode === 40) { //Arrow Down
            this.next();
        } else if (keyCode === 38) { // Arrow Up
            this.previous();
        } else if (keyCode === 13) { //Enter
            event.preventDefault();
            let el = this.listEl.children[this.index];
            if (el) {
                this.handleSelect(el.textContent);
            }
        }
    }

    createQueryInputEl() {
        const inputEl = document.createElement('input');
        Object.assign(inputEl, {
            type: 'search',
            name: 'query',
            autocomplete: 'off',
        });

        inputEl.addEventListener('input', event =>
            this.onQueryChange(event.target.value));

        return inputEl;
    }

    createResultsEl(results) {
        const fragment = document.createDocumentFragment();

        results.forEach((result) => {
            const el = document.createElement('li');
            Object.assign(el, {
                className: 'result',
                textContent: result.text,
            });

            // Pass the value to the onSelect callback
            el.addEventListener('click', (event) => {
                const { onSelect } = this.options;
                if (typeof onSelect === 'function') onSelect(result.value);
                this.handleSelect(result.text)
            });

            fragment.appendChild(el);
        });
        return fragment;
    }

    handleSelect(text) {
        this.resultEl.innerText = text;
        const prevSelectedEl = this.listEl.children[this.index];

        if (prevSelectedEl) {
            prevSelectedEl.className = "result"
        }

        this.index = -1;
    }

    async onQueryChange(query) {
        // Get data for the dropdown
        let results = await this.getResults(query, this.options.data);
        results = results.slice(0, this.options.numOfResults);

        this.updateDropdown(results);
        this.index = -1;
    }

    updateDropdown(results) {
        this.listEl.innerHTML = '';
        this.listEl.appendChild(this.createResultsEl(results));
    }

    async getResults(query, data) {
        if (!query) return [];

        // if no data, fetch from api
        if (!data) {
            data = await this.getResultsAsync(query);
        }

        // Filter for matching strings
        let results = data.filter((item) => {
            return item.text.toLowerCase().includes(query.toLowerCase());
        });

        return results;
    }

    async getResultsAsync(query) {  
        const numOfResults = this.options.numOfResults || this.numOfResults;

        return await fetchData(query, numOfResults);
    }

    next() {
        const count = this.listEl.children.length;
        let index = 0;
        if (this.index < count - 1) {
            index = this.index + 1;
        } else if (count) {
            index = 0;
        } else {
            index = -1;
        }
        this.goTo(index, 'next');
    }

    previous() {
        const count = this.listEl.children.length;
        const pos = this.index - 1;
        const index = (this.index > -1 && pos !== -1) ? pos : count - 1;
        this.goTo(index, 'previous');
    }

    goTo(index, type) {
        let count = this.listEl.children.length;
        let prevIndex = type === 'next' ? index - 1 : index + 1;

        // Handle edge cases for the first and the last item
        if (prevIndex === -1) {
            prevIndex = count - 1;
        } else if (prevIndex === count) {
            prevIndex = 0;
        }

        // Update previous element
        const prevEl = this.listEl.children[prevIndex];
        if (prevEl) {
            prevEl.className = 'result'
        }
        // Update next element
        const targetEl = this.listEl.children[index];
        targetEl.className = 'selected-result';
        this.index = index;
    }

};

export default Autocomplete;