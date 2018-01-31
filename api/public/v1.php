<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($_GET['type']) {

        case'check-username':
            $conn = conn();
            $username = $_POST['Username'];
            if (count($conn->select('users', 'Username', ['Username' => $username])) == 0) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false]);
            };
            break;
        case'register-user':
            $conn = conn();
            $is_email = v_email($_POST['Email']);
            if(!$is_email){echo "nope :P "; break;} //den tha xreiastei giati to valguard sto front end tha to empodisei apo to na postarei lathos email.
            if ($conn->insert('users', [
                'FirstName' =>  s_string($_POST['FirstName']) ,
                'LastName' => s_string($_POST['LastName']) , //as valoume endeiktika merika santize gia paradeigma xD :P
                'Username' => s_string( $_POST['Username']),
                'Email' =>  $_POST['Email'],
                'Age' => $_POST['Age'],
                'Phonenumber' => s_string($_POST['Phonenumber']),
                'Address' => s_string($_POST['Address']) ,
                'Gender' => s_string($_POST['Gender']) ,
                'Password' => makePassword($_POST['Password'], SALT), //kanena thema edw giati arxika xrishmopoioume to b_crypt kai to valguard tha frontisei na einai swsto.
                'Type' => $_POST['Type'],
                'Experience' => $_POST['Experience'],
            ])) {
                echo json_encode(['success' => true]);
            } else {
                echo $conn->error();
            }
            break;
        case 'login':
            login($_POST['username'], $_POST['password']);
            break;
    }

}else{
    switch ($_GET['type']) {
        case'validate-user':
            findUser($_GET['token']);
            break;
    }
}
