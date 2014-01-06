chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
  	id: "appSquareID",
    bounds: {
      width: 1000,
      height: 709
    }
  });
});
