// Copyright (C) 4c65736975. All rights reserved.

const githubBtn = document.getElementById('button-redirect-github')

githubBtn.addEventListener('click', () => {
    const url = 'https://github.com/4c65736975/Modhub-2.0'

    return chrome.tabs.create({url: url})
})