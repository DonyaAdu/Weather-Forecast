const key = "3bd44e1217461fbc4f9070121632af27";

function createRain(card) {
    for (let i = 0; i < 10; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() + 's';
        card.appendChild(drop);
    }
}

function createSnow(card) {
    for (let i = 0; i < 10; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.width = 3 + Math.random() * 3 + 'px';
        flake.style.height = 3 + Math.random() * 3 + 'px';
        flake.style.animationDuration = 2 + Math.random() * 2 + 's';
        card.appendChild(flake);
    }
}

function createCloud(card) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    card.appendChild(cloud);
}

function getWeather() {
    const city = document.getElementById("city").value || "Tehran";
    const days = parseInt(document.getElementById("days").value);
    const cnt = days * 8;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=${cnt}&units=metric&appid=${key}`)
        .then(response => {
            if (!response.ok) throw new Error('City not found');
            return response.json();
        })
        .then(data => {
            if (!data.list || data.list.length === 0) throw new Error('No data available');

            let html = "";
            for (let i = 0; i < cnt; i += 8) {
                const dateObj = new Date(data.list[i].dt * 1000);
                const date = dateObj.toLocaleDateString("en-US");
                const label = i === 0 ? "Today" : i === 8 ? "Tomorrow" : date;
                const weather = data.list[i].weather[0].main;

                html += `<div class="day" data-weather="${weather}">
                            ${label}<br>
                            temp: ${data.list[i].main.temp}°C<br>
                            Status: ${data.list[i].weather[0].description}
                         </div>`;
            }

            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = html;

            document.querySelectorAll('.day').forEach(card => {
                const weather = card.dataset.weather;
                if (weather === 'Clear') {
                    const sun = document.createElement('div');
                    sun.className = 'sun';
                    card.appendChild(sun);
                } else if (weather === 'Rain' || weather === 'Drizzle') {
                    createRain(card);
                } else if (weather === 'Snow') {
                    createSnow(card);
                } else if (weather === 'Clouds') {
                    createCloud(card);
                }
            });
        })
        .catch(err => {
            document.getElementById("result").innerHTML = `Error: ${err.message}`;
        });
}