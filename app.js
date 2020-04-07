const API = require("./lib/API");
const readlineSync = require("readline-sync");
const films = API.read("films");

let selections = {
  id: "",
  film: "",
  time: "",
  tickets: ""
}

function filmCatalog(films) {

  for (const film of films) {
    console.log(`  --${film.id}: ${film.title}`);
  }

  console.log("                               ");
  let choice = readlineSync.questionInt("Pick a film from the list:   ");
  console.log("                               ");

  if (choice <= 0 || choice >= 6) {
    console.log("Sorry we didn't recognise that choice! Please choose again");
    console.log("                               ");
    filmCatalog(films);
  } else {
    selections.id = `${films[(choice - 1)].id}`;
    selections.film = `${films[(choice - 1)].title}`;

    console.log(`  --${films[(choice - 1)].title}`);
    console.log(`  --Length: ${films[(choice - 1)].duration} mins`)
    console.log(`  --Rating: ${films[(choice - 1)].ageRating}`);
    console.log("                               ");

    yesNo()
  }
}

function yesNo() {
  let quest = readlineSync.keyInYN(`Would you like to book ${selections.film}?`);
  if (quest === false) {
    console.log("                               ");
    filmCatalog(films);
    console.log("                               ");
  } else if (quest === true) {
    console.log("                               ");
    viewShowingTimes(films, selections);
    console.log("                               ");
  } else {
    yesNo();
  }
}

function viewShowingTimes(films, selections) {
  let num = 1;
  for (const time of films[selections.id - 1].times) {
    console.log(`  --${num}: ${time}`);
    num++
  }

  console.log("                               ");
  let choice = readlineSync.questionInt("Pick a time from the list:   ");
  console.log("                               ");

  if (choice <= 0 || choice >= num) {
    console.log("Sorry we didn't recognise that choice! Please choose again");
    console.log("                               ");
    viewShowingTimes(films, selections);
  } else {
    selections.time = `${films[selections.id - 1].times[(choice - 1)]}`;
    console.log("**     Your selection:     **");
    console.log(`Film:  ${selections.film}`);
    console.log(`Time:  ${films[selections.id - 1].times[(choice - 1)]}`);
    console.log("                               ");

    yesNo2()
  }
}

function yesNo2() {
  let quest = readlineSync.keyInYN(`Is this right?`);
  if (quest === false) {
    console.log("                               ");
    mainMenu();
    console.log("                               ");
  } else if (quest === true) {
    console.log("                               ");
    sellTicket(films, selections);
  } else {
    yesNo2();
  }
}

function sellTicket(films, selections) {
  let choice = readlineSync.questionInt("How many tickets would you like (max 10):  ");
  console.log("                               ");
  /*
  film.seating.rows
  
  let sold = films[selections.id-1].seating.rows;
  let totseats = rows * rowSeats;
  
  let rows = films[selections.id-1].seating.rows;
  let rowSeats = films[selections.id-1].seating.seats;
  
  console.log(sold);
  console.log(remainingSeats);
  */

  if (choice <= 0 || choice > 10) {
    console.log("Sorry selection too high! Please try again");
    console.log("                               ");
    sellTicket(films, selections);
  } /*else if (choice >= (remainingSeats - sold)){
    console.log("Sorry these seats are sold! Please try again");
    console.log("                               ");
    mainMenu();
    */
  else {
    selections.tickets = choice;

    console.log("**     Your selection:     **");
    console.log(`Film:       ${selections.film}`);
    console.log(`Time:       ${selections.time}`);
    console.log(`ticket no:  ${selections.tickets}`);
    console.log("                               ");

    yesNo3()
  }

  function yesNo3() {
    let quest = readlineSync.keyInYN(`Is this right?`);
    if (quest === false) {
      console.log("                               ");
      mainMenu();
      console.log("                               ");
    } else if (quest === true) {
      finished();
    } else {
      yesNo3();
    }
  }
  //let num = 1;
  //for (const avail of films[selections.id-1].ticketsSold.seatSold){
  //  console.log(`  --${num}: Seats available `+ (availability.rows * availability.seats))
  //  num++;
  //}
}

function finished() {
  console.log("                                  ");
  console.log("----------------------------------");
  console.log("**  Your booking is confirmed!  **");
  console.log("----------------------------------");
  console.log("**   Thanks for booking with    **");
  console.log("**      Mirrormax Cinema        **");
  console.log("----------------------------------");
  console.log("   We hope you enjoy your film! **");
  console.log("----------------------------------");
}

function mainMenu() {
  console.log("-------------------------------");
  console.log("**     Mirrormax Cinema      **");
  console.log("-------------------------------");
  console.log("**    View film selection    **");
  console.log("-------------------------------");

  const choice = readlineSync.questionInt("Please press 1 to see films: ");

  if (choice === 1) {
    console.log("                               ");
    console.log("-------------------------------");
    console.log("**     Our latest films:     **");
    console.log("-------------------------------");
    console.log("                               ");

    filmCatalog(films);
  } else {
    console.log("Sorry we didn't recognise that choice!");
    mainMenu();
  }
}

mainMenu();



