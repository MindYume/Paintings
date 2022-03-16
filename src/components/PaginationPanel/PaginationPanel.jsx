import PropTypes from 'prop-types';

import './styles.css';
import React, { Component } from 'react';
import imgArrowL from '../../images/arrowL.svg';
import imgArrowR from '../../images/arrowR.svg';
import imgDoubleArrowL from '../../images/doubleArrowL.svg';
import imgDoubleArrowR from '../../images/doubleArrowR.svg';

export default class PaginationPanel extends Component {
  constructor(props) {
    super(props);

    this.isLeftArrowsDisabled = this.isLeftArrowsDisabled.bind(this);
    this.isRightArrowsDisabled = this.isRightArrowsDisabled.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(page) {
    const { onChange } = this.props;

    onChange(page);
  }

  isLeftArrowsDisabled() {
    const { currentPage } = this.props;

    if (currentPage <= 1) {
      return true;
    }

    return false;
  }

  isRightArrowsDisabled() {
    const { currentPage } = this.props;
    const { pagesAmount } = this.props;

    if (currentPage >= pagesAmount) {
      return true;
    }

    return false;
  }

  render() {
    const { currentPage } = this.props;
    const { pagesAmount } = this.props;
    const { isDarkTheme } = this.props;

    let PaginationButtonStyle = 'PaginationButton';
    let ActiveButtonStyle = 'ActiveButton';

    if (isDarkTheme) {
      PaginationButtonStyle += ' PaginationButtonDark';
      ActiveButtonStyle += ' ActiveButtonDark';
    }

    let buttonFirst = 0;
    let buttonsNum = 0;
    const buttons = [];

    if (currentPage === pagesAmount) {
      buttonFirst = currentPage - 2;
    } else {
      buttonFirst = currentPage - 1;
    }

    if (buttonFirst < 1) {
      buttonFirst = 1;
    }

    if (pagesAmount > 0) {
      if (pagesAmount >= 3) {
        buttonsNum = 3;
      } else {
        buttonsNum = pagesAmount;
      }
    }

    let buttonStyle = {};
    let paginationStyle = {};

    const { windowMode } = this.props;
    if (windowMode === 'mobile_320') {
      buttonStyle = {
        width: '100%',
        height: `${(window.innerWidth * 0.8) / 7}px`,
        fontSize: `${(window.innerWidth * 0.8) / 15}px`,
      };

      paginationStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
      };
    }

    for (let i = 0; i < buttonsNum; i += 1) {
      if (buttonFirst + i === currentPage) {
        buttons.push(
          <button
            type="button"
            className={ActiveButtonStyle}
            onClick={this.onClick.bind(this, buttonFirst + i)}
            key={i + 1}
            style={buttonStyle}
          >
            {buttonFirst + i}
          </button>,
        );
      } else {
        buttons.push(
          <button
            type="button"
            className={PaginationButtonStyle}
            onClick={this.onClick.bind(this, buttonFirst + i)}
            key={i + 1}
            style={buttonStyle}
          >
            {buttonFirst + i}
          </button>,
        );
      }
    }

    return (
      <div className="Pagination" style={paginationStyle}>
        <button
          type="button"
          className={`${PaginationButtonStyle} DoubleArrowL`}
          disabled={this.isLeftArrowsDisabled()}
          onClick={this.onClick.bind(this, 1)}
          style={buttonStyle}
        >
          <img src={imgDoubleArrowL} alt="" />
        </button>
        <button
          type="button"
          className={PaginationButtonStyle}
          disabled={this.isLeftArrowsDisabled()}
          onClick={this.onClick.bind(this, currentPage - 1)}
          style={buttonStyle}
        >
          <img src={imgArrowL} alt="" />
        </button>

        {buttons.map((button) => (
          button
        ))}

        <button
          type="button"
          className={PaginationButtonStyle}
          disabled={this.isRightArrowsDisabled()}
          onClick={this.onClick.bind(this, currentPage + 1)}
          style={buttonStyle}
        >
          <img src={imgArrowR} alt="" />
        </button>
        <button
          type="button"
          className={`${PaginationButtonStyle} DoubleArrowR`}
          disabled={this.isRightArrowsDisabled()}
          onClick={this.onClick.bind(this, pagesAmount)}
          style={buttonStyle}
        >
          <img src={imgDoubleArrowR} alt="" />
        </button>

      </div>
    );
  }
}
PaginationPanel.propTypes = {
  windowMode: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  pagesAmount: PropTypes.number.isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
