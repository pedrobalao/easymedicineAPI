CREATE TABLE `via` (
  `Id` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ;

CREATE TABLE `unity` (
  `Id` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ;

CREATE TABLE `clinicalcategory` (
  `id` int(11) NOT NULL ,
  `Description` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `subcategory` (
  `Id` int(11) NOT NULL ,
  `Description` varchar(200) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fk_subcategory` FOREIGN KEY (`CategoryId`) REFERENCES `clinicalcategory` (`id`) ON DELETE CASCADE
) ;

CREATE TABLE `drug` (
  `Id` int(11) NOT NULL ,
  `Name` varchar(200) NOT NULL,
  `ConterIndications` varchar(2000) DEFAULT NULL,
  `SecondaryEfects` varchar(2000) DEFAULT NULL,
  `ComercialBrands` varchar(2000) DEFAULT NULL,
  `Obs` varchar(2000) DEFAULT NULL,
  `Presentation` varchar(2000) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ;

CREATE TABLE `drugcategory` (
  `DrugId` int(11) NOT NULL,
  `SubCategoryId` int(11) NOT NULL,
  PRIMARY KEY (`DrugId`,`SubCategoryId`),
  CONSTRAINT `FK__DrugCateg__DrugI__68336F3E` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK__DrugCateg__SubCa__6CF8245B` FOREIGN KEY (`SubCategoryId`) REFERENCES `subcategory` (`Id`) ON DELETE CASCADE
) ;

CREATE TABLE `indication` (
  `Id` int(11) NOT NULL ,
  `DrugId` int(11) NOT NULL,
  `IndicationText` varchar(1000) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fkDrugId` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`Id`) ON DELETE CASCADE
) ;

CREATE TABLE `dose` (
  `Id` int(11) NOT NULL ,
  `IndicationId` int(11) NOT NULL,
  `IdVia` varchar(30) DEFAULT NULL,
  `PediatricDose` varchar(50) DEFAULT NULL,
  `IdUnityPediatricDose` varchar(30) DEFAULT NULL,
  `AdultDose` varchar(50) DEFAULT NULL,
  `IdUnityAdultDose` varchar(30) DEFAULT NULL,
  `TakesPerDay` varchar(10) DEFAULT NULL,
  `MaxDosePerDay` varchar(50) DEFAULT NULL,
  `IdUnityMaxDosePerDay` varchar(30) DEFAULT NULL,
  `obs` varchar(2000) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `fkIdUnityAdultDose` FOREIGN KEY (`IdUnityAdultDose`) REFERENCES `unity` (`Id`),
  CONSTRAINT `fkIdUnityPediatricDose` FOREIGN KEY (`IdUnityPediatricDose`) REFERENCES `unity` (`Id`),
  CONSTRAINT `fkIndicationId` FOREIGN KEY (`IndicationId`) REFERENCES `indication` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `fkUnityMaxDose` FOREIGN KEY (`IdUnityMaxDosePerDay`) REFERENCES `unity` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `fkVia` FOREIGN KEY (`IdVia`) REFERENCES `via` (`Id`) ON DELETE CASCADE
) ;

CREATE TABLE `calculation` (
  `Id` int(11) NOT NULL ,
  `DrugId` int(11) DEFAULT NULL,
  `Type` varchar(30) DEFAULT 'PED',
  `Function` varchar(4000) DEFAULT NULL,
  `ResultDescription` varchar(100) DEFAULT NULL,
  `ResultIdUnit` varchar(30) DEFAULT NULL,
  `Description` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `calculation_ibfk_1` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`Id`),
  CONSTRAINT `calculation_ibfk_2` FOREIGN KEY (`ResultIdUnit`) REFERENCES `unity` (`Id`)
) ;

CREATE TABLE `medicalcalculationgroup` (
  `Id` int(11) NOT NULL ,
  `Description` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`)
) ;

CREATE TABLE `medicalcalculation` (
  `Id` int(11) NOT NULL ,
  `Description` varchar(100) NOT NULL,
  `ResultUnitId` varchar(30) NOT NULL,
  `Formula` varchar(1000) NOT NULL,
  `Observation` varchar(1000) DEFAULT NULL,
  `CalculationGroupId` int(11) DEFAULT NULL,
  `ResultType` varchar(100) DEFAULT NULL,
  `Precision` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `medicalcalculation_ibfk_1` FOREIGN KEY (`CalculationGroupId`) REFERENCES `medicalcalculationgroup` (`Id`),
  CONSTRAINT `medicalcalculation_ibfk_2` FOREIGN KEY (`ResultUnitId`) REFERENCES `unity` (`Id`)
) ;

CREATE TABLE `medicalinfo` (
  `ID` varchar(100) NOT NULL,
  `DATA` text,
  PRIMARY KEY (`ID`)
) ;

CREATE TABLE `variable` (
  `Id` varchar(30) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  `IdUnit` varchar(30) DEFAULT NULL,
  `Type` varchar(30) DEFAULT 'NUMBER',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `variable_ibfk_1` FOREIGN KEY (`IdUnit`) REFERENCES `unity` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

CREATE TABLE `variabledrug` (
  `Id` int(11) NOT NULL ,
  `DrugId` int(11) DEFAULT NULL,
  `VariableId` varchar(30) DEFAULT NULL,
  `Type` varchar(30) DEFAULT 'PED',
  PRIMARY KEY (`Id`),
  CONSTRAINT `variabledrug_ibfk_1` FOREIGN KEY (`DrugId`) REFERENCES `drug` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `variabledrug_ibfk_2` FOREIGN KEY (`VariableId`) REFERENCES `variable` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

CREATE TABLE `variablemedicalcalculation` (
  `Id` int(11) NOT NULL ,
  `VariableId` varchar(30) NOT NULL,
  `MedicalCalculationId` int(11) NOT NULL,
  `Optional` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `variablemedicalcalculation_ibfk_1` FOREIGN KEY (`MedicalCalculationId`) REFERENCES `medicalcalculation` (`Id`),
  CONSTRAINT `variablemedicalcalculation_ibfk_2` FOREIGN KEY (`VariableId`) REFERENCES `variable` (`Id`)
) ;

CREATE TABLE `variablevalues` (
  `Id` int(11) NOT NULL ,
  `VariableId` varchar(30) NOT NULL,
  `Value` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `variablevalues_ibfk_1` FOREIGN KEY (`VariableId`) REFERENCES `variable` (`Id`)
) ;




