---
title: 'Soaring Club Management Database'
date: 2023-07-12T04:01:17Z
draft: false
---

## Philosophy

The **Franconia Soaring Database** serves as the backbone for the management and billing system of the Franconia Soaring club v2, aiming to replace the current Google Sheets solution with a more customizable and efficient system. While it also supports the Franconia Soaring Foundation (FSF), the database design is tailored to cater to the requirements and workflows of Franconia Soaring Association (FSA).

The table structure and relationships within the database are designed to be familiar to club members who are accustomed to using the existing Google Sheets system. To illustrate the design philosophy, let's consider an example we are familiar with: weekend sign-up. In this scenario, a **person** who is a member of the **club** can sign up for an **operation** scheduled for July 2nd, 2023. Additionally, a **person** who holds the **role** of Duty Officer can also sign up for the same **operation**. See the different parts come together and organize a weekend operation? (If not, take a look at the tables below)

Given that Franconia Soaring is a people-centric operation, the database's design emphasizes the interconnectedness of individuals, their roles, and their participation in specific operations. By capturing these relationships, the database enables efficient tracking of member involvement and facilitates smooth coordination of club activities. This approach ensures that the database accommodates the unique requirements of the Franconia Soaring club, enhancing operational effectiveness and streamlining the billing process.

---

## Diagram

For simplicity, this diagram only highlights the person-centric relationships (which are very important). Please see the tables below for a more in-depth and accurate representation of the database structure and relationships.

![FSA_DB_Schema.png](FSA_DB_UML.png)

---

## Person

The **Person** table represents individuals associated with the FSA or FSF. It serves as a central repository for storing information about Franconia Soaring members, pilots, passengers, and other personnel involved in the organizations activities.

| PersonId* | pk | Unique person identifier |
| --- | --- | --- |
| Member | fk | MemberId |
| Active* | boolean | Is the person active? (Inactive == soft delete) |
| FirstName* | varchar(255) |  |
| LastName* | varchar(255) |  |
| Email | varchar(255) |  |
| Phone | varchar(255) |  |
| AlternatePhone | varchar(255) |  |
| Address | varchar(255) | Full street address, including apt # if applicable |
| State | varchar(255) | Non-abbreviated State |
| City | varchar(255) |  |
| Zip | int | Postal code |
| SSAIdentifier | int | Soaring Society ID (if any) |
| Created* | timestamp | default current_timestamp |

Examples: 

| PersonId | Member | Active | FirstName | LastName | Email | Phone | AlternatePhone | Address | State | City | Zip | SSAId | Created |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 123 | TRUE | John | Doe | mailto:johndoe@example.com | 1234567890 | 9876543210 | 123 Main Street | Maine | Portland | 12345 | 987654 | 2023-01-01 09:00:00 |
| 2 |  | TRUE | Jane | Smith | mailto:janesmith@example.com | 5551112222 |  | 456 Elm Avenue | Maine | Augusta | 67890 | 654321 | 2023-02-15 13:30:00 |
| 3 | 789 | FALSE | Michael | Johnson | mailto:michaeljohnson@example.com | 7778889999 |  | 789 Oak Street | Maine | Bangor | 54321 | 123456 | 2023-04-05 17:45:00 |
| 4 | 012 | TRUE | Emily | Davis | mailto:emilydavis@example.com | 9998887777 |  | 012 Pine Avenue | Maine | Lewiston | 45678 | 789012 | 2023-06-10 10:15:00 |
| 5 | 345 | TRUE | James | Brown | mailto:jamesbrown@example.com | 4445556666 | 1112223333 | 345 Maple Street | Maine | Auburn | 98765 | 345678 | 2023-07-20 14:30:00 |

---

## Flights

The **Flights** table stores information related to flight records within the FSA. It captures details about individual flights and its model takes after the flight log that currently exists in Google Sheets. It will log FSA club flights, as well as rides and visiting clubs’ flights. 

| Column | Type | Description |
| --- | --- | --- |
| FlightId* | pk |  |
| Pilot* | fk | PersonId |
| Passenger | fk | PersonId |
| Aircraft* | fk | AircraftId |
| BillTo | fk | PersonId to bill. If null, the pilot will be billed |
| LaunchMethod* | enum(aero, winch, car, self) |  |
| Type* | enum(member, premium, standard, neclub) | Type of flight for billing |
| Tender* | enum(cash, charge, check, nocharge) | How the flight will be billed |
| Collected | float | Amount collected for the flight. Assumes amounts are always in USD ($) |
| Start* | timestamp | Wheels up |
| End* | timestamp | Wheels down |
| Release* | int | Numeric altitude (5000, 1500, 400) only |
| Created* | timestamp |  |
| Memo | varchar(255) |  |

Example:

| FlightId | Pilot | Passenger | Aircraft | BillTo | LaunchMethod | Type | Tender | Collected | Start | End | Release | Memo | Created |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 123 | 456 | 789 | 456 | aero | member | charge | 0.00 | 2023-01-01 09:00:00 | 2023-01-01 11:00:00 | 5000 |  | 2023-01-01 11:00:00 |
| 2 | 234 |  | 890 |  | aero | premium | cash | 230.00 | 2023-02-15 13:30:00 | 2023-02-15 14:30:00 | 5000 | Intro Ride: 1-hour | 2023-02-15 14:30:00 |
| 3 | 345 | 678 | 901 |  | winch | member | nocharge | 0.00 | 2023-04-05 17:45:00 | 2023-04-05 17:47:00 | 400 | Rope break | 2023-04-05 17:47:00 |
| 4 | 456 | 789 | 012 |  | self | member | charge | 0.00 | 2023-06-10 10:15:00 | 2023-06-10 12:00:00 | 3000 |  | 2023-06-10 12:00:00 |
| 5 | 567 | 012 | 345 |  | winch | standard | check | 150.00 | 2023-07-20 15:30:00 | 2023-07-20 16:00:00 | 3000 | Intro Ride: 30-min | 2023-07-20 16:00:00 |

---

## Aircraft

The **Aircraft** table in the FSA Database contains information related to the aircrafts utilized at Franconia airport. These can be aircraft owned by FSA, another **club** or a **person**.

| Column | Type | Description |
| --- | --- | --- |
| AircraftId* | pk |  |
| Active* | boolean |  |
| Registration* | varchar(255) | FAA Tail # |
| Make* | varchar(255) |  |
| Model* | varchar(255) |  |
| Category* | enum(glider, airplane) |  |
| LastInspection* | timestamp |  |
| RegistrationExpires* | timestamp |  |
| Created* | timestamp |  |

Example:

| AircraftId | Active | Registration | Make | Model | Type | LastInspection | RegistrationExpires |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TRUE | N12345 | Cessna | L-19 | airplane | 2023-01-01 09:00:00 | 2023-12-31 23:59:59 |
| 2 | FALSE | N67890 | Piper | Pawnee | airplane | 2023-02-15 13:30:00 | 2023-11-30 23:59:59 |
| 3 | TRUE | N24680 | Schleicher | ASK-21 | glider | 2023-04-05 17:45:00 | 2023-10-31 23:59:59 |
| 4 | TRUE | N13579 | Schweizer | SGS 2-33 | glider | 2023-06-10 10:15:00 | 2023-09-30 23:59:59 |
| 5 | TRUE | N86420 | Grob | G103 Twin Astir | glider | 2023-07-20 14:30:00 | 2023-08-31 23:59:59 |

---

## Members

The **Members** table represents the membership information of individuals associated with the FSA or FSF. It stores details about club members, including their membership status, start and end dates, and other related information. Remember, not all **people** are **members**, but all **members** are **people.**

| Column | Type | Description |
| --- | --- | --- |
| MemberId* | pk |  |
| Person* | fk | PersonId |
| Active* | boolean |  |
| Started* | timestamp |  |
| Ended | timestamp |  |
| Created* | timestamp |  |

Example:

| MemberId | Person | Active | Started | Ended | Created |
| --- | --- | --- | --- | --- | --- |
| 1 | 123 | TRUE | 2022-03-15 09:00:00 | 2022-12-31 23:59:59 | 2022-03-15 09:00:00 |
| 2 | 234 | TRUE | 2021-07-01 13:30:00 |  | 2021-07-01 13:30:00 |
| 3 | 345 | FALSE | 2023-01-10 17:45:00 | 2023-06-30 23:59:59 | 2023-01-10 17:45:00 |
| 4 | 456 | TRUE | 2020-09-05 10:15:00 |  | 2020-09-05 10:15:00 |
| 5 | 567 | TRUE | 2023-03-20 14:30:00 |  | 2023-03-20 14:30:00 |
| 6 | 123 | TRUE | 2023-07-01 00:00:00 |  | 2023-07-01 00:00:00 |

---

## Certifications

The **Certifications** table contains information about certifications held by individuals associated with the FSA or FSF. In this model, ‘Certifications’ is used with broad meaning, representing many club-related certifications in addition to the aviation definition.

| Column | Type | Description |
| --- | --- | --- |
| CertificationId* | pk |  |
| Person* | fk | PersonId |
| Issuer | fk | PersonId |
| Type* | enum(medical, ground_operations, rating, endorsement) |  |
| Name* | varchar(255) |  |
| IssuerOrganization | varchar(255) |  |
| Memo | varchar(255) |  |
| Created* | timestamp |  |
| Issued* | timestamp |  |
| Expires | timestamp |  |

Example:

| CertificationId | Person | Issuer | Type | Name | IssuerOrganization | Memo | Created | Issued | Expires |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 123 |  | medical | Third-class Medical | FAA |  | 2022-03-15 09:00:00 | 2022-03-15 09:00:00 | 2027-03-31 09:00:00 |
| 2 | 234 |  | endorsement | Tow Pilot | FSA | FSA L-19 BirdDog | 2021-05-05 14:30:00 | 2021-05-05 14:30:00 |  |
| 3 | 234 | 567 | ground_operations  | Wing runner | FSA |  | 2021-07-01 13:30:00 | 2021-07-01 13:30:00 |  |
| 4 | 345 | 678 | rating | Private glider | FAA |  | 2023-01-10 17:45:00 | 2023-01-10 17:45:00 |  |
| 5 | 456 | 789 | endorsement | Solo in 1-26 | FSA |  | 2020-09-05 10:15:00 | 2020-09-05 10:15:00 |  |
| 6 | 567 | 890 | ground_operations | Duty Officer | FSA |  | 2020-10-05 10:15:00 | 2020-10-05 10:15:00 |  |
| 7 | 345 | 678 | endorsement | BFR | FSA | Completed in L-23 | 2023-02-10 13:45:00 | 2023-02-10 13:45:00 | 2025-02-28 13:45:00 |

---

## Clubs

The **Clubs** table stores information about the Franconia Soaring club, neighboring clubs such as Post Mills, GBSC, or any others.

| Column | Type | Description |
| --- | --- | --- |
| ClubId* | pk |  |
| Active* | boolean | default TRUE |
| Name* | varchar(255) |  |
| ShortName* | varchar(10) |  |
| Created* | timestamp | default CURRENT_TIMESTAMP |

Example:

| ClubId | Active | Name | ShortName | Created |
| --- | --- | --- | --- | --- |
| 1 | TRUE | Franconia Soaring Association | FSA | 2022-01-01 09:00:00 |
| 2 | FALSE | Sanford Soaring Club | SSC | 2021-07-15 13:30:00 |
| 3 | TRUE | Greater Boston Soaring Club | GBSC | 2023-04-05 17:45:00 |
| 4 | TRUE | Post Mills Soaring Club | PMSC | 2020-09-20 10:15:00 |
| 5 | TRUE | Sugarbush Soaring | SS | 2023-02-10 14:30:00 |

---

## Roles

The **Roles** table represents the roles or positions that a **person** can hold within the FSA or FSF. Roles have the ability to be private, making it so a users roles can be displayed in a UI, yet hide sensitive roles like admin or billing admin to those who don’t need that information. 

| Column | Type | Description |
| --- | --- | --- |
| RoleId* | pk |  |
| Created* | timestamp | default CURRENT_TIMESTAMP |
| Name* | varchar(255) |  |
| Description* | varchar(255) |  |
| Private* | boolean | Determines if the role is private or public (shown in UI). |

Example:

| RoleId | Created | Name | Description | Private |
| --- | --- | --- | --- | --- |
| 1 | 2022-03-15 09:00:00 | Member | Regular club member | FALSE |
| 2 | 2021-07-01 13:30:00 | Treasurer | Handles financial matters | FALSE |
| 3 | 2023-01-10 17:45:00 | President | Leader of the club | FALSE |
| 4 | 2020-09-05 10:15:00 | Tow Pilot | Certified pilot for towing gliders | FALSE |
| 5 | 2023-03-20 14:30:00 | Instructor | Provides flight instruction | FALSE |
| 6 | 2023-07-01 00:00:00 | Guest | Non-member guest | FALSE |
| 7 | 2023-07-01 00:00:00 | Admin | Administrator with full access and privileges | TRUE |
| 8 | 2023-07-01 00:00:00 | BillingAdmin | Administrator with access to billing operations | TRUE |

---

## Operations

The **Operations** table records information about operations conducted by the FSA. Operations can have a date in the past, present, or future. An operation and its related members (Flights, PersonOperations) are related by date. This is to paint a picture of who did what on a specific operating day or in a timeframe.

|  | Type | Description |
| --- | --- | --- |
| OperationId* | pk |  |
| Date* | date | Includes scheduled operations (i.e. weekend signup). |
| DutyOfficer | fk | PersonId |
| Created* | timestamp |  |
| Memo | varchar(255) | notes for the operation if any |

Example:

| OperationId | Date | DutyOfficer | Created | Memo |
| --- | --- | --- | --- | --- |
| 1 | 2023-03-15 | 123 | 2022-03-15 09:00:00 |  |
| 2 | 2021-07-01 | 234 | 2021-07-01 13:30:00 | Tow plane problems, ended early |
| 3 | 2023-01-10 | 345 | 2023-01-10 17:45:00 |  |
| 4 | 2020-09-05 | 456 | 2020-09-05 10:15:00 |  |
| 5 | 2023-03-20 | 567 | 2023-03-20 14:30:00 | Rained in PM, ended early |

---

## Billing

The **Billing** table tracks billing information for flights within the FSA. It stores details about the flight, including the flight ID, creation date, billing status, and whether the billing information has been sent to QuickBooks.

This makes up about half of the system to achieve a more efficient billing process. The other half I imagine to consist of two main parts:

1. **UI**: When a new flight is entered through the UI, a row is automatically created in the billing table with a `pending` status.
2. **Service**: A program that runs indefinitely checks every `x` minutes for flights with the `pending` status. If there are items that match that criteria, the program will gather data required to bill, then attempts to send that data to QuickBooks. To establish a connection to QuickBooks, use of an API and a service-specific key will be necessary.

| Column | Type | Description |
| --- | --- | --- |
| BillId* | pk |  |
| Flight* | fk | FlightId |
| Created* | timestamp |  |
| Status* | enum(pending, sent, cancelled) | Pending = not sent to QuickBooks
Sent = sent to QuickBooks
Cancelled = cancelled transaction, don’t send to QuickBooks

Default = Pending |
| Sent | timestamp |  |

Example:

| BillId | Flight | Created | Status | Sent |
| --- | --- | --- | --- | --- |
| 1 | 12 | 2020-09-05 10:15:00 | Sent | 2020-09-06 10:15:00 |
| 2 | 24 | 2021-07-01 13:30:00 | Sent | 2021-07-05 10:00:00 |
| 3 | 39 | 2022-03-15 09:00:00 | Cancelled |  |
| 4 | 48 | 2023-01-10 17:45:00 | Pending |  |
| 5 | 55 | 2023-03-20 14:30:00 | Pending |  |

---

## PersonOperations (sign-up for a day with soaring ops)

The **PersonOperations** table represents the sign-up records of individuals for specific operations or days with soaring operations.

| Column | Type | Description |
| --- | --- | --- |
| OperationPilotsId* | pk |  |
| Person* | fk | PersonId |
| Date* | date | Date of operation |
| Type | enum(ride, instructor, tow) | Type of pilot, if any (for credit) |
| Memo | varchar(255) | Additional notes or comments |

Example:

| Id* | PersonId | Date | Type | Memo |
| --- | --- | --- | --- | --- |
| 1 | 123 | 2022-03-15 | ride | Ride pilot for the day |
| 2 | 234 | 2021-07-01 | instructor | Would like to fly Blanik L-23 |
| 3 | 345 | 2023-01-10 | ride | Building solo time in 1-26 |
| 4 | 456 | 2020-09-05 | tow | BFR in SGS 2-33 |
| 5 | 567 | 2023-03-20 | instructor | Instructor and backup ride pilot |

---

## PersonClubs

The **PersonClubs** table establishes the relationship between individuals and the clubs they are affiliated with.

| Column | Type | Description |
| --- | --- | --- |
| PersonClubsId* | pk |  |
| Person* | fk | PersonId |
| Club* | fk | ClubId |

Example:

| PersonClubsId | Person | Club |
| --- | --- | --- |
| 1 | 123 | 1 |
| 2 | 234 | 2 |
| 3 | 345 | 1 |
| 4 | 456 | 3 |
| 5 | 567 | 2 |

---

## PersonRoles

The **PersonRoles** table establishes the relationship between individuals and the roles they hold within the FSA or FSF.

| Column | Type | Description |
| --- | --- | --- |
| PersonRolesId* | pk |  |
| Person* | fk | PersonId |
| Role* | fk | RoleId |

Example:

| PersonRolesId | Person | Role |
| --- | --- | --- |
| 1 | 123 | 1 |
| 2 | 234 | 2 |
| 3 | 345 | 3 |
| 4 | 456 | 1 |
| 5 | 567 | 4 |

---

## PersonAircraft

The **PersonAircraft** table establishes the relationship between individuals and the aircraft they are associated with.

| Column | Type | Description |
| --- | --- | --- |
| PersonAircraftId* | pk |  |
| Person* | fk | PersonId |
| Aircraft* | fk | AircraftId |

Example:

| PersonAircraftId | Person | Aircraft |
| --- | --- | --- |
| 1 | 123 | 1 |
| 2 | 234 | 2 |
| 3 | 345 | 3 |
| 4 | 456 | 2 |
| 5 | 567 | 1 |

---

## ClubAircraft

The **ClubAircraft** table establishes the relationship between clubs and the aircraft they have access to or own.

| Column | Type | Description |
| --- | --- | --- |
| PersonAircraftId* | pk |  |
| Club* | fk | ClubId |
| Aircraft* | fk | AircraftId |

Example:

| ClubAircraftId | Club | Aircraft |
| --- | --- | --- |
| 1 | 1 | 1 |
| 2 | 2 | 2 |
| 3 | 1 | 3 |
| 4 | 3 | 2 |
| 5 | 2 | 1 |

