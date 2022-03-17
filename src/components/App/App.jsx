import './styles.css';

import axios from 'axios';
import React, { Component } from 'react';
import imgLogoLight from '../../images/Logo_light.png';
import imgLogoDark from '../../images/Logo_dark.png';
import imgLight from '../../images/Light.png';
import imgDark from '../../images/Dark.png';

import Image from '../Image/Image';
import PaginationPanel from '../PaginationPanel/PaginationPanel';
import InputName from '../InputName/InputName';
import Select from '../Select/Select';
import Range from '../Range/Range';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkTheme: false,
      windowMode: 'desktop_1336',
      pagesAmount: 4,
      paintingsPerPage: 9,
      page: 1,
      images: [],
      authors: [],
      locations: [],
      filterName: '',
      fifilterAuthorId: '',
      filterLocationId: '',
      filterFrom: '',
      filterBefore: '',
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.setPagesAmount = this.setPagesAmount.bind(this);
    this.handleFilterNameChange = this.handleFilterNameChange.bind(this);
    this.handleFilterAuthorChange = this.handleFilterAuthorChange.bind(this);
    this.handleFilterLocationChange = this.handleFilterLocationChange.bind(this);
    this.handleFilterDateChange = this.handleFilterDateChange.bind(this);
    this.onLightClick = this.onLightClick.bind(this);
    this.loadFilters = this.loadFilters.bind(this);
  }

  componentDidMount() {
    axios.get('https://test-front.framework.team/authors')
      .then((response1) => {
        axios.get('https://test-front.framework.team/locations')
          .then((response2) => {
            this.setState({
              authors: response1.data,
              locations: response2.data,
            });

            this.handlePageChange(1, {}, {
              authors: response1.data,
              locations: response2.data,
            });
            this.onWindowSizeChange();
            window.addEventListener('resize', this.onWindowSizeChange.bind(this));
          });
      });
  }

  handlePageChange(pageNumber, filter = {}, additionalInfo = {}) {
    if (typeof (pageNumber) === 'number') {
      const filterUrls = this.loadFilters(filter);

      let authorsData = [];
      let locationsData = [];
      let paintingsPerPageUrl = 0;

      const { authors } = this.state;
      const { locations } = this.state;
      const { paintingsPerPage } = this.state;

      if (typeof (additionalInfo.authors) === 'undefined') {
        if (authors.length > 0) {
          authorsData = authors;
        }
      } else if (additionalInfo.authors.length > 0) {
        authorsData = additionalInfo.authors;
      }

      if (typeof (additionalInfo.locations) === 'undefined') {
        if (locations.length > 0) {
          locationsData = locations;
        }
      } else if (additionalInfo.locations.length > 0) {
        locationsData = additionalInfo.locations;
      }

      if (typeof (additionalInfo.paintingsPerPage) === 'undefined') {
        paintingsPerPageUrl = paintingsPerPage;
      } else {
        paintingsPerPageUrl = additionalInfo.paintingsPerPage;
      }

      axios.get(`https://test-front.framework.team/paintings?_page=${pageNumber}&_limit=${paintingsPerPageUrl}${filterUrls.filterNameUrl}${filterUrls.filterAuthorUrl}${filterUrls.filterLocationUrl}${filterUrls.filterFromUrl}${filterUrls.filterBeforeUrl}`)
        .then((response) => {
          const imagesData = response.data;
          const images = [];
          for (let i = 0; i < imagesData.length; i += 1) {
            let authorName = '';
            let location = '';
            if (authorsData.length > 0) {
              authorName = authorsData[imagesData[i].authorId - 1].name;
            }

            if (locationsData.length > 0) {
              location = locationsData[imagesData[i].locationId - 1].location;
            }

            images.push(<Image name={imagesData[i].name} authorName={authorName} created={imagesData[i].created} location={location} imageUrl={`https://test-front.framework.team${imagesData[i].imageUrl}`} key={i + 1} />);
          }

          this.setState({
            page: pageNumber,
            images,
          });
        });
    }
  }

  handleFilterNameChange(filterName) {
    const { paintingsPerPage } = this.state;

    this.handlePageChange(1, { name: filterName });
    this.setState({ filterName });
    this.setPagesAmount(paintingsPerPage, { name: filterName });
  }

  handleFilterAuthorChange(fifilterAuthorId) {
    const { paintingsPerPage } = this.state;

    this.handlePageChange(1, { authorId: fifilterAuthorId });
    this.setState({ fifilterAuthorId });
    this.setPagesAmount(paintingsPerPage, { authorId: fifilterAuthorId });
  }

  handleFilterLocationChange(filterLocationId) {
    const { paintingsPerPage } = this.state;

    this.handlePageChange(1, { locationId: filterLocationId });
    this.setState({ filterLocationId });
    this.setPagesAmount(paintingsPerPage, { locationId: filterLocationId });
  }

  handleFilterDateChange(from, before) {
    const { paintingsPerPage } = this.state;

    this.handlePageChange(1, { from, before });
    this.setState({ filterFrom: from, filterBefore: before });
    this.setPagesAmount(paintingsPerPage, { from, before });
  }

  onLightClick() {
    const { isDarkTheme } = this.state;
    if (isDarkTheme) {
      this.setState({ isDarkTheme: false });
      document.documentElement.style.setProperty('background-color', 'white');
    } else {
      this.setState({ isDarkTheme: true });
      document.documentElement.style.setProperty('background-color', 'black');
    }
  }

  onWindowSizeChange() {
    const { windowMode } = this.state;

    if (windowMode !== 'mobile_320' && window.innerWidth <= 767) {
      this.setPagesAmount(6, {});
      this.setState({
        windowMode: 'mobile_320',
        paintingsPerPage: 6,
      });

      document.documentElement.style.setProperty('--filter-grid-columns', '1fr');
      document.documentElement.style.setProperty('--image-grid-columns', '1fr');
      document.documentElement.style.setProperty('--app-width', '90%');
      document.documentElement.style.setProperty('--logo-width', '34%');
      document.documentElement.style.setProperty('--light-width', '10%');

      this.handlePageChange(1);
    } else if (windowMode !== 'tab_768' && window.innerWidth >= 768 && window.innerWidth <= 1023) {
      this.setPagesAmount(8, {});
      this.setState({
        windowMode: 'tab_768',
        paintingsPerPage: 8,
      });

      document.documentElement.style.setProperty('--filter-grid-columns', '1fr 1fr 1fr 1fr');
      document.documentElement.style.setProperty('--image-grid-columns', '1fr 1fr');
      document.documentElement.style.setProperty('--app-width', '90%');
      document.documentElement.style.setProperty('--logo-width', '17%');
      document.documentElement.style.setProperty('--light-width', '5%');

      this.handlePageChange(1);
    } else if (windowMode !== 'tab_1024' && window.innerWidth >= 1024 && window.innerWidth <= 1365) {
      this.setPagesAmount(9, {});
      this.setState({
        windowMode: 'tab_1024',
        paintingsPerPage: 9,
      });

      document.documentElement.style.setProperty('--filter-grid-columns', '1fr 1fr 1fr 1fr');
      document.documentElement.style.setProperty('--image-grid-columns', '1fr 1fr 1fr');
      document.documentElement.style.setProperty('--app-width', '90%');
      document.documentElement.style.setProperty('--logo-width', '13%');
      document.documentElement.style.setProperty('--light-width', '4%');

      this.handlePageChange(1);
    } else if (windowMode !== 'desktop_1336' && window.innerWidth >= 1366) {
      this.setPagesAmount(9, {});

      this.setState({
        windowMode: 'desktop_1336',
        paintingsPerPage: 9,
      });

      document.documentElement.style.setProperty('--filter-grid-columns', '1fr 1fr 1fr 1fr');
      document.documentElement.style.setProperty('--image-grid-columns', '1fr 1fr 1fr');
      document.documentElement.style.setProperty('--app-width', '1336px');
      document.documentElement.style.setProperty('--logo-width', '10%');
      document.documentElement.style.setProperty('--light-width', '3%');

      this.handlePageChange(1);
    }
  }

  setPagesAmount(paintingsPerPage, filter = {}) {
    const filterUrls = this.loadFilters(filter);

    axios.get(`https://test-front.framework.team/paintings?${filterUrls.filterNameUrl}${filterUrls.filterAuthorUrl}${filterUrls.filterLocationUrl}${filterUrls.filterFromUrl}${filterUrls.filterBeforeUrl}`)
      .then((response) => {
        const paintingAmount = response.data.length;
        let pagesAmount = Math.floor(paintingAmount / paintingsPerPage);

        if (paintingAmount % paintingsPerPage > 0) {
          pagesAmount += 1;
        }

        this.setState({ pagesAmount });
      });
  }

  /*
    Данная функия проверяет, уазан ли какой-либо фильтр в параметрах функции,
    и, если не указан, загружает фильтр из this.state
  */
  loadFilters(filter = {}) {
    const filterUrls = {
      filterNameUrl: '',
      filterAuthorUrl: '',
      filterLocationUrl: '',
      filterFromUrl: '',
      filterBeforeUrl: '',
    };

    const { filterName } = this.state;
    const { fifilterAuthorId } = this.state;
    const { filterLocationId } = this.state;
    const { filterFrom } = this.state;
    const { filterBefore } = this.state;

    if (typeof (filter.name) === 'undefined') {
      if (filterName.length > 0) {
        filterUrls.filterNameUrl = `&name=${filterName}`;
      }
    } else if (filter.name.length > 0) {
      filterUrls.filterNameUrl = `&name=${filter.name}`;
    }

    if (typeof (filter.authorId) === 'undefined') {
      if (fifilterAuthorId.length > 0) {
        filterUrls.filterAuthorUrl = `&authorId=${fifilterAuthorId}`;
      }
    } else if (filter.authorId.length > 0) {
      filterUrls.filterAuthorUrl = `&authorId=${filter.authorId}`;
    }

    if (typeof (filter.locationId) === 'undefined') {
      if (filterLocationId.length > 0) {
        filterUrls.filterLocationUrl = `&locationId=${filterLocationId}`;
      }
    } else if (filter.locationId.length > 0) {
      filterUrls.filterLocationUrl = `&locationId=${filter.locationId}`;
    }

    if (typeof (filter.from) === 'undefined') {
      if (filterFrom.length > 0) {
        filterUrls.filterFromUrl = `&created_gte=${filterFrom}`;
      }
    } else if (filter.from.length > 0) {
      filterUrls.filterFromUrl = `&created_gte=${filter.from}`;
    }

    if (typeof (filter.before) === 'undefined') {
      if (filterBefore.length > 0) {
        filterUrls.filterBeforeUrl = `&created_lte=${filterBefore}`;
      }
    } else if (filter.before.length > 0) {
      filterUrls.filterBeforeUrl = `&created_lte=${filter.before}`;
    }

    return filterUrls;
  }

  render() {
    const { isDarkTheme } = this.state;
    const { pagesAmount } = this.state;
    const { page } = this.state;
    const { authors } = this.state;
    const { locations } = this.state;
    const { windowMode } = this.state;
    const { images } = this.state;

    return (
      <div className="App">

        <div className="AppPanel">

          {isDarkTheme
            ? (
              <div className="HeadPanel">
                <img className="Logo" src={imgLogoDark} alt="" />
                <button className="LightButton" onClick={this.onLightClick} type="button">
                  <img src={imgDark} alt="" />
                </button>
                <style type="text/css" />
              </div>
            )
            : (
              <div className="HeadPanel">
                <img className="Logo" src={imgLogoLight} alt="" />
                <button className="LightButton" onClick={this.onLightClick} type="button">
                  <img src={imgLight} alt="" />
                </button>
              </div>
            )}
          <div className="FilterPanel">

            <InputName
              isDarkTheme={isDarkTheme}
              onSubmit={this.handleFilterNameChange}
            />
            <Select
              windowMode={windowMode}
              isDarkTheme={isDarkTheme}
              firstOption="Author"
              type="authors"
              options={authors}
              onChange={this.handleFilterAuthorChange}
            />
            <Select
              windowMode={windowMode}
              isDarkTheme={isDarkTheme}
              firstOption="Locations"
              type="locations"
              options={locations}
              onChange={this.handleFilterLocationChange}
            />

            <Range
              windowMode={windowMode}
              isDarkTheme={isDarkTheme}
              onSubmit={this.handleFilterDateChange}
            />

          </div>
          <div className="ImagePanel">
            {images.map((image) => (
              image
            ))}
          </div>
          <div className="PaginationPanel">
            <PaginationPanel
              windowMode={windowMode}
              isDarkTheme={isDarkTheme}
              pagesAmount={pagesAmount}
              currentPage={page}
              onChange={this.handlePageChange}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default App;
