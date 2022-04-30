const axios = require('axios');
//Hard coded list of the Star Trek TV shows and movies
const starTrekTV = ['580', '67198', '253', '1855', '314', '106393', '85949', '655', '85948', '82491', '116656', '103516', '1992']
const starTrekMovies = ['13475', '188927', '54138', '201', '200', '199', '193', '152', '172', '168', '154', '174', '157', '918371']
const tmdbAPIKey = process.env.TMDB_API_KEY
let masterCast = []
let masterCrew = []

const init = async() => { //Download all the ST cast and crew from TMDB
  let showData = []
  let movieData = []

  for( element of starTrekTV)
  {
    const response = await axios.get('https://api.themoviedb.org/3/tv/' + element + '/aggregate_credits?api_key=' + tmdbAPIKey + '&language=en-US')
    showData.push(response.data)
  }
  for( element of starTrekMovies)
  {
    const response = await axios.get("https://api.themoviedb.org/3/movie/" + element + "/credits?api_key=" + tmdbAPIKey + "&language=en-US")
    movieData.push(response.data)
  }

  for (show of showData){
    masterCast = masterCast.concat(show.cast)
    masterCrew = masterCrew.concat(show.crew)
  }

  for (movie of movieData){
    masterCast = masterCast.concat(movie.cast)
    masterCrew = masterCrew.concat(movie.crew)
  }

  masterCast = masterCast.concat(masterCrew) //Concat everything into a single list
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

const starTrekConnection = async(movie_title) => {
  searchCast = await castLookup(movie_title)
  await init()
  connection = []
  try {
    if(searchCast){
          if (masterCast){
            console.log(masterCast.length)
            console.log(searchCast.length)
            for(const c of masterCast){
              for(const x of searchCast){
                if(x.id == c.id) {
                  console.log(c)
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
            connection: async function (title) {
                console.log(title);
                return starTrekConnection(title);
            }
    };

module.exports = outputs
