var Header = React.createClass({
	getInitialState: function() {
		return {
			current_language: null,
		};
	},

	handleClick: function(language, event) {
		if (language == 'All')
		{
			this.setState({current_language: null});
			language = 'stars:>=0';
		}
		else {
			this.setState({current_language: language});
		}
	},

	render: function() {
		var list = this.props.languages.map(function (language){
			return (
				<li><a onClick={this.handleClick.bind(this, language)}>{language}</a></li>
			);
		}, this);
		return (
			<div>
				<div className="header">
					<h1>Top 50 {this.state.current_language} Projects in <i className="fa fa-github"></i>Github</h1>
					<ul>{list}</ul>
				</div>
				<div className="list">
					<RepoList current_language={this.state.current_language} url={this.props.url} />
				</div>
			</div>
		)
	}
});

var RepoList = React.createClass({
	getInitialState: function() {
		return {
			loading: true,
			error: null,
			data: null
		};
	},
	update: function(current_language) {
		var temp;
		if (current_language)
		{
			temp = this.props.url + 'language:' + encodeURIComponent(current_language);
		}
		else {
			temp = this.props.url + 'stars:>=0';
		}
		$.getJSON(temp).then(
			value => this.setState({loading: false, data: value}),
			error => this.setState({loading: false, error: error})
		);
	},
	componentDidMount() {
		this.update(this.props.current_language);
	},
	componentWillReceiveProps(nextProps)
	{
		this.setState({loading: true});
		this.update(nextProps.current_language);
	},

	render: function() {
		if (this.state.loading) {
			return <span><i className="fa fa-spinner fa-spin"></i> Loading...</span>;
		}
		else if (this.state.error !== null) {
			return <span>Error: {this.state.error.message}</span>;
		}
		else {
			var repos = this.state.data.items;
			var repoList = repos.map(function (repo) {
				return (
					<div>
						<a href={repo.html_url} target="_blank"><img src={repo.owner.avatar_url} /></a>
						<li>
							<p>
								<a href={repo.html_url} target="_blank">{repo.name}</a> (<i className="fa fa-star star"></i> {repo.stargazers_count}) {repo.language ? <span className="tag">{repo.language}</span> : ''} <br/><br/> {repo.description}
							</p>
						</li>
					</div>
				);
			});
			
			return (
					<ul>{repoList}</ul>
			);
		}
	}
});

// https://api.github.com/search/repositories?q=javascript&per_page=50&sort=stars 
var languages=['All','JavaScript','Python','Ruby', 'Html', 'CSS', 'C', 'C++', 'Java', 'Go', 'C#', 'Scala'];
var github_api_url = 'https://api.github.com/search/repositories?per_page=50&sort=stars&q='
ReactDOM.render(
	<Header languages={languages} url={github_api_url}/>,
	document.getElementById('content')
);