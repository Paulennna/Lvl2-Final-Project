


// Exercises
const exerciseDatabase = {
    push: [
        { name: 'Bench Press', category: 'Chest', equipment: 'Barbell', description: 'Lie on a flat bench and press the barbell up from your chest until arms are fully extended.' },
        { name: 'Overhead Press', category: 'Shoulders', equipment: 'Barbell', description: 'Press the barbell overhead from shoulder height while standing with core engaged.' },
        { name: 'Incline Dumbbell Press', category: 'Chest', equipment: 'Dumbbells', description: 'Press dumbbells up on an incline bench to target upper chest muscles.' },
        { name: 'Dips', category: 'Triceps', equipment: 'Bodyweight', description: 'Support yourself on parallel bars and lower your body by bending elbows to 90 degrees.' },
        { name: 'Lateral Raises', category: 'Shoulders', equipment: 'Dumbbells', description: 'Raise dumbbells to the sides until arms are parallel to the floor, targeting shoulders.' },
        { name: 'Tricep Pushdown', category: 'Triceps', equipment: 'Cable', description: 'Push the cable attachment down while keeping elbows stationary at your sides.' },
        { name: 'Push-ups', category: 'Chest', equipment: 'Bodyweight', description: 'Lower your body until chest nearly touches the floor, then push back up.' },
        { name: 'Chest Flyes', category: 'Chest', equipment: 'Dumbbells', description: 'Open arms wide with dumbbells and bring them together over your chest in an arc motion.' }
    ],
    pull: [
        { name: 'Pull-ups', category: 'Back', equipment: 'Bodyweight', description: 'Hang from a bar with overhand grip and pull your body up until chin is over the bar.' },
        { name: 'Barbell Row', category: 'Back', equipment: 'Barbell', description: 'Bend over at 45 degrees and pull a barbell to your lower chest, squeezing shoulder blades.' },
        { name: 'Lat Pulldown', category: 'Back', equipment: 'Cable', description: 'Pull the bar down to your upper chest while seated, focusing on lat engagement.' },
        { name: 'Face Pulls', category: 'Back', equipment: 'Cable', description: 'Pull the rope towards your face with elbows high, targeting rear delts and upper back.' },
        { name: 'Bicep Curls', category: 'Biceps', equipment: 'Dumbbells', description: 'Curl dumbbells up while keeping elbows close to your body and controlling the movement.' },
        { name: 'Hammer Curls', category: 'Biceps', equipment: 'Dumbbells', description: 'Curl dumbbells with neutral grip (palms facing each other) to target brachialis.' },
        { name: 'Deadlift', category: 'Back', equipment: 'Barbell', description: 'Lift the barbell from the ground to hip level with straight back and engaged core.' },
        { name: 'Seated Cable Row', category: 'Back', equipment: 'Cable', description: 'Pull the cable handle to your torso while seated, keeping back straight and squeezing at the end.' }
    ],
    legs: [
        { name: 'Squats', category: 'Legs', equipment: 'Barbell', description: 'Lower your body by bending knees until thighs are parallel to ground, then drive back up.' },
        { name: 'Romanian Deadlift', category: 'Legs', equipment: 'Barbell', description: 'Lower the bar by hinging at hips while keeping legs mostly straight to target hamstrings.' },
        { name: 'Leg Press', category: 'Legs', equipment: 'Machine', description: 'Push the platform away using your legs while seated, keeping back flat against the pad.' },
        { name: 'Leg Curls', category: 'Legs', equipment: 'Machine', description: 'Curl your legs up against resistance while lying face down, targeting hamstrings.' },
        { name: 'Leg Extensions', category: 'Legs', equipment: 'Machine', description: 'Extend your legs against resistance while seated to isolate quadriceps.' },
        { name: 'Calf Raises', category: 'Legs', equipment: 'Machine', description: 'Raise your heels off the ground by pushing through toes, focusing on calf contraction.' },
        { name: 'Lunges', category: 'Legs', equipment: 'Dumbbells', description: 'Step forward and lower your body until both knees are bent at 90 degrees.' },
        { name: 'Bulgarian Split Squats', category: 'Legs', equipment: 'Dumbbells', description: 'Place rear foot on bench and lower into a single-leg squat position.' }
    ],
    cardio: [
        { name: 'Running', category: 'Cardio', equipment: 'None', description: 'Run at a steady pace for endurance or in intervals for high-intensity training.' },
        { name: 'Cycling', category: 'Cardio', equipment: 'Bike', description: 'Cycle on a stationary bike or outdoors maintaining consistent pace for cardiovascular fitness.' },
        { name: 'Jump Rope', category: 'Cardio', equipment: 'Jump Rope', description: 'Jump continuously over a rope for high-intensity cardio and coordination training.' },
        { name: 'Rowing Machine', category: 'Cardio', equipment: 'Rowing Machine', description: 'Row using full body motion, pushing with legs and pulling with arms in fluid rhythm.' },
        { name: 'Burpees', category: 'Cardio', equipment: 'Bodyweight', description: 'Drop to plank, do a push-up, jump feet to hands, then jump up with arms overhead.' },
        { name: 'Mountain Climbers', category: 'Cardio', equipment: 'Bodyweight', description: 'In plank position, rapidly alternate bringing knees to chest in running motion.' },
        { name: 'Box Jumps', category: 'Cardio', equipment: 'Box', description: 'Jump onto a box or platform, landing softly with bent knees, then step down.' },
        { name: 'High Knees', category: 'Cardio', equipment: 'Bodyweight', description: 'Run in place bringing knees up to hip level alternating quickly for cardio burst.' }
    ]
};

const buttons = document.querySelectorAll('.muscle-btn');
const loadingDiv = document.getElementById('loading');
const container = document.getElementById('exercises');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const day = btn.id;
        
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        loadExercises(day);
    });
});

async function loadExercises(day) {
    loadingDiv.classList.remove('hidden');
    container.innerHTML = '';
    
   // local database
    const exercises = exerciseDatabase[day];
    
    // loading effect
    setTimeout(() => {
        displayExercises(exercises);
        loadingDiv.classList.add('hidden');
    }, 300);
}

function displayExercises(exerciseList) {
    if (!exerciseList || exerciseList.length === 0) {
        container.innerHTML = '<p class="no-exercises">No exercises found for this muscle group.</p>';
        return;
    }
    
    exerciseList.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        
        const name = exercise.name || 'Unknown Exercise';
        const category = exercise.category?.name || exercise.category || 'Strength';
        
       
        let equipment;
        if (Array.isArray(exercise.equipment)) {
            equipment = exercise.equipment.map(e => e.name || e).join(', ');
        } else {
            equipment = exercise.equipment || 'Bodyweight';
        }
        
        const description = stripHTML(exercise.description) || 'A great exercise to build strength and muscle.';
        
        card.innerHTML = `
            <h3>${name}</h3>
            <div class="category">${category} - ${equipment}</div>
            <div class="description">${description}</div>
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