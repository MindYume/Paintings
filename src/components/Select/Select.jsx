import PropTypes, { arrayOf } from 'prop-types';

import './styles.css';
import React, { Component, createRef } from 'react';
import imgSelectArrow from '../../images/selectArrow.svg';

export default class Select extends Component {
  constructor(props) {
    super(props);

    this.buttonSelect = createRef();
    this.canvas = createRef();

    this.state = {
      selectValue: props.firstOption,
      isSelectOpen: false,
    };

    this.handleSelectOpen = this.handleSelectOpen.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentDidMount() {
    const selfState = this;
    document.addEventListener('mousedown', () => {
      if (selfState.canvas.current !== null
        && selfState.canvas.current.isMouseOut
        && selfState.canvas.current.isMouseOnSlectPanel === false) {
        selfState.setState({ isSelectOpen: false });
      }
    });

    this.buttonSelect.current.addEventListener('mouseover', () => {
      try {
        this.canvas.current.isMouseOnSlectPanel = true;
      } catch (ex) {
        // ...
      }
    });

    this.buttonSelect.current.addEventListener('mouseout', () => {
      try {
        this.canvas.current.isMouseOnSlectPanel = false;
      } catch (ex) {
        // ...
      }
    });
  }

  handleSelectOpen() {
    const { isSelectOpen } = this.state;
    const { options } = this.props;
    const { firstOption } = this.props;

    if (isSelectOpen) {
      this.setState({ isSelectOpen: false });
    } else {
      this.setState({ isSelectOpen: true });

      const reRenderCanvasInterval = setInterval(() => {
        if (this.canvas.current !== null) {
          this.startCanvas(options, firstOption);
          clearInterval(reRenderCanvasInterval);
        }
      }, 1);
    }
  }

  handleOptionClick(selectId, selectValue) {
    const { onChange } = this.props;
    const { firstOption } = this.props;

    onChange(`${selectId}`);
    if (selectValue.length > 0) {
      this.setState({ isSelectOpen: false, selectValue });
    } else {
      this.setState({ isSelectOpen: false, selectValue: firstOption });
    }
  }

  startCanvas(optionsInput, firstOption) {
    const { isDarkTheme } = this.props;
    const { type } = this.props;
    const { windowMode } = this.props;

    const canv = this.canvas.current;
    const ctx = canv.getContext('2d');

    canv.isStarted = true;
    canv.width = 1000;
    canv.options = [];
    canv.options = [{ id: '', name: firstOption, location: firstOption }].concat(optionsInput);
    canv.optionsAmount = canv.options.length;
    canv.optionsDrawAmount = 7;
    canv.optionsHeight = canv.width * 0.16;
    canv.optionsY = 0;
    canv.optionButtonPadding = canv.optionsHeight * 0.30;
    canv.optionButtonPaddingLeft = canv.width * 0.11;
    canv.isMouseDown = false;
    canv.isMouseDownPrevious = false;
    canv.isScrollEnable = true;
    canv.isMouseOut = true;
    canv.isMouseOnSlectPanel = true;
    canv.scrollbarWidth = canv.width * 0.05;
    canv.scrollButtonWidth = canv.scrollbarWidth * 0.6;
    canv.scrollFirstY = -1;
    canv.scrollValue = 0;
    canv.firstClick = '';
    canv.timeLast = new Date().getTime();
    canv.optionCurrentId = '';
    canv.optionCurrentName = '';
    canv.handleOption = false;

    canv.backgoundColor = 'rgb(255,255,255)';
    canv.textColor = 'rgb(0,0,0)';
    canv.backgoundColorHover = 'rgb(0,0,0)';
    canv.textColorHover = 'rgb(255,255,255)';

    if (isDarkTheme) {
      canv.backgoundColor = 'rgb(0,0,0)';
      canv.textColor = 'rgb(255,255,255)';
      canv.backgoundColorHover = 'rgb(255,255,255)';
      canv.textColorHover = 'rgb(0,0,0)';
    }

    if (windowMode === 'mobile_320') {
      canv.optionsDrawAmount = 10;
      canv.optionsHeight = canv.width * 0.154;
      canv.optionButtonPaddingLeft = canv.width * 0.11;
    } else if (windowMode === 'tab_768') {
      canv.optionsDrawAmount = 8;
      canv.optionsHeight = canv.width * 0.28;
      canv.optionButtonPaddingLeft = canv.width * 0.09;
    } else if (windowMode === 'tab_1024') {
      canv.optionsDrawAmount = 8;
      canv.optionsHeight = canv.width * 0.18;
      canv.optionButtonPaddingLeft = canv.width * 0.1;
    } else if (windowMode === 'desktop_1336') {
      canv.optionsDrawAmount = 7;
      canv.optionsHeight = canv.width * 0.16;
      canv.optionButtonPaddingLeft = canv.width * 0.084;
    }

    canv.optionButtonPadding = canv.optionsHeight * 0.30;

    const optionsListHeight = canv.optionsAmount * canv.optionsHeight + canv.optionsHeight * 0.20;
    if (canv.optionsAmount >= canv.optionsDrawAmount) {
      canv.height = canv.optionsDrawAmount * canv.optionsHeight;
    } else {
      canv.height = canv.optionsAmount * canv.optionsHeight;
    }

    let optionsWidnowHeight = canv.height;
    if (canv.height > optionsListHeight) {
      optionsWidnowHeight = optionsListHeight;
      canv.height = optionsListHeight;
    }

    canv.scrollButtonHeight = canv.height * (canv.height / optionsListHeight);
    canv.scrollButtonGap = canv.height - canv.scrollButtonHeight;
    canv.scrollButtonGapPrevious = 0;

    if (canv.scrollButtonHeight >= canv.height) {
      canv.isScrollEnable = false;
    }

    const drawOption = (nameInput, y, height, mouseX, mouseY, id, isAuthor) => {
      const { backgoundColorHover } = canv;
      const { textColorHover } = canv;

      let name = nameInput;

      const padding = canv.optionButtonPadding;
      let { backgoundColor } = canv;
      let { textColor } = canv;

      if (canv.firstClick !== 'scroll' && mouseX >= 0 && mouseY >= y && mouseY < y + height && (canv.isScrollEnable === false || mouseX < canv.width - canv.scrollbarWidth)) {
        textColor = textColorHover;
        backgoundColor = backgoundColorHover;

        if (canv.isMouseDown) {
          canv.optionCurrentId = id;
          canv.optionCurrentName = name;
        }
      }

      ctx.fillStyle = backgoundColor;
      ctx.fillRect(0, y, canv.width, height);

      if (isAuthor) {
        name = name.charAt(0) + name.slice(1, name.length).toLowerCase();
      }

      ctx.font = `600 ${height - padding * 2}px sans-serif`;
      if (ctx.measureText(name).width
      > ((canv.width - canv.optionButtonPaddingLeft) - canv.scrollbarWidth * 1.1)) {
        while (name.length > 0 && (ctx.measureText(`${name}...`).width) > ((canv.width - canv.optionButtonPaddingLeft) - canv.scrollbarWidth * 1.1)) {
          name = name.slice(0, name.length - 1);
        }

        name += '...';
      }

      ctx.fillStyle = textColor;
      ctx.fillText(name, canv.optionButtonPaddingLeft, y + height - padding - height / 9);
    };

    // Draw the scrollbar button
    const drawScrollButton = (btnX, btnY, btnWidth, btnHeight, color) => {
      const radius = btnWidth / 2;

      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = btnWidth;

      ctx.beginPath();
      ctx.moveTo(btnX + radius, btnY + radius);
      ctx.lineTo(btnX + radius, btnY + btnHeight - radius);
      ctx.stroke();

      ctx.arc(btnX + radius, btnY + radius, radius, 0, 2 * Math.PI);
      ctx.arc(btnX + radius, btnY + btnHeight - radius, radius, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawFrame = (mouseXInput, mouseYInput) => {
      const mouseX = mouseXInput / (canv.getBoundingClientRect().width / canv.width);
      const mouseY = mouseYInput / (canv.getBoundingClientRect().height / canv.height);

      if (canv.handleOption) {
        this.handleOptionClick(canv.optionCurrentId, canv.optionCurrentName);
        canv.optionCurrentId = '';
        canv.optionCurrentName = '';
        canv.handleOption = false;
      }

      if (canv.isMouseDown) {
        if (canv.firstClick === '') {
          if (canv.isScrollEnable) {
            if (mouseX < canv.width - canv.scrollbarWidth) {
              canv.firstClick = 'options';
            } else {
              canv.firstClick = 'scroll';
            }
          } else {
            canv.firstClick = 'options';
          }
        }
      } else {
        canv.firstClick = '';
      }

      if (canv.optionsY > 0) {
        canv.optionsY = 0;
        canv.scrollValue = 0;
      } else if (canv.optionsY < -optionsListHeight + optionsWidnowHeight) {
        canv.optionsY = -optionsListHeight + optionsWidnowHeight;
        canv.scrollValue = 1;
      }

      // Clear screen
      if (isDarkTheme) {
        ctx.fillStyle = 'rgb(0,0,0)';
      } else {
        ctx.fillStyle = 'rgb(255,255,255)';
      }
      ctx.fillRect(0, 0, canv.width, canv.height);

      // Draw options list
      for (let i = 0; i < canv.optionsAmount; i += 1) {
        if (type === 'authors') {
          drawOption(
            canv.options[i].name,
            canv.optionsY + i * canv.optionsHeight,
            canv.optionsHeight,
            mouseX,
            mouseY,
            canv.options[i].id,
            true,
          );
        } else {
          drawOption(
            canv.options[i].location,
            canv.optionsY + i * canv.optionsHeight,
            canv.optionsHeight,
            mouseX,
            mouseY,
            canv.options[i].id,
            false,
          );
        }
      }

      // Draw scrollbar button
      if (canv.isScrollEnable) {
        if (canv.firstClick === 'scroll') {
          if (canv.isMouseDownPrevious === false) {
            if (mouseY > canv.scrollButtonGap * canv.scrollValue
                && mouseY <= canv.scrollButtonGap * canv.scrollValue + canv.scrollButtonHeight) {
              canv.scrollFirstY = mouseY;
              canv.scrollButtonGapPrevious = canv.scrollButtonGap * canv.scrollValue;
            } else {
              canv.scrollFirstY = canv.scrollButtonHeight / 2
              + canv.scrollButtonGap * canv.scrollValue;
              canv.scrollButtonGapPrevious = canv.scrollButtonGap * canv.scrollValue;
            }
          }

          let scrollMove = mouseY - canv.scrollFirstY + canv.scrollButtonGapPrevious;

          if (scrollMove < 0) {
            scrollMove = 0;
          } else if (scrollMove > canv.scrollButtonGap) {
            scrollMove = canv.scrollButtonGap;
          }

          canv.scrollValue = scrollMove / (canv.scrollButtonGap + 0.00001);
          canv.optionsY = -canv.scrollValue * (optionsListHeight - optionsWidnowHeight);
        }
        drawScrollButton(canv.width - canv.scrollbarWidth, canv.scrollButtonGap * canv.scrollValue, canv.scrollButtonWidth, canv.scrollButtonHeight, 'rgb(123,123,123)');
      }
    };

    drawFrame(-1, 0);

    // Touch listeners

    canv.addEventListener('touchmove', (e) => {
      const touchX = e.changedTouches[0].clientX - canv.getBoundingClientRect().x;
      const touchY = e.changedTouches[0].clientY - canv.getBoundingClientRect().y;
      canv.isMouseOut = false;
      drawFrame(touchX, touchY);
    }, { passive: true });

    canv.addEventListener('touchstart', (e) => {
      const touchX = e.changedTouches[0].clientX - canv.getBoundingClientRect().x;
      const touchY = e.changedTouches[0].clientY - canv.getBoundingClientRect().y;

      canv.isMouseDown = true;
      drawFrame(touchX, touchY);

      canv.isMouseDownPrevious = true;

      document.addEventListener('touchend', () => {
        canv.isMouseDown = false;
        drawFrame(touchX, touchY);

        canv.isMouseDownPrevious = false;
      }, { once: true });
    }, { passive: true });

    // Mouse listeners

    canv.addEventListener('mousemove', (e) => {
      canv.isMouseOut = false;
      drawFrame(e.layerX, e.layerY);
    });

    canv.addEventListener('mousedown', (e) => {
      canv.isMouseDown = true;
      drawFrame(e.layerX, e.layerY);

      canv.isMouseDownPrevious = true;

      document.addEventListener('mouseup', () => {
        canv.isMouseDown = false;
        drawFrame(e.layerX, e.layerY);

        canv.isMouseDownPrevious = false;
      }, { once: true });
    });

    canv.addEventListener('mouseup', () => {
      if (canv.optionCurrentName.length > 0) {
        canv.handleOption = true;
      }
    });

    canv.addEventListener('mouseout', () => {
      canv.isMouseOut = true;
      canv.optionsCurrentY = canv.optionsY;
      drawFrame(-1, 0);
    });

    canv.addEventListener('wheel', (e) => {
      e.preventDefault(e.layerX, e.layerY);
      canv.optionsY -= e.deltaY;
      canv.scrollValue = -canv.optionsY / (optionsListHeight - optionsWidnowHeight);

      drawFrame(e.layerX, e.layerY);
    }, { passive: false });
  }

  render() {
    const { isSelectOpen } = this.state;
    const { selectValue } = this.state;
    const { isDarkTheme } = this.props;
    const { options } = this.props;
    const { firstOption } = this.props;

    let SelectStyle = 'Select';
    let ArrowUp = 'Arrow';
    let CanvasStyle = '';
    let LineStyle = 'Line';

    // const { isDarkTheme } = this.state;
    // const { selectValue } = this.state;
    // const { isSelectOpen } = this.state;
    // const { isSelectOpen } = this.state;
    // const { isSelectOpen } = this.state;
    // const { isSelectOpen } = this.state;

    if (isSelectOpen) {
      SelectStyle += ' SelectOpen';
      ArrowUp += ' ArrowUp';
    }

    if (isDarkTheme) {
      SelectStyle += ' SelectDark';
      ArrowUp += ' ArrowDark';
      LineStyle += ' LineDark';
      CanvasStyle = 'CanvasDark';
    }

    if (this.canvas.current !== null) {
      this.startCanvas(options, firstOption);
    }

    return (
      <div className="SelctPanel">
        <div ref={this.buttonSelect}>
          <button className={SelectStyle} onClick={this.handleSelectOpen.bind(this)} type="button">
            <div>{selectValue}</div>
            <img className={ArrowUp} src={imgSelectArrow} alt="" />
          </button>
        </div>
        {isSelectOpen
                && (
                <div className="OptionsPanel">
                  <div className={LineStyle} />
                  <canvas className={CanvasStyle} ref={this.canvas} />
                </div>
                )}
      </div>
    );
  }
}
Select.propTypes = {
  windowMode: PropTypes.string.isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  firstOption: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
  ).isRequired,
};
