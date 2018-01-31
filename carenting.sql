-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Φιλοξενητής: 127.0.0.1
-- Χρόνος δημιουργίας: 31 Ιαν 2018 στις 19:15:57
-- Έκδοση διακομιστή: 10.1.21-MariaDB
-- Έκδοση PHP: 5.6.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `carenting`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `cars`
--

CREATE TABLE `cars` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Brand` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Model` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Cubemtr` int(11) NOT NULL,
  `Year` int(11) NOT NULL,
  `Price` int(11) NOT NULL,
  `Long` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lat` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Availability` bit(1) NOT NULL,
  `Extraprice` int(11) NOT NULL,
  `Other` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `cars`
--

INSERT INTO `cars` (`ID`, `UserID`, `Brand`, `Model`, `Cubemtr`, `Year`, `Price`, `Long`, `Lat`, `Availability`, `Extraprice`, `Other`) VALUES
(1, 10, 'toyota', 'corola', 120, 1996, 12, '23.727538800000048', '37.9838096', b'0', 0, 'dddd'),
(2, 10, 'toyota', 'corola', 120, 1996, 12, '23.727538800000048', '37.9838096', b'0', 0, 'dddd'),
(3, 10, 'dd', 'ddd', 10, 1996, 10, '23.727538800000048', '37.9838096', b'0', 0, 'Î¿Î¼Î¿ÏÏ†Î¿');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `carsphoto`
--

CREATE TABLE `carsphoto` (
  `ID` int(11) NOT NULL,
  `CarsID` int(11) NOT NULL,
  `Photo` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rating`
--

CREATE TABLE `rating` (
  `ID` int(11) NOT NULL,
  `UsersID` int(11) NOT NULL,
  `TargetID` int(11) NOT NULL,
  `Comment` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Rating1` int(11) NOT NULL,
  `Rating2` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rentings`
--

CREATE TABLE `rentings` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `OwnerID` int(11) NOT NULL,
  `CarsID` int(11) NOT NULL,
  `Status` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `TotalPrice` int(11) NOT NULL,
  `Other` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `informed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=COMPACT;

--
-- Άδειασμα δεδομένων του πίνακα `rentings`
--

INSERT INTO `rentings` (`ID`, `UserID`, `OwnerID`, `CarsID`, `Status`, `TotalPrice`, `Other`, `informed`) VALUES
(1, 9, 10, 2, 'accepted', 24, 'Ï‡Î¼Î¼Î¼Î¼  Î¼ Î±ÏÎ­ÏƒÎµÎ¹ Î±Ï…Ï„ÏŒ ', 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `rentings_times`
--

CREATE TABLE `rentings_times` (
  `ID` int(11) NOT NULL,
  `Time` time NOT NULL,
  `RentingID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `rentings_times`
--

INSERT INTO `rentings_times` (`ID`, `Time`, `RentingID`) VALUES
(1, '11:00:00', 1),
(2, '12:00:00', 1);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `schedule`
--

CREATE TABLE `schedule` (
  `ID` int(11) NOT NULL,
  `CarsID` int(11) NOT NULL,
  `Time` time NOT NULL,
  `isRented` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Άδειασμα δεδομένων του πίνακα `schedule`
--

INSERT INTO `schedule` (`ID`, `CarsID`, `Time`, `isRented`) VALUES
(1, 2, '11:00:00', 1),
(2, 2, '12:00:00', 1),
(3, 2, '13:00:00', 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Username` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `UserPhoto` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Type` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `FirstName` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Lastname` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gender` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Age` date NOT NULL,
  `Email` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phonenumber` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Experience` date NOT NULL,
  `Other` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Token` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `TokenExpire` text COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`ID`, `Username`, `Password`, `UserPhoto`, `Type`, `FirstName`, `Lastname`, `Gender`, `Age`, `Email`, `Address`, `Phonenumber`, `Experience`, `Other`, `Token`, `TokenExpire`) VALUES
(9, 'jimmyst', '$2y$11$KSA9cnlGUU9jcUFuLiVzI.rjy/RZzGlV9CCPuvwnOgt/DuRsj3ZdO', '', 'renter', 'dimitris', 'tzilivakis', 'male', '1996-12-12', 'jimmyst@hotmail.gr', 'your mama', '6948116611', '2005-02-05', '', '', ''),
(10, 'penny ', '$2y$11$KSA9cnlGUU9jcUFuLiVzI.vRR1qKH8JlpPRqYEp5qx7wrZrunkiiq', '', 'owner', 'Penny', 'Thomopoulou ', 'Female', '1996-12-12', 'pennyamy@hotmail.gr', 'hmmm 12 glyfada', '121213-2392', '0000-00-00', '', '', ''),
(11, 'alinaki', '$2y$11$KSA9cnlGUU9jcUFuLiVzI.rBt4wbKGLpEI0DR5mP3W6C22S9OZsIO', '', 'renter', 'Alin', 'Aivazian', 'Female', '1996-12-12', 'alin@gmail.com', 'Ï€Î±Î»Î±Î¹ÏŒ Ï†Î¬Î»Î·ÏÎ¿', '123456789', '2017-12-10', '', '', '');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Cars_fk0` (`UserID`);

--
-- Ευρετήρια για πίνακα `carsphoto`
--
ALTER TABLE `carsphoto`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CarsPhoto_fk0` (`CarsID`);

--
-- Ευρετήρια για πίνακα `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Rating_fk0` (`UsersID`);

--
-- Ευρετήρια για πίνακα `rentings`
--
ALTER TABLE `rentings`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Orders_fk0` (`CarsID`);

--
-- Ευρετήρια για πίνακα `rentings_times`
--
ALTER TABLE `rentings_times`
  ADD PRIMARY KEY (`ID`);

--
-- Ευρετήρια για πίνακα `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Schedule_fk0` (`CarsID`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `cars`
--
ALTER TABLE `cars`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT για πίνακα `carsphoto`
--
ALTER TABLE `carsphoto`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT για πίνακα `rating`
--
ALTER TABLE `rating`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT για πίνακα `rentings`
--
ALTER TABLE `rentings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT για πίνακα `rentings_times`
--
ALTER TABLE `rentings_times`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT για πίνακα `schedule`
--
ALTER TABLE `schedule`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `Cars_fk0` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`);

--
-- Περιορισμοί για πίνακα `carsphoto`
--
ALTER TABLE `carsphoto`
  ADD CONSTRAINT `CarsPhoto_fk0` FOREIGN KEY (`CarsID`) REFERENCES `cars` (`ID`);

--
-- Περιορισμοί για πίνακα `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `Rating_fk0` FOREIGN KEY (`UsersID`) REFERENCES `users` (`ID`);

--
-- Περιορισμοί για πίνακα `rentings`
--
ALTER TABLE `rentings`
  ADD CONSTRAINT `Orders_fk0` FOREIGN KEY (`CarsID`) REFERENCES `cars` (`ID`);

--
-- Περιορισμοί για πίνακα `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `Schedule_fk0` FOREIGN KEY (`CarsID`) REFERENCES `cars` (`ID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
