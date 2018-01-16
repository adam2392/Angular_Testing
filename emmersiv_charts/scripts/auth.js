define([], function(){
    var url = "http://52.8.27.171:3000/?jasoncallback=?";
    var AuthToken = function(){
        this.getAuthToken = function(callback){
            $.get(url, function(resp){
                callback(resp);
            });
        }
    }
    
    return AuthToken;
});