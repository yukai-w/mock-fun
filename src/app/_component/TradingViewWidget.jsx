import React, { useEffect } from 'react';

const TradingViewWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        "container_id": "tradingview-widget-container",
        "width": "100%",
        "height": "500",
        "symbol": "BINANCE:SOLUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        // "locale": "zh_CN",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "save_image": false,
        "hideideas": true,
      });
    };

    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* <h2>TODO - token </h2> */}
      <div id="tradingview-widget-container" />
    </div>
  );
};

export default TradingViewWidget;
