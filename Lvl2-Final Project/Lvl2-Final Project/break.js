// Activities database
const ActivitiesDatabase = {
  Play: [
    { 
    name: 'Mario Kart 🏎️', 
    category: 'Short Break', 
    neededItems: 'Nintendo console', 
    description: 'A fast-paced racing game where you compete on colorful tracks, dodge obstacles, and use fun power-ups to outpace your rivals.' 
  },

  { 
    name: 'Little Misfortune 🎀', 
    category: 'Short Break', 
    neededItems: 'PC or Console', 
    description: 'A darkly charming, story-driven adventure following Misfortune as she explores strange places filled with humor and emotional twists.' 
  },

  { 
    name: 'Animal Crossing 🌼', 
    category: 'Short Break', 
    neededItems: 'Nintendo console', 
    description: 'A calm life-simulation game where you fish, decorate, collect items, and relax on your own island with friendly animal villagers.' 
  },

  { 
    name: 'Barbie: 12 Dancing Princesses (DS) 👑', 
    category: 'Short Break', 
    neededItems: 'Nintendo DS', 
    description: 'A whimsical adventure based on the Barbie movie where you solve puzzles, learn dances, and explore magical worlds.' 
  },

  { 
    name: 'Tomodachi Life 😄', 
    category: 'Short Break', 
    neededItems: 'Nintendo 3DS', 
    description: 'A quirky life-sim where your Miis live on an island, create funny interactions, form relationships, and behave unpredictably.' 
  },

  { 
    name: 'Monopoly 🎲', 
    category: 'Short Break', 
    neededItems: 'Board game', 
    description: 'A classic strategy and negotiation board game where players buy properties, build houses, and try to bankrupt opponents.' 
  },

  { 
    name: 'Chess ♟️', 
    category: 'Short Break', 
    neededItems: 'Chess board or app', 
    description: 'A timeless strategic game where two players battle using logic, planning, and tactics to checkmate the opponent’s king.' 
  },

  { 
    name: 'Dave the Diver 🐟', 
    category: 'Short Break', 
    neededItems: 'PC or Console', 
    description: 'A cozy adventure where you explore the ocean by day, catch fish, and run your own sushi restaurant by night.' 
  },

  { 
    name: 'Disney Dreamlight Valley ✨', 
    category: 'Short Break', 
    neededItems: 'PC or Console', 
    description: 'A relaxing Disney life-sim where you complete quests, farm, cook, decorate, and help classic characters restore their magical world.' 
  },

  { 
    name: 'The Sims 🏡', 
    category: 'Short Break', 
    neededItems: 'PC or Console', 
    description: 'A sandbox life simulation where you build homes, create characters, guide their lives, and shape their relationships and careers.' 
  }
  ],
  Outside: [
    { 
    name: 'Go to the Movies 🍿', 
    category: 'Long Break', 
    neededItems: 'Movie Ticket', 
    description: 'Enjoy a new film, unplug from studying, and reset your mind in a cozy theater.' 
  },
  { 
    name: 'Eat Out for Sushi 🍣', 
    category: 'Short Break', 
    neededItems: 'Restaurant', 
    description: 'Treat yourself to a relaxing sushi meal and refresh your energy with good food.' 
  },
  { 
    name: 'Nature Walk 🌿', 
    category: 'Short Break', 
    neededItems: 'Comfortable Shoes', 
    description: 'Take a peaceful walk outside to clear your mind and get some fresh air.' 
  },
  { 
    name: 'Visit a Coffee Shop ☕', 
    category: 'Short Break', 
    neededItems: 'Wallet', 
    description: 'Sit somewhere cozy, sip your favorite drink, and mentally reset before studying again.' 
  },
  { 
    name: 'Visit a Local Park 🌳', 
    category: 'Short Break', 
    neededItems: 'None', 
    description: 'Sit on a bench or stroll around to relax, observe nature, and decompress.' 
  },
  { 
    name: 'Go Shopping 🛍️', 
    category: 'Long Break', 
    neededItems: 'Money', 
    description: 'Walk around your favorite stores, browse, and give your mind a fun distraction.' 
  },
  { 
    name: 'Beach Break 🏖️', 
    category: 'Long Break', 
    neededItems: 'Towel, sunblock, snacks', 
    description: 'Enjoy the sound of waves, sunshine, and a calming environment to reset your focus.' 
  },
  { 
    name: 'Go for Ice Cream 🍦', 
    category: 'Short Break', 
    neededItems: 'Wallet', 
    description: 'Take a sweet break and enjoy a treat to boost your mood and motivation.' 
  }
  ],
};

const OMDB_KEY = "89ada897";


const buttons = document.querySelectorAll('.break-btn');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('activities');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.id; // "WatchShow", "Play", or "Outside"

    // Active button styling
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Route based on which button
    if (key === "WatchShow") {
      loadMovies();
    } else {
      loadActivities(key);
    }
  });
});

// Local Database
function loadActivities(key) {
  loadingDiv.classList.remove('hidden');
  container.innerHTML = '';

  const activities = ActivitiesDatabase[key];

  setTimeout(() => {
    displayActivities(activities);
    loadingDiv.classList.add('hidden');
  }, 300);
}

function displayActivities(activitiesList) {
  if (!activitiesList || activitiesList.length === 0) {
    container.innerHTML = '<p class="no-activities">No activities found.</p>';
    return;
  }

  container.innerHTML = '';

  activitiesList.forEach(activity => {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const name = activity.name || 'Unknown Activity';
    const category = activity.category || 'General';
    const neededItems = activity.neededItems|| 'needed Items';
    const description = stripHTML(activity.description) || 'You deserve a break :)';

    card.innerHTML = `
      <h3>${name}</h3>
      <div class="category">${category} - Needed: ${neededItems}</div>
      <div class="description">${description}</div>
    `;

    container.appendChild(card);
  });
}

// Watch Movies option
async function loadMovies() {
  loadingDiv.classList.remove('hidden');
  container.innerHTML = "";

  try {
    const search = "marvel";
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${search}&type=movie`);
    const data = await res.json();

    if (!data.Search) {
      container.innerHTML = `<p class="no-activities">No movies found 😢</p>`;
      loadingDiv.classList.add("hidden");
      return;
    }

    const movies = data.Search.slice(0, 8);
    displayMovies(movies);

  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="no-activities">Error loading movies.</p>`;
  }

  loadingDiv.classList.add("hidden");
}

function displayMovies(movies) {
  container.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "activity-card";

    const poster = movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg";

    card.innerHTML = `
      <h3>${movie.Title}</h3>
      <div class="category">${movie.Year}</div>
      <img src="${poster}" alt="${movie.Title}" style="width:100%; border-radius:15px; margin-top:10px;">
    `;

    container.appendChild(card);
  });
}


function stripHTML(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.substring(0, 150) + (text.length > 150 ? '...' : '');
}
