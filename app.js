const API = require("./lib/API");
const readlineSync = require("readline-sync");
const films = API.read("filmsMas");

let selections = {
  id: "",
  film: "",
  time: "",
  tickets: 0,
  ticketsRemain: "",
};

// Films to cycle through & updating main film id & film picked
let filmCatalog = (films) => {
  console.log("                               ");
  console.log("-------------------------------");
  console.log("**     Our latest films:     **");
  console.log("-------------------------------");
  console.log("                               ");
  for (const film of films) {
    console.log(`  --${film.id}: ${film.title}`);
  }
  console.log("                               ");
  let choice = readlineSync.questionInt(
    "Pick a film from the list to see more info:   "
  );
  console.log("                               ");

  if (choice <= 0 || choice >= 6) {
    console.log("Sorry we didn't recognise that choice! Please choose again");
    console.log("                               ");
    filmCatalog(films);
  } else {
    selections.id = `${films[choice - 1].id}`;
    selections.film = `${films[choice - 1].title}`;
    console.log(`  --${films[choice - 1].title}`);
    console.log(`  --Length:    ${films[choice - 1].duration} mins`);
    console.log(`  --Rating:    ${films[choice - 1].ageRating}`);
    console.log("                               ");
    yesNo();
  }
};

//Checking user has chosen correctly
let yesNo = () => {
  let quest = readlineSync.keyInYN(
    `Would you like to book ${selections.film}?`
  );
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
};

// Setting chosen film time to main selector & setting current seats remaining for that time
let viewShowingTimes = (films, selections) => {
  let num = 1;
  for (const time of films[selections.id - 1].times) {
    console.log(`  --${num}: ${time}`);
    num++;
  }
  console.log("                               ");
  let choice = readlineSync.questionInt(
    "Select a viewing time from the list:   "
  );
  console.log("                               ");

  if (choice <= 0 || choice >= num) {
    console.log("Sorry we didn't recognise that choice! Please choose again");
    console.log("                               ");
    viewShowingTimes(films, selections);
  } else {
    selections.time = `${films[selections.id - 1].times[choice - 1]}`;
    console.log(`  --Time Selected:        ${selections.time}`);
    let total = films[selections.id - 1].ticketTot;
    let tickArr = films[selections.id - 1].ticketsSold;
    for (let tix of tickArr) {
      if (selections.time === tix.time) {
        total -= tix.seatSold;
      } else {
        total = total;
      }
    }
    selections.ticketsRemain = total;
    console.log(`  --Tickets remaining:    ${total}`);
    console.log("                               ");
    sellTicket(films, selections);
  }
}

// setting num of tickets to sell, max 5.
let sellTicket = (films, selections) => {
  let choice = readlineSync.questionInt(
    "How many tickets would you like (max 5):  "
  );
  console.log("                               ");
  if (choice <= 0 || choice > 5) {
    console.log("Sorry selection is out of range! Please try again");
    console.log("                               ");
    sellTicket(films, selections);
  } else if (selections.ticketsRemain - choice <= 0) {
    console.log("Sorry all seats sold out, please make selection again");
    console.log("                               ");
    filmCatalog(films);
  } else {
    selections.tickets = choice;
    console.log("**         Your selection:          **");
    console.log(`Film:             ${selections.film}`);
    console.log(`Time:             ${selections.time}`);
    console.log(`tickets selected:  ${choice}`);
    console.log("                               ");
    yesNo2();
  }
};

// Checking current selection is right so far - if yes, update API for seats sold & update remaining tickets num in main selector. 

// NOTE to instructor. Am I using API right? I have tried lots of things and either my db.json will update with no new info, or it times out completely and I have to reset my terminal.
let yesNo2 = () => {
  let quest = readlineSync.keyInYN(`Is this right?`);
  if (quest === false) {
    console.log("                               ");
    filmCatalog(films);
    console.log("                               ");
  } else if (quest === true) {
    selections.ticketsRemain -= selections.tickets;
    let tickArr = films[selections.id - 1].ticketsSold;
    /*
    for (let tix of tickArr) {
      if (selections.time === tix.time) {
        let upd = tix.seatSold += selections.tickets;
        API.update("filmsMas", upd);
      } else {
        const tickArr = { time: tix.time, seatSold: selections.tickets };
        films[selections.id - 1].ticketsSold.push(tickArr);
        API.update("filmsMas", tickArr);
      }
    }
    */
    finished();
  } else {
    yesNo2();
  }
};

// Last message to show on title.
let finished = () => {
  console.log("                                   ");
  console.log("-----------------------------------");
  console.log("**  Your booking is confirmed!   **");
  console.log("-----------------------------------");
  console.log("**   Thanks for booking with     **");
  console.log("**      Mirrormax Cinema         **");
  console.log("-----------------------------------");
  console.log("    We hope you enjoy your film!   ");
  console.log("-----------------------------------");
  console.log("                                   ");
  console.log("                                   ");
  console.log("                                   ");
  console.log("                                   ");
  console.log("                                   ");
  console.log("                                   ");
};

let mainMenu = () => {
  console.log("-------------------------------");
  console.log("**     Mirrormax Cinema      **");
  console.log("-------------------------------");
  console.log("**    View film selection    **");
  console.log("-------------------------------");
  console.log("                               ");
  const choice = readlineSync.questionInt("Please press 1 to select a films: ");
  choice === 1
    ? filmCatalog(films)
    : console.log("Sorry we didn't recognise that choice!");
  mainMenu();
};

mainMenu();