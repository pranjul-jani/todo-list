$(document).ready(function () {
    // we need to get the text of the task model and
    // pass crsf token b'coz if we do not get that it will show 403 forbidden error
    let crsfToken = $("input[name=csrfmiddlewaretoken]").val();

    $("#createButton").click(function () {


        // now we need to pass this data to TaskList View
        let serializedData = $("#createTaskForm").serialize();

        // ajax function accepts dictionary as an argument
        $.ajax({

            // first key of the dictionary is the url, in this task_url, the name we have given to the url
            // two options to get the url
            // 1. hard coded explicitly here only e.g- url : '/tasks'
            // 2. add data-url to the form tag and there use {% url 'task_list' %} (django notation) and from their get the url
            url : $("#createTaskForm").data('url'),

            // crsf token is included in the serializedData itself
            data : serializedData,
            type : 'post',

            // in this we have to get the data(new task) from the server(django)
            // and then show it in the task list as a way to show successful task insertion/creation
            // which we will do by .append for that we need json response class and model_to_dict in our views.py
            // instead of redirect in case of successful creation we will pass json response class

            success : function (response) {
                $("#taskList").append('<div class="card mb-2" id="taskCard" data-id="' + response.new_task.id + '">' +
                    '<div class="card-body">' +
                    response.new_task.title +
                    '<button type="button" class="close float-right" data-id="' + response.new_task.id +'">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                    '</div>' +
                    '</div>'
                )
            }

        })
        // to clear the input field after successful insertion
        $("#createTaskForm")[0].reset();

    });

    // get the whole list of task
    // In this we basically need the id of the specific task clicked
    // .card(. means css class) gives <div className="card mb-2" id="taskCard" data-id="{{ task.id }}"> thing of our html page
    $("#taskList").on('click', '.card', function ()  {

        // we our trying to basically find the data-id of the task
        let dataId = $(this).data('id');

        // in this we are changing the text decoration of the completed task to strike-through
        $.ajax({
            // In this we are fetching the url that the page would redirect to in-case we were not using ajax
            url: '/tasks/' + dataId + '/completed/',
            // we have to send django the crsf token again
            data: {
                csrfmiddlewaretoken: crsfToken,
                id : dataId,

            },

            type: 'post',

            // get the div with the task card ID for the strike through
            success: function () {
                let cardItem = $('#taskCard[data-id="' +dataId+'"]');

                cardItem.css('text-decoration', 'line-through').hide().slideDown();

                $("#taskList").append(cardItem);
            }
        });
    }).on('click', 'button.close', function (event) {

        // it means that if the browser registered click on the cross button it doesn't expand this event to its parent elements
        // and the click event remains and we click on the cross element only
        // it basically means the this new click will be independent of the previous clicking on the card of the task
        // this is functionality of event.stopPropagation
        event.stopPropagation();

        let dataId = $(this).data('id');

         $.ajax({
            // In this we are fetching the url that the page would redirect to in-case we were not using ajax
            url: '/tasks/' + dataId + '/delete/',
            // we have to send django the crsf token again
            data: {
                csrfmiddlewaretoken: crsfToken,
                id : dataId,

            },

            type: 'post',

            dataType : 'json',

            // get the div with the task card ID for the strike through
            success: function () {
                $('#taskCard[data-id="' +dataId+'"]').remove();
            }
        });


    });
});