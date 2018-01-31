<?php
require_once 'libraries/Medoo.php';
function conn(){
    return new Medoo\Medoo( [
    'database_type' => 'mysql',
    'database_name' => 'carenting',
    'server' => 'localhost',
    'username' => 'root',
    'password' => ''
    ]);
}
define("SALT", ') =ryFQOcqAn.%s 8umT1YaH{6P.z|zjS$2[tQYm([yi?|,oi2T5{}~} >X9PUVq');
define("KEY",'cP59UHiHjPZYC0loEsk7s+hUmT3QHerAQJMZWC11Qrn2N+ybwwNblDKv+s5qgMQ5');
define("ISS",'api');
define("AUD",'carenting');

require_once 'libraries/security.php';

if(!isSecure()){
    echo 'api available only through https';
    session_destroy(); //giati to vazw auto edw :P
    exit();
}