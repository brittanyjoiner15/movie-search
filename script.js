const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error("Houston we have a probelm!");
};

const json = (response) => response.json();

const Movie = (props) => {
  const { Title, Year, imdbID, Type, Poster } = props.movie;

  return (
    <div className="row">
      <div className="col-4 col-md-3 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <img src={Poster} className="img-fluid" />
        </a>
      </div>
      <div className="col-8 col-md-9 mb-3">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
          <h4>{Title}</h4>
          <p>Released: {Year}</p>
        </a>
      </div>
    </div>
  );
};

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      results: [],
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      searchTerm: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim(); //removes whitespace at beginning or end
    if (!searchTerm) {
      window.alert("there was no search term");
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=b4aed818`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        console.log(data);
        if (data.Response === "False") {
          throw new Error(data.Error);
        }
        if (data.Response === "True" && data.Search) {
          this.setState({ results: data.Search, error: "" });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  render() {
    const { searchTerm, results, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>
            {(() => {
              if (error) {
                return (
                  <p>
                    Houston we have a problem!
                    <br />
                    {error}
                  </p>
                );
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              });
            })()}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MovieFinder />, document.getElementById("root"));
