const axios = require('axios');
//Hard coded list of the Star Trek TV shows and movies
const starTrekTV = ['580', '67198', '253', '1855', '314', '106393', '85949', '655', '85948', '82491', '116656', '103516', '1992']
const starTrekMovies = ['13475', '188927', '54138', '201', '200', '199', '193', '152', '172', '168', '154', '174', '157']
const tmdbAPIKey = process.env.TMDB_API_KEY
let masterCast = []
let masterCrew = []
var baseURL = ""
var imageSizes = []
var shown = false

const init = async() => { //Download all the ST cast and crew from TMDB

  const response = await axios.get('https://api.themoviedb.org/3/configuration?api_key=' + tmdbAPIKey + '&language=en-US')
  baseURL = response.data.images.base_url
  image_sizes = response.data.images.profile_sizes

  console.log("LOG: Got init configuration")
  console.log("LOG: Base URL: " + baseURL)
  console.log("LOG: " + image_sizes)

  let showData = []
  let movieData = []

  for( element of starTrekTV)
  {
    const titleResponse = await axios.get('https://api.themoviedb.org/3/tv/' + element + '?api_key=' + tmdbAPIKey + '&language=en-US')
    const title = titleResponse.data.name
    //console.log(titleResponse.data)
    const response = await axios.get('https://api.themoviedb.org/3/tv/' + element + '/aggregate_credits?api_key=' + tmdbAPIKey + '&language=en-US')
    console.log("LOG: Processing up show " + title)
    for (element of response.data.cast)
    {
      element.show_name=title
      showData.push(element)
    }
    for (element of response.data.crew)
    {
      element.show_name=title
      showData.push(element)
    }

  }

  console.log("LOG: Got all star trek TV cast")
  for( element of starTrekMovies)
  {

    const response = await axios.get("https://api.themoviedb.org/3/movie/" + element + "/credits?api_key=" + tmdbAPIKey + "&language=en-US")
    const titleResponse = await axios.get("https://api.themoviedb.org/3/movie/" + element + "?api_key=" + tmdbAPIKey + "&language=en-US")
    const title = titleResponse.data.title
    console.log("LOG: Processing up movie " + title)
    for (element of response.data.cast)
    {
      element.show_name=title
      movieData.push(element)
    }
    for (element of response.data.crew)
    {
      element.show_name=title
      movieData.push(element)
    }
  }
  console.log("LOG: Got all star trek movie cast")
  masterCast = showData.concat(movieData)
  ids = masterCast.map(o => o.id)
  uniqueCast = masterCast.filter(({id}, index) => !ids.includes(id, index + 1))
  console.log("LOG: " + uniqueCast.length + " total cast members")

  masterCast = uniqueCast;

  module.exports.baseURL = baseURL;
  console.log("LOG: Finished init data")
}

const castLookup = async(name) => {
  movie_data = await getMovie(name)
  if (movie_data.data.results){
    return await getMovieCast(movie_data.data.results[0].id)
  }
}

const getMovie = async(name) =>{
  try {
    return await axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + tmdbAPIKey + '&language=en-US&query='+name+'&page=1&include_adult=false')
  } catch(error) {
      console.log(error);
    }
}

const getMovieCast = async(movie_id) => {
    try {
      const c = await axios.get("https://api.themoviedb.org/3/movie/" + movie_id + "/credits?api_key=" + tmdbAPIKey + "&language=en-US");
      return c.data.cast.concat(c.data.crew)
    }
   catch(error) {
    console.log(error);
    }
}

const getTVCast = async(tv_id) => {
  try {
    const c = await axios.get('https://api.themoviedb.org/3/tv/' + tv_id + '/aggregate_credits?api_key=' + tmdbAPIKey + '&language=en-US');
    return c.data.cast
  }
  catch(error) {
   console.log(error);
   }
}

const starTrekConnection = async(movieID) => {
  // searchCast = await castLookup(movie_title)
  // console.log("LOG: Got input movie cast")
  searchCast = await getMovieCast(movieID)
  //Check to see if we've already init'd
  if (masterCast.length == 0 ) {
    await init()
  }

  connection = []
  try {
    if(searchCast){
          if (masterCast){
            console.log(masterCast.length)
            console.log(searchCast.length)
            for(const c of masterCast){
              for(const x of searchCast){
                if(x.id == c.id) {
                  // console.log(c)
                  connection.push(c)
                }
              }
            }
        }
      }
    }
  catch(error) {
   console.log(error);
   return ""
   }
   return connection
}



function StarTrekConnection(movie_title){
  starTrekConnection(movie_title)
}

var outputs = {
            image_sizes: imageSizes[0],
            connection: async function (title) {
                console.log(title);
                return starTrekConnection(title);
            },
            movieID: async function (title) {
              console.log("Searching for movie " + title);
              movie = await getMovie(title);

              movieID = movie.data.results[0].id
              console.log(movieID)
              return  movieID;
            },
            init: async function() {
              await init();
            }
    };

module.exports = outputs;
