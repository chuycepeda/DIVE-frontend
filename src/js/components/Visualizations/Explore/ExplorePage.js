import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { setExploreQueryString } from '../../../actions/VisualizationActions';

import styles from '../Visualizations.sass';
import ExploreSidebar from './ExploreSidebar';
import ExploreView from './ExploreView';

class ExplorePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uniqueSpecVisualizationTypes: [],
      visualizationTypes: []
    }
  }

  componentWillMount() {
    this.props.setExploreQueryString(this.props.location.query);
    this.setState({
      uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(this.props.specs)
    }, () => this.updateVisualizationTypes(this.props.filters.visualizationTypes));
  }

  componentWillReceiveProps(nextProps) {
    const { location, specs, filters, setExploreQueryString } = nextProps;

    if (location.query !== this.props.location.query) {
      setExploreQueryString(location.query);
    }

    if (specs.updatedAt != this.props.specs.updatedAt || filters.updatedAt != this.props.filters.updatedAt) {
      this.setState({
        uniqueSpecVisualizationTypes: this.getUniqueSpecVisualizationTypes(specs)
      }, () => this.updateVisualizationTypes(filters.visualizationTypes));
    }
  }

  updateVisualizationTypes = (visualizationTypes) => {
    this.setState({
      visualizationTypes: this.getFilteredVisualizationTypes(visualizationTypes)
    });
  }

  getUniqueSpecVisualizationTypes = (specs) => {
    const allSpecVisualizationTypes = specs.items
      .map((s) => s.vizTypes);

    if (allSpecVisualizationTypes.length) {
      const uniqueSpecVisualizationTypes = allSpecVisualizationTypes.reduce((previousVizTypes, currentVizTypes) => [ ...previousVizTypes, ...currentVizTypes ]);
      return [ ...new Set(uniqueSpecVisualizationTypes) ];
    }

    return [];
  }

  getFilteredVisualizationTypes = (visualizationTypes) => {
    return visualizationTypes
      .map((filter) =>
        new Object({
          ...filter,
          disabled: this.state.uniqueSpecVisualizationTypes.indexOf(filter.type) == -1
        })
      );
  }

  render() {
    const { projectTitle } = this.props;

    var queryFields = [];
    if (this.props.location.query['fields[]']) {
      if (Array.isArray(this.props.location.query['fields[]'])) {
        queryFields = this.props.location.query['fields[]'];
      } else {
        queryFields = [this.props.location.query['fields[]']];
      }
    }

    const visualizationTypeObjects = this.state.visualizationTypes;
    const filteredVisualizationTypes = visualizationTypeObjects
      .filter((visualizationTypeObject) => visualizationTypeObject.selected);

    const visualizationTypes = (filteredVisualizationTypes.length ? filteredVisualizationTypes : visualizationTypeObjects)
      .map((visualizationTypeObject) => visualizationTypeObject.type);

    return (
      <DocumentTitle title={ 'Explore' + ( projectTitle ? ` | ${ projectTitle }` : '' ) }>
        <div className={ `${ styles.fillContainer } ${ styles.galleryContainer }` }>
          <ExploreView filteredVisualizationTypes={ visualizationTypes } />
          <ExploreSidebar filteredVisualizationTypes={ visualizationTypes } visualizationTypes={ visualizationTypeObjects } queryFields={ queryFields }/>
          { this.props.children }
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state) {
  const { project, filters, specs } = state;
  return { projectTitle: project.properties.title, filters, specs };
}

export default connect(mapStateToProps, { setExploreQueryString })(ExplorePage);