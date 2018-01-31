<?php
require_once '../config.php';
header('Access-Control-Allow-Origin: *');

$type = $_GET['type'];
//a token must always be sent
if(!isset($_GET['token'])){
    echo "not authenticated";
    exit();
}

//check if the token is valid
if (!authenticate($_GET['token'],KEY,ISS,AUD)){
    echo "not authenticated";
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($type) {

        case 'getUsername':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('users', ['username'], ['ID' => $id]);
            echo json_encode($results[0]);
            break;
        case 'user':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('users',
                [
                    'Address',
                    'Age',
                    'Email',
                    'Experience',
                    'FirstName',
                    'Lastname',
                    'Other',
                    'Phonenumber',
                    'Username',
                    'Type'
                ],
                ['id' => $id]
            );
            echo json_encode($results[0]);
            break;
        case 'users':
            $conn = conn();
            $limit = $_GET['limit'];
            $type = $_GET['userType'];
            $results = $conn->select('users', ['ID'], [
                'Type' => $type,
                'LIMIT' => $limit
            ]);
            echo json_encode($results);
            break;
        case 'cars':
            $conn = conn();
            $id = $_GET['UserID'];
            $results = $conn->select('cars', ['ID'], ['UserID' => $id]);
            echo json_encode($results);
            break;
        case 'car':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('cars', "*", ['ID' => $id]);
            echo json_encode($results[0]);
            break;
        case 'carRentings':
            $conn = conn();
            $id = $_GET['id'];
            $status = $_GET['status'];
            $results = [];
            $results = $conn->select('rentings', "*", ['CarsID' => $id, 'Status' => 'accepted']);
            echo json_encode($results);
            break;
        case 'carSchedule':
            $conn = conn();
            $id = $_GET['id'];
            $results = [];
            $results = $conn->select('schedule', "*", ['CarsID' => $id]);
            echo json_encode($results);
            break;
        case 'ownerRentings':
            $conn = conn();
            $id = $_GET['ownerID'];
            $status = $_GET['status'];
            $results = $conn->select('rentings', ['ID'], ['AND' => ['OwnerID' => $id, 'Status' => $status]]);
            echo json_encode($results);
            break;
        case 'renterRentings':
            $conn = conn();
            $id = $_GET['userID'];
            $status = $_GET['status'];
            $results = $conn->select('rentings', ['ID'], ['AND' => ['UserID' => $id, 'Status' => $status]]);
            echo json_encode($results);
            break;
        case 'getRenting':
            $conn = conn();
            $id = $_GET['ID'];
            $results = $conn->select('rentings', '*', ['ID' => $id]);
            echo json_encode($results[0]);
            break;
        case 'rentingTimes':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('rentings_Times', '*', ['RentingID' => $id]);
            echo json_encode($results);
            break;
        case 'notInformed':
            $conn = conn();
            $id = $_GET['userID'];
            $results = $conn->select('rentings', ['ID', 'Status'], ['AND' => ['UserID' => $id, 'informed' => 0]]);
            echo json_encode($results);
            break;
        case 'carPhotos':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('carsphoto', '*', ['CarsID' => $id]);
            echo json_encode($results);
            break;
        case 'search':
            $conn = conn();
            $times = json_decode($_GET['times']);
            $results = $conn->select('schedule', ['CarsID'], ['AND' => ['Time' => $times], 'GROUP' => [
                'CarsID',
            ]
            ]);

            echo json_encode($results);
            break;
        case 'ratings':
            $conn = conn();
            $id = $_GET['id'];
            $results = $conn->select('rating', '*', ['TargetID' => $id]);
            echo json_encode($results);
            break;

    }


}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    switch ($type) {
        case 'rating':
            $isOk = false;
            $conn = conn();
            $userID = $_POST['user'];
            $targetID = $_POST['target'];
            $comment = $_POST['comment'];
            $rating = $_POST['rating'];

            if ($conn->insert('rating', ['TargetID' => $targetID, 'UsersID' => $userID, 'Comment' => $comment, 'Rating1' => $rating])) {
                $isOk = true;

            }
            echo json_encode(['success' => $isOk]);
            break;
        case 'addCar':
            $results = [];
            $conn = conn();
            if ($conn->insert('cars', [
                'Brand' => $_POST['Brand'],
                'Price' => $_POST['Price'],
                'Cubemtr' => $_POST['Cubemtr'],
                'Other' => $_POST['Other'],
                'Lat' => $_POST['Lat'],
                'Long' => $_POST['Long'],
                'Model' => $_POST['Model'],
                'UserID' => $_POST['UserID'],
                'Year' => $_POST['Year'],
            ])) {
                $results = ['success', true];
            } else {
                $results = ['success', false];
            }
            echo json_encode($results);
            break;
        case 'renting':
            $ok = false;
            $conn = conn();

            $timesjson = $_GET['times'];
            $times = json_decode($timesjson, false);
            $totalPrice = $_GET['totalPrice'];
            $carID = $_GET['carID'];
            $userID = $_GET['userID'];
            $ownerID = $_GET['ownerID'];
            $other = $_GET['other'];
            if ($conn->insert('rentings', [
                'CarsID' => $carID,
                'UserID' => $userID,
                'OwnerID' => $ownerID,
                'Status' => 'pending',
                'TotalPrice' => $totalPrice,
                'Other' => $other,
                'informed' => 1
            ])) {
                $id = $conn->id();
                foreach ($times as $time) {
                    if ($conn->insert('rentings_times', ['Time' => $time, 'RentingID' => $id])) {
                        $ok = true;
                    };
                    if ($conn->update('schedule', ['isRented' => 1], ['AND' => ['Time' => $time, 'CarsID' => $carID]])) {
                        $ok = true;
                    }
                }
            };
            echo json_encode(['success' => $ok]);
            break;
        case 'scheduleAdd':
            $conn = conn();
            $carID = $_POST['carID'];
            $times = json_decode($_POST['timeToAdd']);
            $isOk = false;
            foreach ($times as $time) {
                if ($conn->insert('schedule', ['CarsID' => $carID, 'Time' => $time, 'isRented' => 0])) {
                    $isOk = true;
                };
            }
            echo json_encode(['success' => $isOk]);
            break;
        case 'scheduleRemove':
            $isOk = false;
            $conn = conn();
            $carID = $_POST['carID'];
            $times = json_decode($_POST['timeToRemove']);
            foreach ($times as $time) {
                if ($conn->delete('schedule', ['ID' => $time['ID']])) {
                    $isOk = true;
                };
            }
            echo json_encode(['success' => $isOk]);
            break;
        case 'changeRentingStatus':
            $isOk = false;
            $conn = conn();
            $id = $_POST['ID'];
            $status = $_POST['status'];
            if ($conn->update('rentings', ['Status' => $status, 'informed' => 0], ['ID' => $id])) {
                echo json_encode(['success' => true]);
            }
            break;
        case 'changeInformed':
            $isOk = false;
            $conn = conn();
            $id = $_POST['ID'];
            if ($conn->update('rentings', ['informed' => 1], ['ID' => $id])) {
                echo json_encode(['success' => true]);
            }
            break;
        case 'FileUpload':
            $conn = conn();
            $return = [];
            $file_name = $_FILES['file']['name'];
            $file_size = $_FILES['file']['size'];
            $file_type = $_FILES['file']['type'];
            $file_tmp = $_FILES['file']['tmp_name'];
            $file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));
            $allowed = ["jpeg", "jpg", "png", "gif"];
            $error = false;
            if ($file_size > file_upload_max_size()) {
                $return = ["error" => "max_upload_limit", "order" => $_GET["order"]];
                $error = true;
            }
            if (in_array($file_ext, $allowed) === false) {
                $return = ["error" => "not_allowed", "order" => $_GET["order"]];
                $error = true;
            }
            if (!$error) {
                move_uploaded_file($file_tmp, "media/" . $file_name);
                $return = [];
                $return["uploaded"] = "media/" . $file_name;
                $return["order"] = $_GET["order"];
                if (isset($_POST['id'])) {
                    $conn->insert('carsphoto', ['CarsID' => $_POST['id'], 'Photo' => "media/" . $file_name]);
                }
            }
            echo json_encode($return);
            break;
        case 'addSchedule':
            $ok = false;
            $conn = conn();
            $timesjson = $_POST['times'];
            $times = json_decode($timesjson, false);
            $carID = $_POST['id'];
            foreach ($times as $time) {
                if ($conn->insert('schedule', [
                    'CarsID' => $carID,
                    'Time' => $time
                ])) {
                    $ok = true;
                }
            }
            echo json_encode(['success' => $ok]);
            break;


    }
}