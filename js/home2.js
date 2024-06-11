// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const platforms = urlParams.getAll('platforms');
const usernames = platforms.map(platform => urlParams.get(platform + '_username'));
const features = platforms.reduce((acc, platform) => {
    acc[platform] = urlParams.getAll('features_' + platform);
    return acc;
}, {});

const card = (UserName, platform) => {
    const cardIn = (id) => {
        const div = document.getElementById(`${id}`);
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';

        div.style.height = 'auto';
        div.style.width = '190px';
        div.style.margin = '10px';
        div.style.padding = '10px';
        div.style.borderRadius = '10px';

        div.style.backgroundColor = 'rgb(29, 29, 29)';
        div.style.color = 'white'

        div.style.transition = 'transform 0.3s ease'; // Smooth transition

        // Add hover effect with JavaScript
        div.addEventListener('mouseover', () => {
            div.style.transform = 'scale(1.4)';
        });

        div.addEventListener('mouseout', () => {
            div.style.transform = 'scale(1)';
        });
    }

    const addImage = (id, url) => {
        const img = document.querySelector(`#${id} img`);

        // img.style.backgroundImage = `${url}`; isse image nahin milegi, na hi set hogi, hogi to as bg hogi, jo pehle se koi color hai. Don't use this way
        img.setAttribute('src', url); // isse image 
        img.style.height = "160px";
        img.style.width = "160px";
        // img.style.margin = '10px'
        img.style.borderRadius = '50%'
        // img.style.marginLeft = '10px';
        // img.style.marginRight = '10px';
        console.log(url);
    }

    const addAbout = (id, urlName, urlParameter, parameter) => {
        const name = document.querySelector(`#${id} h3`);
        const followers = document.querySelector(`#${id} p`);

        name.innerHTML = `${urlName}`;
        followers.innerHTML = `${parameter}: ${urlParameter}`;

        name.style.margin = '20px 0 0 0';
        followers.style.margin = '0';
    }

    const addMore = (id, param1Url, param1) => {
        const parameter1 = document.querySelector(`#${id} #param1`);
        const parameter2 = document.querySelector(`#${id} #param2`);

        parameter1.innerHTML = `${param1}: ${param1Url}`;
        // parameter2.innerHTML = `${param2}: ${param2Url}`;
    }

    if (platform == "github") {
        fetch(`https://api.github.com/users/${UserName}`)
        .then((user) => {
            // user or response, kuchh bhi bolo
            return user.json();
        })
        .then((data) => {
            console.log(data);
            cardIn(platform);
            addImage(platform, data.avatar_url);
            addAbout(platform, data.name, data.public_repos, 'Repositories(Public)');
        })
        .catch((error) => console.log(error));

        fetch(`https://github-contributions-api.jogruber.de/v4/${UserName}`)
        .then((user) => {
            // user or response, kuchh bhi bolo
            return user.json();
        })
        .then((data) => {
            console.log(data);
            addMore(platform, data.contributions.length, 'Contributions');
        })
        .catch((error) => console.log(error));
    }

    else if (platform == "leetcode") {
        fetch(`https://alfa-leetcode-api.onrender.com/${UserName}`)
        .then((user) => {
            // user or response, kuchh bhi bolo
            return user.json();
        })
        .then((data) => {
            console.log(data);
            cardIn(platform);
            addImage(platform, data.avatar);
            addAbout(platform, data.name, data.ranking, 'Ranking');
        })
        .catch((error) => console.log(error));

        // for more
        fetch(`https://alfa-leetcode-api.onrender.com/${UserName}/solved`)
        .then((user) => {
            // user or response, kuchh bhi bolo
            return user.json();
        })
        .then((data) => {
            console.log(data);
            addMore(platform, data.solvedProblem, 'Problems Solved')
        })
        .catch((error) => console.log(error));
    }
};

if (platforms == 'github') {
    card(usernames, 'github');
}
else if (platforms == 'leetcode') {
    card(usernames, 'leetcode')
}

platforms.forEach((platform, index) => {
    const UserName = usernames[index];
    card(UserName, platform);
});