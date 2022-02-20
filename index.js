import Autocomplete from './Autocomplete';
import states from './states';
import './main.css';


// US States
const data = states.map(state => ({
  text: state.name,
  value: state.abbreviation
}));

new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});


// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});
