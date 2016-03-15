'use strict';

var Header = React.createClass({
	displayName: 'Header',

	getInitialState: function getInitialState() {
		return {
			current_language: null
		};
	},

	handleClick: function handleClick(language, event) {
		if (language == 'All') {
			this.setState({ current_language: null });
			language = 'stars:>=0';
		} else {
			this.setState({ current_language: language });
		}
	},

	render: function render() {
		var list = this.props.languages.map(function (language) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ onClick: this.handleClick.bind(this, language) },
					language
				)
			);
		}, this);
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ className: 'header' },
				React.createElement(
					'h1',
					null,
					'Top 50 ',
					this.state.current_language,
					' Projects in ',
					React.createElement('i', { className: 'fa fa-github' }),
					'Github'
				),
				React.createElement(
					'ul',
					null,
					list
				)
			),
			React.createElement(
				'div',
				{ className: 'list' },
				React.createElement(RepoList, { current_language: this.state.current_language, url: this.props.url })
			)
		);
	}
});

var RepoList = React.createClass({
	displayName: 'RepoList',

	getInitialState: function getInitialState() {
		return {
			loading: true,
			error: null,
			data: null
		};
	},
	update: function update(current_language) {
		var _this = this;

		var temp;
		if (current_language) {
			temp = this.props.url + 'language:' + encodeURIComponent(current_language);
		} else {
			temp = this.props.url + 'stars:>=0';
		}
		$.getJSON(temp).then(function (value) {
			return _this.setState({ loading: false, data: value });
		}, function (error) {
			return _this.setState({ loading: false, error: error });
		});
	},
	componentDidMount: function componentDidMount() {
		this.update(this.props.current_language);
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({ loading: true });
		this.update(nextProps.current_language);
	},


	render: function render() {
		if (this.state.loading) {
			return React.createElement(
				'span',
				null,
				React.createElement('i', { className: 'fa fa-spinner fa-spin' }),
				' Loading...'
			);
		} else if (this.state.error !== null) {
			return React.createElement(
				'span',
				null,
				'Error: ',
				this.state.error.message
			);
		} else {
			var repos = this.state.data.items;
			var repoList = repos.map(function (repo) {
				return React.createElement(
					'div',
					null,
					React.createElement(
						'a',
						{ href: repo.html_url, target: '_blank' },
						React.createElement('img', { src: repo.owner.avatar_url })
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'p',
							null,
							React.createElement(
								'a',
								{ href: repo.html_url, target: '_blank' },
								repo.name
							),
							' (',
							React.createElement('i', { className: 'fa fa-star' }),
							repo.stargazers_count,
							'  ',
							React.createElement('i', { className: 'fa fa-code-fork' }),
							repo.forks_count,
							') ',
							repo.language ? React.createElement(
								'span',
								{ className: 'tag' },
								repo.language
							) : '',
							' ',
							React.createElement('br', null),
							React.createElement('br', null),
							' ',
							repo.description
						)
					)
				);
			});

			return React.createElement(
				'ul',
				null,
				repoList
			);
		}
	}
});

// https://api.github.com/search/repositories?q=javascript&per_page=50&sort=stars
var languages = ['All', 'JavaScript', 'Html', 'CSS', 'Python', 'Ruby', 'Perl', 'C', 'C++', 'C#', 'Java', 'Scala', 'Go', 'Objective-C', 'Swift', 'CoffeeScript'];
var github_api_url = 'https://api.github.com/search/repositories?per_page=50&sort=stars&q=';
ReactDOM.render(React.createElement(Header, { languages: languages, url: github_api_url }), document.getElementById('content'));