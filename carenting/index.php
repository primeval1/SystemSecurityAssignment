<?php
///duh den tha eprepe na einai aauto edwww mou ponane ta matia mou :O
function isSecure()
{
    return
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $_SERVER['SERVER_PORT'] == 443;
} ?>

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fetch Example</title>
        <!--
        <link rel="stylesheet" href="https://bootswatch.com/4-alpha/pulse/bootstrap.min.css">
        <link rel ="stylesheet" href="https://bootswatch.com/4-alpha/minty/bootstrap.min.css">
         -->
        <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="node_modules/font-awsome/css/font-awesome.min.css">
        <style>
            body {
            }

            .navbar a {
                /*  color: #db726e !important; */
            }
        </style>
    </head>

    <body>
    <?php if (isSecure()) { ?>
        <div id="app">
            <wrapper>

            </wrapper>
        </div>
    <?php } else { ?>
        <div class="jumbotron  alert-danger">
            <h2> <i class="fa fa-frown-o"></i> are trying to access this page with insecure request! </h2>
        </div>
    <?php } ?>

    </body>
    </html>

<?php
//dont even load js if not secure :P
if (isSecure()) { ?>
    <script src="node_modules/vue-production/vue.js"></script>
    <script src="node_modules/vue-router/dist/vue-router.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.4/lodash.js"></script>
    <script src="node_modules/vue2-google-maps/dist/vue-google-maps.js"></script>

    <!--
    <script src="node_modules/sortablejs/Sortable.min.js"></script>

    <!--<script src="node_modules/vuedraggable/dist/vuedraggable.js"></script> -->
    <script src="classes/js-cookie.js"></script>
    <script src="classes/valguard.js"></script>
    <script src="classes/Classes.js"></script>
    <script src="utilities.js"></script>
    <script src="node_modules/moment/min/moment.min.js"></script>
    <script src="components/components.js"></script>
    <script src="components/util-components.js"></script>
    <script src="views/Home.js"></script>
    <script src="views/Profile.js"></script>
    <script src="views/Car.js"></script>
    <script src="views/Register.js"></script>
    <script src="views/Login.js"></script>
    <script src="views/NewCar.js"></script>
    <script src="views/Rentings.js"></script>
    <script src="node_modules/jquery/dist/jquery.slim.min.js"></script>
    <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="index.js"></script>
<?php } ?>