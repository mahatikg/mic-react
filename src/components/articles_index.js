import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import {Icon} from 'react-fa'
import * as actions from '../actions'


class ArticlesIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = { limit: 10, showMore: true, sort: true, fetchMore: false }
    this.showMore = this.showMore.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.sortWordsLow = this.sortWordsLow.bind(this)
    this.sortSubmittedLow = this.sortSubmittedLow.bind(this)
    this.sortWordsHigh = this.sortWordsHigh.bind(this)
    this.sortSubmittedHigh = this.sortSubmittedHigh.bind(this)
  }

  showMore() {
    if (this.state.limit >= this.props.articles.length && !this.state.fetchMore) {
      this.props.actions.addMoreArticles()
      this.setState({
        fetchMore: true
      })
    }
    this.setState({
      limit: this.state.limit + 10,
      showMore: (this.state.limit < this.props.articles.length)
    });
  }

  renderButton() {
    if (!this.state.showMore && (this.state.fetchMore && (this.state.limit >= this.props.articles.length))) return null;
    return (
      <button className="btn btn-default btn-block" onClick={this.showMore}>Load More</button>
    );
  };

  sortWordsLow() {
    this.props.articles.sort(sortBy('words', false, parseInt))
    sessionStorage.setItem('column', 'words')
    sessionStorage.setItem('reverse', '')
    this.forceUpdate()
  }

  sortSubmittedLow() {
    this.props.articles.sort(sortBy('publish_at', false))
    sessionStorage.setItem('column', 'publish_at')
    sessionStorage.setItem('reverse', '')
    this.forceUpdate()
  }

  sortWordsHigh() {
    this.props.articles.sort(sortBy('words', true, parseInt))
    sessionStorage.setItem('column', 'words')
    sessionStorage.setItem('reverse', 'true')
    this.forceUpdate()
  }

  sortSubmittedHigh() {
    this.props.articles.sort(sortBy('publish_at', true))
    sessionStorage.setItem('column', 'publish_at')
    sessionStorage.setItem('reverse', 'true')
    this.forceUpdate()
  }

  render() {

    var articles = this.props.articles.slice(0,this.state.limit);

    return (
      <div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered sortable">
            <thead>
              <tr className="table-header vert-align-mid-head">
                <th><br/>UNPUBLISHED ARTICLES ({this.props.articles.length})<br/><br/></th>
                <th>AUTHOR<br/><br/></th>
                <th>WORDS
                  <span onClick={this.sortWordsLow}> <Icon name="caret-up" /></span>
                  <span onClick={this.sortWordsHigh}> <Icon name="caret-down" /></span><br/><br/></th>
                <th>SUBMITTED
                  <span onClick={this.sortSubmittedLow}> <Icon name="caret-up" /></span>
                  <span onClick={this.sortSubmittedHigh}> <Icon name="caret-down" /></span><br/><br/></th>
              </tr>
            </thead>
            <tbody>

              {articles.map((article) =>
                <tr>
                  <td className="article-cell">
                    <div>
                      <img className="article-avatar" src={article.image}/>
                      <a href= {article.url} target="_blank"> {article.title} </a>
                    </div>
                    { article.bootcamp ? <div className="bootcamp">Bootcamp</div> : null }
                  </td>
                  <td className="author-name vert-align-mid">{article.profile.first_name} {article.profile.last_name}</td>
                  <td className="text-center vert-align-mid">{article.words}</td>
                  <td className="text-center vert-align-mid">{ moment(article.publish_at).fromNow() }</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        { this.renderButton() }

      </div>
    )
  }
};

var sortBy = function(field, reverse, primer){
  var key = primer ?
  function(x) {return primer(x[field])} :
  function(x) {return x[field]};
  reverse = !reverse ? 1 : -1;
  return function (a, b) {
    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
  }
}

function mapStateToProps(state){
  var sortColumn = sessionStorage.getItem('column')
  var reversed = !!sessionStorage.getItem('reverse')
  var int = sessionStorage.getItem('column') == 'words' ? parseInt : null
  return {
    articles: state.articles.sort(sortBy(sortColumn, reversed, int))
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

const componentCreator = connect(mapStateToProps, mapDispatchToProps)
export default componentCreator(ArticlesIndex);
