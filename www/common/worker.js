
var interval = 0;
onmessage = function(e) {
  console.log('Message received from main script');

  interval = parseInt(e.data[0]);

  setInterval(function(){
    interval ++;
    postMessage(interval);
  }, 1000);

}
