$(".delete").on("click",function(event){
    try {
        console.log($(event.target).attr("id"));
        $.get("/delete/" + $(event.target).attr("id"),function(res){
            $(event.target).parents(".card-header").remove();
        });
    } catch (error) {
        ;console.log(error)
    }
 });