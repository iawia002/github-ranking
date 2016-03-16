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
			return (
				<div className="loading">
					<i className="fa fa-spinner fa-spin"></i> Loading...
				</div>
			);
		}
		else if (this.state.error !== null) {
			return (
				<div className="loading">
					<i class="fa fa-exclamation"></i> Error: {this.state.error.message}
				</div>
			);
		}
		else {
			var repos = this.state.data.items;
			var r = repos.sort(function(a, b){
				return (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count)
			});
			var repoList = r.map(function (repo, i) {
				return (
					<div>
						<a href={repo.html_url} target="_blank"><img src={repo.owner.avatar_url} /></a>
						<li>
							<p>
								{i+1}.<a href={repo.html_url} target="_blank">{repo.name}</a> (<i className="fa fa-star"></i>{repo.stargazers_count}&nbsp;&nbsp;<i className="fa fa-code-fork"></i>{repo.forks_count}&nbsp;&nbsp;<i className="fa fa-star"></i>+<i className="fa fa-code-fork"></i>{repo.stargazers_count + repo.forks_count}) {repo.language ? <span className="tag">{repo.language}</span> : ''} <br/><br/> {repo.description}
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
var languages=['All', 'JavaScript', 'Html', 'CSS', 'Python', 'Ruby', 'Perl', 'Lua', 'C', 'C++', 'C#', 'Java', 'Scala', 'Go', 'Objective-C', 'Swift', 'CoffeeScript', 'PHP'];
var github_api_url = 'https://api.github.com/search/repositories?per_page=50&sort=stars&q='
ReactDOM.render(
	<Header languages={languages} url={github_api_url}/>,
	document.getElementById('content')
);