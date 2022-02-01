import '../styles/index.css';

const results = document.getElementById('results');
const genreList = document.getElementById('filter-genre-list');
const yearList = document.getElementById('filter-year-list');

let state = {
    media: [],
    genres: [],
    years: [],
    genreShow: false,
    yearShow: false,
    selectedGenre: [],
    selectedYear: [],
    mediaType: '',
    search: ''
}

function clearFilters(e){
    e.preventDefault();
    state = {
        ...state,
        selectedGenre: [],
        selectedYear: [],
        mediaType: '',
        search: ''
    }
    Array.from(document.getElementsByClassName('media-filter')).forEach(el=>el.checked = false);
    document.getElementById('filter-bar-search').value='';
    render();
}

function setMediaType(e){
    state.mediaType = e.currentTarget.id.replace("media-filter-","");
    render();
}

function showDropdowns(e){
    const key = e.currentTarget.id.replace("filter-","")+"Show";
    state[key] = !state[key]
    render();
}

function saveSearch(e){
    state.search = e.currentTarget.value;
    render();
}

function toggleGenres(e){
    if(e.currentTarget.checked===true){
        state.selectedGenre.push(e.currentTarget.value);
    } else {
        state.selectedGenre = state.selectedGenre.filter(genre=>genre!==e.currentTarget.value);
    }
    render();
}

function toggleYears(e){
    if(e.currentTarget.checked===true){
        state.selectedYear.push(e.currentTarget.value);
    } else {
        state.selectedYear = state.selectedYear.filter(year=>year!==e.currentTarget.value);
    }
    render();
}


function render(){
    console.log({state});
    results.innerHTML='';
    genreList.innerHTML='';
    yearList.innerHTML='';
    
    let items = state.media;
    if(state.mediaType!==''){
        items = items.filter(item=>item.type===state.mediaType);
    }
    if(state.selectedGenre.length>0){
        items = items.filter(item=>item.genre.some(genre=>state.selectedGenre.includes(genre)));
    }
    if(state.selectedYear.length>0){
        items = items.filter(item=>state.selectedYear.includes(item.year));
    }
    if(state.search!==''){
        items = items.filter(item=>item.title.toLowerCase().indexOf(state.search.toLowerCase())>=0);
    }
    items.map(media=>{
        const item = `
            <div class="results-item">
                <img src="${media.poster}" class="results-item-poster"/>
                <h3>${media.title}</h3>
                <h4>Genres: ${media.genre.map(genre=>" "+genre[0].toUpperCase()+genre.substring(1)).toString()}</h4>
            </div>
        `;
        results.insertAdjacentHTML('beforeend',item);
    });
    state.genres.map(genre=>{
        const item = `<li class="filter-bars-filter-list-item"><input type="checkbox" class="genre-check" value="${genre}" ${state.selectedGenre.includes(genre) ? 'checked' : ''} />${genre[0].toUpperCase()+genre.substring(1)}</li>`;
        genreList.insertAdjacentHTML('beforeend',item);
    });
    state.years.map(year=>{
        const item = `<li class="filter-bars-filter-list-item"><input type="checkbox" class="year-check" value="${year}" ${state.selectedYear.includes(year) ? 'checked' : ''} />${year}</li>`;
        yearList.insertAdjacentHTML('beforeend',item);
    });

    Array.from(document.getElementsByClassName('genre-check')).forEach(el=>el.addEventListener('change',toggleGenres));
    Array.from(document.getElementsByClassName('year-check')).forEach(el=>el.addEventListener('change',toggleYears));

    document.getElementsByClassName('filter-bar-sub-clear')[0].addEventListener('click',clearFilters)
    Array.from(document.getElementsByClassName('media-filter')).forEach(el=>el.addEventListener('change',setMediaType));
    Array.from(document.getElementsByClassName('filter-bar-filters-filter')).forEach(el=>el.addEventListener('click',showDropdowns));
    Array.from(document.getElementsByClassName('filter-bar-filters-filter')).forEach(el=>{
        const key = el.id.replace("filter-","")+"Show";
        if(state[key]){
            document.getElementById(el.id+"-list").classList="filter-bar-filters-list open";
        } else {
            document.getElementById(el.id+"-list").classList="filter-bar-filters-list";
        }
    });

    document.getElementById('filter-genre').innerText = state.selectedGenre.length > 0 ? `${state.selectedGenre.length} Genre(s)` : 'Genre';
    document.getElementById('filter-year').innerText = state.selectedYear.length > 0 ? `${state.selectedYear.length} Year(s)` : 'Year';

    document.getElementById('filter-bar-search').addEventListener('keypress',saveSearch);



}


function main(){
    fetch('https://raw.githubusercontent.com/HubSpotWebTeam/CodeExercise/main/src/js/data/data.json')
        .then(res=>res.json())
        .then(data=>{
            state.media = data.media;
            state.media.map(media=>{
                state.genres = [...state.genres,...media.genre];
                state.years = [...state.years,media.year];
            });
            state.genres = state.genres.filter((value,index,self)=>self.indexOf(value)===index).sort();
            state.years = state.years.filter((value,index,self)=>self.indexOf(value)===index).sort((a,b)=>a-b);
            
            render();
        })
        .catch(err=>console.error(err));
}

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        main();
    }
}

