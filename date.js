(function(exports){

  exports.getCurrUTCDateISO = function(){
       return (new Date(Date.parse(new Date().toUTCString()))).toISOString();
  };

}(typeof exports === 'undefined' ? this.share = {} : exports));