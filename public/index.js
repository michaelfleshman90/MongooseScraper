$(".save").on("click",function(event){
    try {
        var item = {
            title: $(event.target).attr("title"),
            link: $(event.target).attr("link")
        };
        console.log(item);
        $.post("/savenew",item).then(function(data){
            console.log(data);
            $(event.target).text("Saved!").off();
        });
    } catch (error) {
        console.log(error)   ;
    }
 });
 
 $(".clear").on("click",function(event){
    $.get("/clearArticles",function(data){
        console.log(data);
    });
    clearArticles();
 });
 
 function clearArticles(){
    $(".article-container").empty();
 }