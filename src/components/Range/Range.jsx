import PropTypes from 'prop-types';

import './styles.css';
import React, { Component, createRef } from 'react';
import imgSelectArrow from '../../images/selectArrow.svg';

export default class Range extends Component {
  constructor(props) {
    super(props);

    this.RangePanel = createRef();

    this.state = {
      isFormEnable: false,
      isMouseOnButton: false,
      from: '',
      before: '',
    };

    this.onClick = this.onClick.bind(this);
    this.onSubmitRange = this.onSubmitRange.bind(this);
    this.handleInputFChange = this.handleInputFChange.bind(this);
    this.handleInputBChange = this.handleInputBChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', () => {
      const { isMouseOnButton } = this.state;
      const { isFormEnable } = this.state;
      if (isMouseOnButton === false && isFormEnable) {
        this.setState({ isFormEnable: false });
      }
    });

    this.RangePanel.current.addEventListener('mouseover', () => {
      this.setState({ isMouseOnButton: true });
    });

    this.RangePanel.current.addEventListener('mouseout', () => {
      this.setState({ isMouseOnButton: false });
    });
  }

  handleInputFChange(event) {
    this.setState({ from: event.target.value });
  }

  handleInputBChange(event) {
    this.setState({ before: event.target.value });
  }

  onClick() {
    const { isFormEnable } = this.state;

    if (isFormEnable) {
      this.setState({ isFormEnable: false });
    } else {
      this.setState({ isFormEnable: true });
    }
  }

  onSubmitRange(event) {
    event.preventDefault();
    const { onSubmit } = this.props;

    onSubmit(event.target.from.value, event.target.before.value);
  }

  render() {
    const { isFormEnable } = this.state;
    const { from } = this.state;
    const { before } = this.state;
    const { isDarkTheme } = this.props;
    const { windowMode } = this.props;

    let RangeButtonStyle = 'RangeButton';
    let ArrowStyle = 'Arrow';
    let RangeFormStyle = 'RangeForm';
    let LineStyle = 'RangeLine';
    let InputStyle = 'InputNum';

    if (isFormEnable) {
      RangeButtonStyle += ' RangeButtonOpen';
      ArrowStyle += ' ArrowUp';
    }

    if (isDarkTheme) {
      ArrowStyle += ' ArrowDark';
      RangeButtonStyle += ' RangeButtonDark';
      RangeFormStyle += ' RangeFormDark';
      LineStyle += ' RangeLineDark';
      InputStyle += ' InputNumDark';
    }

    if (windowMode === 'tab_1024') {
      RangeFormStyle += ' RangeTabStyle1';
      LineStyle += ' RangeLineTabStyle1';
    } else if (windowMode === 'tab_768') {
      RangeFormStyle += ' RangeTabStyle2';
      LineStyle += ' RangeLineTabStyle2';
    } else if (windowMode === 'mobile_320') {
      RangeFormStyle += ' RangeMobileStyle';
      LineStyle += ' RangeLineMobileStyle';
    }

    return (
      <div className="Range" ref={this.RangePanel}>
        <button type="button" className={RangeButtonStyle} onClick={this.onClick}>
          <div>Created</div>
          <img className={ArrowStyle} src={imgSelectArrow} alt="" />
        </button>
        {isFormEnable
            && (
            <form className={RangeFormStyle} onSubmit={this.onSubmitRange}>
              <input className={InputStyle} type="number" name="from" placeholder="from" value={from} onChange={this.handleInputFChange} />
              <div className={LineStyle} />
              <input className={InputStyle} type="number" name="before" placeholder="before" value={before} onChange={this.handleInputBChange} />
              <input type="submit" />
            </form>
            )}
      </div>
    );
  }
}
Range.propTypes = {
  isDarkTheme: PropTypes.bool.isRequired,
  windowMode: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
