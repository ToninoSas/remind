-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 08, 2026 alle 16:01
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `remind`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `accounts`
--

CREATE TABLE `accounts` (
  `UID` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `titolo` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `patientID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `accountstypes`
--

CREATE TABLE `accountstypes` (
  `id` int(11) NOT NULL,
  `tipoAccount` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `boxdeiricordi`
--

CREATE TABLE `boxdeiricordi` (
  `id_box` int(11) NOT NULL,
  `id_paziente` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `cognome` varchar(100) DEFAULT NULL,
  `citta` varchar(100) DEFAULT NULL,
  `eta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bridgegamespatients`
--

CREATE TABLE `bridgegamespatients` (
  `game_ID` int(11) NOT NULL,
  `patient_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `bridgetoquestionsgames`
--

CREATE TABLE `bridgetoquestionsgames` (
  `IDgame` int(11) NOT NULL,
  `IDquestion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `games`
--

CREATE TABLE `games` (
  `gameID` int(11) NOT NULL,
  `creatorID` int(11) NOT NULL,
  `nomeGioco` varchar(150) DEFAULT NULL,
  `tipoGioco` varchar(50) DEFAULT NULL,
  `livelloGioco` varchar(50) DEFAULT NULL,
  `categoriaGioco` varchar(50) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `gamesquestions`
--

CREATE TABLE `gamesquestions` (
  `ID` int(11) NOT NULL,
  `doctor_UID` int(11) NOT NULL,
  `tipoGioco` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `domanda` text DEFAULT NULL,
  `rispCorrettaN1` varchar(255) DEFAULT NULL,
  `rispCorrettaN2` varchar(255) DEFAULT NULL,
  `rispCorrettaN3` varchar(255) DEFAULT NULL,
  `rispCorrettaN4` varchar(255) DEFAULT NULL,
  `rispSbagliataN1` varchar(255) DEFAULT NULL,
  `rispSbagliataN2` varchar(255) DEFAULT NULL,
  `rispSbagliataN3` varchar(255) DEFAULT NULL,
  `rispSbagliataN4` varchar(255) DEFAULT NULL,
  `immagine` varchar(255) DEFAULT NULL,
  `suggerimento` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `multimedia`
--

CREATE TABLE `multimedia` (
  `id_multimedia` int(11) NOT NULL,
  `id_ricordo` int(11) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `patients`
--

CREATE TABLE `patients` (
  `ID` int(11) NOT NULL,
  `doct_UID` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `codiceFiscale` varchar(16) DEFAULT NULL,
  `dataNascita` date DEFAULT NULL,
  `contattoCellulare` varchar(20) DEFAULT NULL,
  `contattoEmail` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `recuperopsw`
--

CREATE TABLE `recuperopsw` (
  `codiceUnico` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `resultsgames`
--

CREATE TABLE `resultsgames` (
  `ID` int(11) NOT NULL,
  `pazienteID` int(11) NOT NULL,
  `giocoID` int(11) NOT NULL,
  `rispTotali` int(11) DEFAULT NULL,
  `rispCorrette` int(11) DEFAULT NULL,
  `rispSbagliate` int(11) DEFAULT NULL,
  `dataSvolgimento` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `ricordi`
--

CREATE TABLE `ricordi` (
  `id_ricordo` int(11) NOT NULL,
  `id_box` int(11) NOT NULL,
  `titolo` varchar(150) DEFAULT NULL,
  `descrizione` text DEFAULT NULL,
  `latitudine` decimal(9,6) DEFAULT NULL,
  `longitudine` decimal(9,6) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`UID`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `patient_ID` (`patientID`);

--
-- Indici per le tabelle `accountstypes`
--
ALTER TABLE `accountstypes`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `boxdeiricordi`
--
ALTER TABLE `boxdeiricordi`
  ADD PRIMARY KEY (`id_box`),
  ADD KEY `id_paziente` (`id_paziente`);

--
-- Indici per le tabelle `bridgegamespatients`
--
ALTER TABLE `bridgegamespatients`
  ADD PRIMARY KEY (`game_ID`,`patient_ID`),
  ADD KEY `patient_ID` (`patient_ID`);

--
-- Indici per le tabelle `bridgetoquestionsgames`
--
ALTER TABLE `bridgetoquestionsgames`
  ADD PRIMARY KEY (`IDgame`,`IDquestion`),
  ADD KEY `IDquestion` (`IDquestion`);

--
-- Indici per le tabelle `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`gameID`),
  ADD KEY `creatorID` (`creatorID`);

--
-- Indici per le tabelle `gamesquestions`
--
ALTER TABLE `gamesquestions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `doctor_UID` (`doctor_UID`);

--
-- Indici per le tabelle `multimedia`
--
ALTER TABLE `multimedia`
  ADD PRIMARY KEY (`id_multimedia`),
  ADD KEY `id_ricordo` (`id_ricordo`);

--
-- Indici per le tabelle `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `doct_UID` (`doct_UID`);

--
-- Indici per le tabelle `recuperopsw`
--
ALTER TABLE `recuperopsw`
  ADD PRIMARY KEY (`codiceUnico`);

--
-- Indici per le tabelle `resultsgames`
--
ALTER TABLE `resultsgames`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `pazienteID` (`pazienteID`),
  ADD KEY `giocoID` (`giocoID`);

--
-- Indici per le tabelle `ricordi`
--
ALTER TABLE `ricordi`
  ADD PRIMARY KEY (`id_ricordo`),
  ADD KEY `id_box` (`id_box`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `accounts`
--
ALTER TABLE `accounts`
  MODIFY `UID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `accountstypes`
--
ALTER TABLE `accountstypes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `boxdeiricordi`
--
ALTER TABLE `boxdeiricordi`
  MODIFY `id_box` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `games`
--
ALTER TABLE `games`
  MODIFY `gameID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `gamesquestions`
--
ALTER TABLE `gamesquestions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `multimedia`
--
ALTER TABLE `multimedia`
  MODIFY `id_multimedia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `patients`
--
ALTER TABLE `patients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `resultsgames`
--
ALTER TABLE `resultsgames`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `ricordi`
--
ALTER TABLE `ricordi`
  MODIFY `id_ricordo` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `boxdeiricordi`
--
ALTER TABLE `boxdeiricordi`
  ADD CONSTRAINT `boxdeiricordi_ibfk_1` FOREIGN KEY (`id_paziente`) REFERENCES `patients` (`ID`);

--
-- Limiti per la tabella `bridgegamespatients`
--
ALTER TABLE `bridgegamespatients`
  ADD CONSTRAINT `bridgegamespatients_ibfk_1` FOREIGN KEY (`game_ID`) REFERENCES `games` (`gameID`),
  ADD CONSTRAINT `bridgegamespatients_ibfk_2` FOREIGN KEY (`patient_ID`) REFERENCES `patients` (`ID`);

--
-- Limiti per la tabella `bridgetoquestionsgames`
--
ALTER TABLE `bridgetoquestionsgames`
  ADD CONSTRAINT `bridgetoquestionsgames_ibfk_1` FOREIGN KEY (`IDgame`) REFERENCES `games` (`gameID`),
  ADD CONSTRAINT `bridgetoquestionsgames_ibfk_2` FOREIGN KEY (`IDquestion`) REFERENCES `gamesquestions` (`ID`);

--
-- Limiti per la tabella `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`creatorID`) REFERENCES `accounts` (`UID`);

--
-- Limiti per la tabella `gamesquestions`
--
ALTER TABLE `gamesquestions`
  ADD CONSTRAINT `gamesquestions_ibfk_1` FOREIGN KEY (`doctor_UID`) REFERENCES `accounts` (`UID`);

--
-- Limiti per la tabella `multimedia`
--
ALTER TABLE `multimedia`
  ADD CONSTRAINT `multimedia_ibfk_1` FOREIGN KEY (`id_ricordo`) REFERENCES `ricordi` (`id_ricordo`);

--
-- Limiti per la tabella `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`doct_UID`) REFERENCES `accounts` (`UID`);

--
-- Limiti per la tabella `resultsgames`
--
ALTER TABLE `resultsgames`
  ADD CONSTRAINT `resultsgames_ibfk_1` FOREIGN KEY (`pazienteID`) REFERENCES `patients` (`ID`),
  ADD CONSTRAINT `resultsgames_ibfk_2` FOREIGN KEY (`giocoID`) REFERENCES `games` (`gameID`);

--
-- Limiti per la tabella `ricordi`
--
ALTER TABLE `ricordi`
  ADD CONSTRAINT `ricordi_ibfk_1` FOREIGN KEY (`id_box`) REFERENCES `boxdeiricordi` (`id_box`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
