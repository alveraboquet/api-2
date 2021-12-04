// original: https://gist.github.com/pingpoli/ea558dd154fa9668b8e924c2a4d32faf

import { registerFont } from 'canvas';

registerFont('assets/fonts/Hack-Bold.ttf', { family: 'Hack Bold' });

export default class CandlestickChart {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.width = parseInt(this.canvas.width);
    this.height = parseInt(this.canvas.height);
    this.context = this.canvas.getContext('2d');

    this.title = options.title;
    this.context.font = `18px Hack Bold`;
    this.bgColor = '#fff9f4';
    this.gridColor = '#f5efeb';
    this.textColor = '#000000';
    this.wickColor = '#000000';
    this.greenColor = '#fff9f4';
    this.redColor = '#000000';
    this.bodyStrokeColor = '#000000';

    this.context.lineWidth = 2;
    this.candleWidth = 4;

    this.marginLeft = 26;
    this.marginRight = 120;
    this.marginTop = 100;
    this.marginBottom = 70;

    this.yStart = 0;
    this.yEnd = 0;
    this.yRange = 0;
    this.yPixelRange = this.height - this.marginTop - this.marginBottom;

    this.xStart = 0;
    this.xEnd = 0;
    this.xRange = 0;
    this.xPixelRange = this.width - this.marginLeft - this.marginRight;

    // these are only approximations, the grid will be divided in a way so the numbers are nice
    this.xGridCells = 12;
    this.yGridCells = 12;

    this.candlesticks = [];
  }

  addCandlestick = function (candlestick) {
    this.candlesticks.push(candlestick);
  };

  draw = function () {
    // bg
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(0, 0, this.width, this.height);

    this.calculateYRange();
    this.calculateXRange();

    this.drawGrid();

    this.candleWidth = this.xPixelRange / this.candlesticks.length;
    this.candleWidth -= 4; // space between candle is nice
    if (this.candleWidth % 2 == 0) this.candleWidth--;

    for (var i = 0; i < this.candlesticks.length; ++i) {
      var color =
        this.candlesticks[i].close > this.candlesticks[i].open
          ? this.greenColor
          : this.redColor;

      // draw the wick
      this.drawLine(
        this.xToPixelCoords(this.candlesticks[i].timestamp),
        this.yToPixelCoords(this.candlesticks[i].low),
        this.xToPixelCoords(this.candlesticks[i].timestamp),
        this.yToPixelCoords(this.candlesticks[i].high),
        this.wickColor,
      );

      let candleHeight =
        this.yToPixelCoords(this.candlesticks[i].close) -
        this.yToPixelCoords(this.candlesticks[i].open);
      if (candleHeight > 0) {
        candleHeight = Math.max(candleHeight, 1);
      } else {
        candleHeight = Math.min(candleHeight, -1);
      }

      // draw the candle
      this.fillRect(
        this.xToPixelCoords(this.candlesticks[i].timestamp) -
          Math.floor(this.candleWidth / 2),
        this.yToPixelCoords(this.candlesticks[i].open),
        this.candleWidth - 1,
        candleHeight,
        color,
      );

      // draw the candle
      this.drawRect(
        this.xToPixelCoords(this.candlesticks[i].timestamp) -
          Math.floor(this.candleWidth / 2),
        this.yToPixelCoords(this.candlesticks[i].open),
        this.candleWidth - 1,
        candleHeight,
        this.bodyStrokeColor,
      );

      // last line
      if (i === this.candlesticks.length - 1) {
        const priceLineY = this.yToPixelCoords(this.candlesticks[i].close);
        this.context.beginPath();
        this.context.setLineDash([2, 2]);
        this.context.moveTo(0, priceLineY);
        this.context.lineTo(this.width, priceLineY);
        this.context.stroke();
      }
    }
  };

  drawGrid = function () {
    // roughly divide the yRange into cells
    var yGridSize = this.yRange / this.yGridCells;

    // try to find a nice number to round to
    var niceNumber = Math.pow(10, Math.ceil(Math.log10(yGridSize)));
    if (yGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
    else if (yGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;

    // find next largest nice number above yStart
    var yStartRoundNumber = Math.ceil(this.yStart / niceNumber) * niceNumber;
    // find next lowest nice number below yEnd
    var yEndRoundNumber = Math.floor(this.yEnd / niceNumber) * niceNumber;

    for (var y = yStartRoundNumber; y <= yEndRoundNumber; y += niceNumber) {
      this.drawLine(
        0,
        this.yToPixelCoords(y),
        this.width,
        this.yToPixelCoords(y),
        this.gridColor,
      );
      const text = `$${this.roundPriceValue(y)}`;
      var textWidth = this.context.measureText(text).width;
      this.context.fillStyle = this.textColor;
      this.context.fillText(
        text,
        this.width - textWidth - 20,
        this.yToPixelCoords(y) - 5,
      );
    }

    // roughly divide the xRange into cells
    var xGridSize = this.xRange / this.xGridCells;

    // try to find a nice number to round to
    niceNumber = Math.pow(10, Math.ceil(Math.log10(xGridSize)));
    if (xGridSize < 0.25 * niceNumber) niceNumber = 0.25 * niceNumber;
    else if (xGridSize < 0.5 * niceNumber) niceNumber = 0.5 * niceNumber;

    // find next largest nice number above yStart
    var xStartRoundNumber = Math.ceil(this.xStart / niceNumber) * niceNumber;
    // find next lowest nice number below yEnd
    var xEndRoundNumber = Math.floor(this.xEnd / niceNumber) * niceNumber;

    let previousDay = null;
    for (var x = xStartRoundNumber; x <= xEndRoundNumber; x += niceNumber) {
      this.drawLine(
        this.xToPixelCoords(x),
        0,
        this.xToPixelCoords(x),
        this.height,
        this.gridColor,
      );
      var date = new Date(x);
      var dateStr = '';

      this.context.fillStyle = this.textColor;
      if (previousDay && previousDay !== date.getDate()) {
        var day = date.getDate();
        if (day < 10) day = '0' + day;
        var month = date.getMonth() + 1;
        if (month < 10) month = '0' + month;
        dateStr = day + '/' + month;
        previousDay = date.getDate();
      } else {
        var minutes = date.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        var hours = date.getHours();
        if (hours < 10) hours = '0' + hours;
        dateStr = hours + ':' + minutes;
        this.context.fillStyle = `${this.textColor}99`;
      }

      previousDay = date.getDate();

      this.context.fillText(
        dateStr,
        this.xToPixelCoords(x) + 5,
        this.height - 20,
      );
    }

    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.width, 58);
    this.context.fillStyle = '#fff9f4';
    this.context.fillText(this.title, 20, 35);

    const copyText = 'jinx.capital';
    this.context.fillText(
      copyText,
      this.width - this.context.measureText(copyText).width - 20,
      35,
    );

    const lastCandle = this.candlesticks[this.candlesticks.length - 1];
    let percent =
      Math.ceil(
        ((lastCandle.close - lastCandle.open) / lastCandle.open) * 10000,
      ) / 100;

    const titleWidth = this.context.measureText(this.title).width + 20;
    this.context.fillStyle = '#fff9f4';
    this.context.fillText(
      ` ${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`,
      titleWidth,
      35,
    );

    const currentPriceText = `$${this.roundPriceValue(lastCandle.close)}`;
    const currentPriceWidth = this.context.measureText(currentPriceText).width;
    this.fillRect(
      this.width - currentPriceWidth - 30,
      this.yToPixelCoords(lastCandle.close) - 27,
      currentPriceWidth + 30,
      27,
      '#000000',
    );
    this.context.fillStyle = '#fff9f4';
    this.context.fillText(
      currentPriceText,
      this.width - currentPriceWidth - 20,
      this.yToPixelCoords(lastCandle.close) - 7,
    );
  };

  calculateYRange = function () {
    for (var i = 0; i < this.candlesticks.length; ++i) {
      if (i == 0) {
        this.yStart = this.candlesticks[i].low;
        this.yEnd = this.candlesticks[i].high;
      } else {
        if (this.candlesticks[i].low < this.yStart) {
          this.yStart = this.candlesticks[i].low;
        }
        if (this.candlesticks[i].high > this.yEnd) {
          this.yEnd = this.candlesticks[i].high;
        }
      }
    }
    this.yRange = this.yEnd - this.yStart;
  };

  calculateXRange = function () {
    this.xStart = this.candlesticks[0].timestamp;
    this.xEnd = this.candlesticks[this.candlesticks.length - 1].timestamp;
    this.xRange = this.xEnd - this.xStart;
  };

  yToPixelCoords = function (y) {
    return (
      this.height -
      this.marginBottom -
      ((y - this.yStart) * this.yPixelRange) / this.yRange
    );
  };

  xToPixelCoords = function (x) {
    return (
      this.marginLeft + ((x - this.xStart) * this.xPixelRange) / this.xRange
    );
  };

  yToValueCoords = function (y) {
    return (
      this.yStart +
      ((this.height - this.marginBottom - y) * this.yRange) / this.yPixelRange
    );
  };

  xToValueCoords = function (x) {
    return (
      this.xStart + ((x - this.marginLeft) * this.xRange) / this.xPixelRange
    );
  };

  drawLine = function (xStart, yStart, xEnd, yEnd, color) {
    this.context.beginPath();
    // to get a crisp 1 pixel wide line, we need to add 0.5 to the coords
    this.context.moveTo(xStart + 0.5, yStart + 0.5);
    this.context.lineTo(xEnd + 0.5, yEnd + 0.5);
    this.context.strokeStyle = color;
    this.context.stroke();
  };

  fillRect = function (x, y, width, height, color) {
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.rect(x, y, width, height);
    this.context.fill();
  };

  drawRect = function (x, y, width, height, color) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.rect(x, y, width, height);
    this.context.stroke();
  };

  formatDate = function (date) {
    var day = date.getDate();
    if (day < 10) day = '0' + day;
    var month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return (
      day +
      '.' +
      month +
      '.' +
      date.getFullYear() +
      ' - ' +
      hours +
      ':' +
      minutes
    );
  };

  roundPriceValue = function (value) {
    if (value > 10000) return Math.round(value);
    if (value > 1.0) return Math.round(value * 100) / 100;
    if (value > 0.001) return Math.round(value * 1000) / 1000;
    if (value > 0.00001) return Math.round(value * 100000) / 100000;
    if (value > 0.0000001) return Math.round(value * 10000000) / 10000000;
    else return Math.round(value * 1000000000) / 1000000000;
  };
}
