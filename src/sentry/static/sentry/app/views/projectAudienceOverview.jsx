import React from 'react';
import {Link} from 'react-router';

import ApiMixin from '../mixins/apiMixin';
import countryCodes from '../utils/countryCodes';
import GeoMap from '../components/geoMap';
import LoadingError from '../components/loadingError';
import LoadingIndicator from '../components/loadingIndicator';

const UsersAffectedList = React.createClass({
  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId} = this.props.params;
    return `/projects/${orgId}/${projectId}/users/?per_page=10`;
  },

  getDisplayName(user) {
    return (
      user.username ||
      user.email ||
      user.identifier ||
      `${user.ipAddress} (anonymous)`
    );
  },

  render() {
    if (this.state.loading)
      return <div className="box"><LoadingIndicator /></div>;
    else if (this.state.error)
      return <LoadingError onRetry={this.fetchData} />;

    let {orgId, projectId} = this.props.params;
    return (
      <ul>
        {this.state.data.map((user) => {
          let link = `/${orgId}/${projectId}/audience/users/${user.hash}/`;
          return (
            <li key={user.id}>
              <img src={user.avatarUrl} />
              <Link to={link}>{this.getDisplayName(user)}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
});

const UsersAffectedChart = React.createClass({
  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId} = this.props.params;
    return `/projects/${orgId}/${projectId}/user-stats/`;
  },

  render() {
    if (this.state.loading)
      return <div className="box"><LoadingIndicator /></div>;
    else if (this.state.error)
      return <LoadingError onRetry={this.fetchData} />;

    return (
      <div>
        STATS
      </div>
    );
  },
});

const LocationsMap = React.createClass({
  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId} = this.props.params;
    return `/projects/${orgId}/${projectId}/locations/`;
  },

  render() {
    if (this.state.loading)
      return <div className="box"><LoadingIndicator /></div>;
    else if (this.state.error)
      return <LoadingError onRetry={this.fetchData} />;

    let series = this.state.data.map(t => [countryCodes[t.value], t.count]);
    let {highlight} = this.props.location.query;
    if (highlight) {
      highlight = countryCodes[highlight];
    }
    return (
      <GeoMap highlightCountryCode={highlight} series={series} height={200} />
    );
  },
});

const Feedback = React.createClass({
  mixins: [ApiMixin],

  getInitialState() {
    return {
      loading: true,
      error: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId} = this.props.params;
    return `/projects/${orgId}/${projectId}/user-feedback/?per_page=10`;
  },

  render() {
    if (this.state.loading)
      return <div className="box"><LoadingIndicator /></div>;
    else if (this.state.error)
      return <LoadingError onRetry={this.fetchData} />;

    let {orgId, projectId} = this.props.params;
    return (
      <ul>
        {this.state.data.map((user) => {
          let link = `/${orgId}/${projectId}/audience/users/${user.hash}/`;
          return (
            <li key={user.id}>
              avatar
              <Link to={link}>{user.name || user.email || <em>Anonymous</em>}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
});

export default React.createClass({
  render() {
    return (
      <div style={{
          overflow: 'hidden',
      }}>
        <div style={{marginTop: -110, position: 'relative'}}>
          <LocationsMap {...this.props} />
        </div>
        <div style={{padding: '20px 30px 0', borderTop: '1px solid #ccc',  marginTop: -180, background: '#fff', opacity: 0.8}}>
          <div className="row">
            <div className="col-md-8">
              <h5>Users Affected</h5>
              <UsersAffectedChart {...this.props} />
              <UsersAffectedList {...this.props} />
            </div>
            <div className="col-md-4">
              <h5>Feedback</h5>
              <Feedback {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
