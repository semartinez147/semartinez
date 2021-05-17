$(document).ready(
//    docs at https://www.jqueryvalidation.org/validate
// "#thing" refers to HTML Ids.
$("#contact").validate({
    debug:true,
    errorClass: "alert alert-danger", /*bootstrap styling*/
    errorLabelContainer: "#output-area",
    errorElement: "div",
// rules define good vs. bad input.  Each rule starts with the input element's NAME attribute.
    rules: {
        name: {
            required: true,
        },
        email: {
            email: true,
            required: true
        },
        message: {
            required: true,
// do not capitalize the L!
            maxlength: 2000
        }
    },
// write an error message for each rule of each field.
    messages: {
        name: {
            required: "Name is a required field"
        },
        email: {
            email: "Please provide a valid email address",
            required: "Email is a required field"
        },
        message: {
            required: "Message is a required field",
            maxlength: "Message is too long"
        }
    },
    submitHandler: (form) => {
        $("#contact").ajaxSubmit({
            type: "POST",
            url: $("#contact").attr('action'),
            success: (ajaxOutput) => {
                $("#output-area").css("display", "")
                $("#output-area").html(ajaxOutput)

                if ($(".alert-success") >= 1) {
                    $("#contact")[0].reset();
                }
            }

        })
    }
})
)