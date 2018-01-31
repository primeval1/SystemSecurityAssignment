<?php
require '../vendor/autoload.php';

use \Firebase\JWT\JWT;


//we make salt :P
function makePassword($pass, $salt)
{
    $options = [
        'cost' => 11,
        'salt' => $salt
    ];
    //use bcrypt to store the password.
    return password_hash($pass, PASSWORD_BCRYPT, $options);
}

function generateToken($key, $iss, $aud, $user)
{
    $token = array(
        "iss" => $iss,
        "aud" => $aud,
        "iat" => time(),
        'usr' => $user,
        "nbf" => time() + 60 * 15//15 min
    );
    return JWT::encode($token, $key);
}

function authenticate($token, $key, $iss, $aud)
{
    $return = false;
    JWT::$leeway = 60 * 60; // Allows a 1 hour???? tolerance on timing checks - cant do something else sorry :P what the actual fuck i know
    $decoded = (Array)$decoded = JWT::decode($token, $key, array('HS256'));
    if ($decoded['iss'] === $iss && $decoded['aud'] === $aud && $decoded['nbf'] > time()) {
        $return = true;
    }
    return $return;
}

function login($username, $password)
{
    $conn = conn();

    $results = $conn->select('Users', ['ID', 'Type'], ['Username' => $username, 'Password' => makePassword($password, SALT)]);
    if (count($results) == 1 and $results != false) {
        $token = generateToken(KEY, ISS, AUD, json_encode(['id' => $results[0]['ID'], 'type' => $results[0]['Type']]));
        $results = ['success' => true, 'id' => $results[0]['ID'], 'type' => $results[0]['Type'], 'token' => $token];
    } else {
        $results = ['success' => false];
    }
    echo json_encode($results);
}

function findUser($token)
{
    JWT::$leeway = 60 * 60; // Allows a 1 hour???? tolerance on timing checks - cant do something else sorry :P what the actual fuck i knoww
    $decoded = (Array)$decoded = JWT::decode($token, KEY, array('HS256'));
    echo $decoded['usr'];

}

function isSecure()
{
    return
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $_SERVER['SERVER_PORT'] == 443;
}

function s_string($var)
{
    return filter_var($var, FILTER_SANITIZE_STRING);
}

function v_email($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function v_int($int){
    return filter_var($int, FILTER_VALIDATE_INT) === 0 || !filter_var($int, FILTER_VALIDATE_INT) === false;
}
